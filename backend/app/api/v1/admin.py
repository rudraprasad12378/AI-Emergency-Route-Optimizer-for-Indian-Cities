from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.user import User
from app.models.emergency import Emergency
from app.models.vehicle import Vehicle
from app.models.incident import Incident
from app.models.station import Station
from app.utils.enums import EmergencyStatus, VehicleStatus, IncidentStatus
from app.schemas.audit import AuditLogOut
from app.schemas.common import PaginatedResponse
from app.services.audit_service import AuditService
from app.core.config import settings
from app.api.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin & System Intelligence"])


@router.get("/overview")
def get_system_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> Dict[str, Any]:
    """Provide comprehensive telemetry & operational status across Bhubaneswar emergency network."""
    total_emergencies = db.query(func.count(Emergency.id)).scalar() or 0
    active_emergencies = db.query(func.count(Emergency.id)).filter(
        Emergency.status.notin_([EmergencyStatus.COMPLETED, EmergencyStatus.CANCELLED])
    ).scalar() or 0
    
    total_vehicles = db.query(func.count(Vehicle.id)).scalar() or 0
    available_vehicles = db.query(func.count(Vehicle.id)).filter(
        Vehicle.status == VehicleStatus.AVAILABLE
    ).scalar() or 0
    en_route_vehicles = db.query(func.count(Vehicle.id)).filter(
        Vehicle.status.in_([VehicleStatus.EN_ROUTE, VehicleStatus.ASSIGNED, VehicleStatus.AT_SCENE])
    ).scalar() or 0
    
    active_incidents = db.query(func.count(Incident.id)).filter(
        Incident.status == IncidentStatus.ACTIVE
    ).scalar() or 0
    
    total_hospitals = db.query(func.count(Station.id)).filter(Station.type == "HOSPITAL").scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0

    return {
        "network_city": settings.DEFAULT_CITY,
        "environment": settings.ENVIRONMENT,
        "metrics": {
            "total_emergencies": total_emergencies,
            "active_emergencies": active_emergencies,
            "total_vehicles": total_vehicles,
            "available_vehicles": available_vehicles,
            "en_route_vehicles": en_route_vehicles,
            "active_incidents": active_incidents,
            "total_hospitals": total_hospitals,
            "total_users": total_users,
        },
        "ai_engine": {
            "eta_weight": settings.AI_ETA_WEIGHT,
            "traffic_weight": settings.AI_TRAFFIC_WEIGHT,
            "risk_weight": settings.AI_RISK_WEIGHT,
            "incident_penalty": settings.AI_INCIDENT_PENALTY,
            "green_corridor_bonus": settings.AI_GREEN_CORRIDOR_BONUS,
        }
    }


@router.get("/audit-logs", response_model=PaginatedResponse[AuditLogOut])
def get_audit_trail(
    action: Optional[str] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    user_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Inspect immutable audit logs for compliance, security checks, and incident forensics."""
    service = AuditService(db)
    items, total = service.get_logs(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        user_id=user_id,
        page=page,
        limit=limit,
    )
    return PaginatedResponse.create(
        items=[AuditLogOut.model_validate(log) for log in items],
        total=total,
        page=page,
        limit=limit,
    )
