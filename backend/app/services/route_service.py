import json
import uuid
from datetime import datetime, timezone
from typing import List, Tuple, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.route import Route
from app.models.route_event import RouteEvent
from app.models.emergency import Emergency
from app.models.user import User
from app.repositories.route_repository import RouteRepository
from app.repositories.emergency_repository import EmergencyRepository
from app.repositories.incident_repository import IncidentRepository
from app.services.ai_route_service import AIRouteService
from app.services.notification_service import NotificationService
from app.services.audit_service import AuditService
from app.core.exceptions import NotFoundError
from app.schemas.route import (
    RouteResponse,
    RouteEventResponse,
    AIRecommendationDetail,
    AIRecommendationResponse,
    RouteCalculationResponse,
    RerouteResponse,
)
from app.utils.enums import RouteEventType, TrafficLevel, EmergencyPriority, AuditAction


class RouteService:
    def __init__(self, db: Session):
        self.db = db
        self.route_repo = RouteRepository(db)
        self.emergency_repo = EmergencyRepository(db)
        self.incident_repo = IncidentRepository(db)
        self.notif_service = NotificationService(db)
        self.audit_service = AuditService(db)

    def get_routes_for_emergency(self, emergency_id: str) -> List[Route]:
        routes = self.route_repo.get_by_emergency_id(emergency_id)
        if not routes:
            routes, _ = self.calculate_routes(emergency_id)
        return routes

    def get_route_events_for_emergency(self, emergency_id: str) -> List[RouteEvent]:
        return self.route_repo.get_events_by_emergency_id(emergency_id)

    def calculate_and_evaluate_routes(
        self,
        emergency_id: Optional[str] = None,
        pickup_lat: float = 20.2961,
        pickup_lng: float = 85.8245,
        dest_lat: float = 20.2312,
        dest_lng: float = 85.7766,
        priority: EmergencyPriority = EmergencyPriority.CRITICAL,
        avoid_incidents: bool = True,
    ) -> RouteCalculationResponse:
        active_incidents = self.incident_repo.get_active() if avoid_incidents else []
        has_incidents = len(active_incidents) > 0

        target_emg_id = emergency_id or str(uuid.uuid4())

        # Generate candidates
        now = datetime.now(timezone.utc)
        route_1 = Route(
            id=str(uuid.uuid4()),
            emergency_id=target_emg_id,
            route_name="Route A: Janpath Smart Flyover Corridor",
            distance_km=8.2,
            eta_minutes=12 if not has_incidents else 16,
            traffic_level=TrafficLevel.FREE if not has_incidents else TrafficLevel.MODERATE,
            risk_score=12.0 if not has_incidents else 45.0,
            confidence_score=0.95,
            created_at=now,
            waypoints_json=json.dumps([
                [pickup_lat, pickup_lng],
                [20.2750, 85.8320],
                [20.2600, 85.7950],
                [dest_lat, dest_lng],
            ])
        )

        route_2 = Route(
            id=str(uuid.uuid4()),
            emergency_id=target_emg_id,
            route_name="Route B: Siripur - Khandagiri AI Bypass",
            distance_km=9.4,
            eta_minutes=11 if has_incidents else 14,
            traffic_level=TrafficLevel.FREE,
            risk_score=10.0,
            confidence_score=0.92,
            created_at=now,
            waypoints_json=json.dumps([
                [pickup_lat, pickup_lng],
                [20.2600, 85.8200],
                [20.2400, 85.7800],
                [dest_lat, dest_lng],
            ])
        )

        route_3 = Route(
            id=str(uuid.uuid4()),
            emergency_id=target_emg_id,
            route_name="Route C: Rasulgarh Arterial",
            distance_km=11.6,
            eta_minutes=20,
            traffic_level=TrafficLevel.HEAVY,
            risk_score=35.0,
            confidence_score=0.84,
            created_at=now,
            waypoints_json=json.dumps([
                [pickup_lat, pickup_lng],
                [20.2900, 85.8500],
                [dest_lat, dest_lng],
            ])
        )

        candidates = [route_1, route_2, route_3]

        best_route, metadata = AIRouteService.evaluate_routes(
            routes=candidates,
            priority=priority,
            active_incidents=active_incidents
        )

        if emergency_id:
            self.route_repo.clear_routes_for_emergency(emergency_id)
            saved_candidates = [self.route_repo.create(r) for r in candidates]
            candidates = saved_candidates
            best_route = next(r for r in candidates if r.id == metadata["recommended_route_id"])

        route_responses = [RouteResponse.model_validate(r) for r in candidates]

        ai_rec_detail = AIRecommendationDetail(
            recommended_route_id=best_route.id,
            confidence=metadata["confidence"],
            reason=metadata["reason"],
            time_saved_minutes=metadata["time_saved_minutes"],
            score=metadata["score"],
        )

        return RouteCalculationResponse(
            routes=route_responses,
            candidate_routes=route_responses,
            ai_recommendation=ai_rec_detail,
            recommended_route_id=best_route.id,
            confidence=metadata["confidence"],
            reason=metadata["reason"],
            time_saved_minutes=metadata["time_saved_minutes"],
            score=metadata["score"],
        )

    def calculate_routes(
        self,
        emergency_id: str,
        actor: Optional[User] = None
    ) -> Tuple[List[Route], Dict[str, Any]]:
        emergency = self.emergency_repo.get_by_id(emergency_id)
        if not emergency:
            raise NotFoundError("Emergency", emergency_id)

        ai_response = self.calculate_and_evaluate_routes(
            emergency_id=emergency_id,
            pickup_lat=emergency.pickup_latitude,
            pickup_lng=emergency.pickup_longitude,
            dest_lat=emergency.destination_latitude,
            dest_lng=emergency.destination_longitude,
            priority=emergency.priority,
            avoid_incidents=True,
        )

        routes = self.route_repo.get_by_emergency_id(emergency_id)
        recommended = next(r for r in routes if r.is_recommended)

        emergency.eta_minutes = recommended.eta_minutes
        emergency.distance_remaining_km = recommended.distance_km
        self.emergency_repo.update(emergency)

        meta = {
            "recommended_route_id": ai_response.recommended_route_id,
            "confidence": ai_response.confidence,
            "reason": ai_response.reason,
            "time_saved_minutes": ai_response.time_saved_minutes,
            "score": ai_response.score,
        }
        return routes, meta

    def execute_reroute(
        self,
        emergency_id: str,
        reason: str,
        incident_id: Optional[str] = None,
        current_user_id: Optional[str] = None,
        actor: Optional[User] = None,
    ) -> RerouteResponse:
        emergency = self.emergency_repo.get_by_id(emergency_id)
        if not emergency:
            raise NotFoundError("Emergency", emergency_id)

        user_id = current_user_id or (actor.id if actor else None)
        old_eta = emergency.eta_minutes
        routes, meta = self.calculate_routes(emergency_id)
        recommended = next(r for r in routes if r.is_recommended)

        event = RouteEvent(
            emergency_id=emergency.id,
            route_id=recommended.id,
            event_type=RouteEventType.REROUTE_APPROVED,
            reason=reason or meta.get("reason", "Dynamic AI traffic recalculation"),
            old_eta_minutes=old_eta,
            new_eta_minutes=recommended.eta_minutes,
            triggered_by_id=user_id,
            details_json=json.dumps(meta)
        )
        saved_event = self.route_repo.create_event(event)

        # Notify Driver and Hospital
        self.notif_service.send_notification(
            title=f"AI Reroute Dispatched: {emergency.emergency_number}",
            message=f"New route locked: {recommended.route_name}. ETA updated to {recommended.eta_minutes} min.",
            target_role="driver",
            emergency_id=emergency.id,
            notification_type="success"
        )
        self.notif_service.send_notification(
            title=f"ETA Update for Inbound Unit",
            message=f"Ambulance for {emergency.emergency_number} rerouted. Expected arrival in {recommended.eta_minutes} mins.",
            target_role="hospital",
            emergency_id=emergency.id,
            notification_type="info"
        )

        self.audit_service.log_action(
            action=AuditAction.REROUTE,
            entity_type="emergency",
            entity_id=emergency.id,
            user_id=user_id,
            metadata={"new_route_id": recommended.id, "new_eta": recommended.eta_minutes, "old_eta": old_eta}
        )

        route_models = [RouteResponse.model_validate(r) for r in routes]
        ai_detail = AIRecommendationDetail(
            recommended_route_id=recommended.id,
            confidence=meta["confidence"],
            reason=meta["reason"],
            time_saved_minutes=meta["time_saved_minutes"],
            score=meta["score"],
        )

        return RerouteResponse(
            status="REROUTED",
            emergency_id=emergency.id,
            event_id=saved_event.id,
            new_eta_minutes=recommended.eta_minutes,
            routes=route_models,
            ai_recommendation=ai_detail
        )
