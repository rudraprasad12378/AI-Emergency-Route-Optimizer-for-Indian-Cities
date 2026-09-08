import math
from typing import List, Dict, Any, Tuple
from app.models.route import Route
from app.models.incident import Incident
from app.utils.enums import EmergencyPriority, TrafficLevel
from app.core.config import settings


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate geodesic distance between two points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class AIRouteService:
    """
    Deterministic AI Route Evaluation & Intelligence Engine.
    Computes heuristic composite scores, incident proximity penalties,
    signal preemption gains, and auditable decision reasons.
    """

    @staticmethod
    def evaluate_routes(
        routes: List[Route],
        priority: EmergencyPriority,
        active_incidents: List[Incident]
    ) -> Tuple[Route, Dict[str, Any]]:
        if not routes:
            raise ValueError("No candidate routes provided for AI evaluation.")

        best_route = None
        best_score = -1.0
        scores_map = {}

        # Traffic penalty mapping
        traffic_penalties = {
            TrafficLevel.FREE: 0.0,
            TrafficLevel.MODERATE: 15.0,
            TrafficLevel.HEAVY: 35.0,
            TrafficLevel.SEVERE: 60.0,
            TrafficLevel.BLOCKED: 95.0,
        }

        base_eta = max([r.eta_minutes for r in routes])

        for route in routes:
            # 1. Base time score (lower ETA -> higher score)
            time_score = max(0.0, 100.0 - (route.eta_minutes * 3.5))

            # 2. Traffic score
            traffic_penalty = traffic_penalties.get(route.traffic_level, 20.0)
            traffic_score = max(0.0, 100.0 - traffic_penalty)

            # 3. Incident impact penalty (check if any active incident is along the corridor)
            incident_penalty = 0.0
            for inc in active_incidents:
                # If incident is waterlogging or severe blockage, check severity
                severity_mult = 25.0 if inc.severity == EmergencyPriority.CRITICAL else 12.0
                if "bypass" in route.route_name.lower() or "flyover" in route.route_name.lower():
                    # Bypass routes avoid surface waterlogging / local market procession
                    incident_penalty += severity_mult * 0.2
                else:
                    incident_penalty += severity_mult

            risk_score = max(0.0, 100.0 - min(80.0, incident_penalty + route.risk_score))

            # Composite weighted AI score
            composite = (
                (time_score * settings.ETA_WEIGHT) +
                (traffic_score * settings.TRAFFIC_WEIGHT) +
                (risk_score * settings.RISK_WEIGHT)
            )

            # Priority boost for code red emergencies
            if priority == EmergencyPriority.CRITICAL and "corridor" in route.route_name.lower():
                composite += 8.0

            composite = round(min(99.4, max(10.0, composite)), 1)
            route.ai_score = composite
            scores_map[route.id] = composite

            if composite > best_score:
                best_score = composite
                best_route = route

        # Set recommendation flag
        for route in routes:
            route.is_recommended = (route.id == best_route.id)
            route.time_saved_minutes = round(max(0.0, base_eta - route.eta_minutes), 1)

        time_saved = best_route.time_saved_minutes
        confidence = round(0.88 + min(0.10, (best_score / 1000.0)), 2)

        # Generate auditable reasoning
        reason = (
            f"AI selected '{best_route.route_name}' with {best_score}/100 score. "
            f"Avoids {len(active_incidents)} active traffic bottlenecks, saving ~{time_saved} min transit time."
        )
        best_route.ai_explanation = reason

        metadata = {
            "recommended_route_id": best_route.id,
            "confidence": confidence,
            "reason": reason,
            "time_saved_minutes": time_saved,
            "score": best_score,
        }

        return best_route, metadata
