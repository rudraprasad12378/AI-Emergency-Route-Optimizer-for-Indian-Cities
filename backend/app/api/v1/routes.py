from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.route import RouteCalculationRequest, RouteCalculationResponse, RerouteRequest, RerouteResponse, RouteOut, RouteEventOut
from app.services.route_service import RouteService
from app.api.dependencies import get_current_user, require_dispatcher

router = APIRouter(prefix="/routes", tags=["Routes & AI Optimization"])


@router.get("/emergency/{emergency_id}", response_model=List[RouteOut])
def get_routes_for_emergency(
    emergency_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all candidate and selected routes for an emergency."""
    service = RouteService(db)
    routes = service.get_routes_for_emergency(emergency_id)
    return [RouteOut.model_validate(r) for r in routes]


@router.get("/emergency/{emergency_id}/events", response_model=List[RouteEventOut])
def get_route_events(
    emergency_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get audit trail of route changes, reroutes, and green corridor approvals."""
    service = RouteService(db)
    events = service.get_route_events_for_emergency(emergency_id)
    return [RouteEventOut.model_validate(e) for e in events]


@router.post("/calculate", response_model=RouteCalculationResponse)
def calculate_routes(
    calc_data: RouteCalculationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculate and AI-evaluate multi-candidate routes between pickup and destination.
    Evaluates real-time incident proximity, bottleneck severity, and live traffic levels.
    """
    service = RouteService(db)
    return service.calculate_and_evaluate_routes(
        emergency_id=calc_data.emergency_id,
        pickup_lat=calc_data.pickup_lat,
        pickup_lng=calc_data.pickup_lng,
        dest_lat=calc_data.dest_lat,
        dest_lng=calc_data.dest_lng,
        priority=calc_data.priority,
        avoid_incidents=calc_data.avoid_incidents,
    )


@router.post("/reroute", response_model=RerouteResponse)
def execute_reroute(
    reroute_data: RerouteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    """
    Dispatcher approval of dynamic corridor reroute due to newly detected hazards or congestion.
    Calculates new candidates, commits route event, updates ETA, and broadcasts notifications.
    """
    service = RouteService(db)
    return service.execute_reroute(
        emergency_id=reroute_data.emergency_id,
        reason=reroute_data.reason,
        incident_id=reroute_data.incident_id,
        current_user_id=current_user.id,
    )
