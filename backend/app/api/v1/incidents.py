from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.utils.enums import IncidentType, IncidentSeverity, IncidentStatus
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResolve, IncidentOut
from app.schemas.common import PaginatedResponse
from app.services.incident_service import IncidentService
from app.api.dependencies import get_current_user, require_dispatcher

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.get("", response_model=PaginatedResponse[IncidentOut])
def list_incidents(
    status: Optional[IncidentStatus] = None,
    severity: Optional[IncidentSeverity] = None,
    type: Optional[IncidentType] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List traffic obstacles and road incidents with filtering and pagination."""
    service = IncidentService(db)
    items, total = service.get_incidents(status=status, severity=severity, incident_type=type, page=page, limit=limit)
    return PaginatedResponse.create(items=[IncidentOut.model_validate(inc) for inc in items], total=total, page=page, limit=limit)


@router.get("/active", response_model=List[IncidentOut])
def list_active_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all active incidents for map overlay and real-time route weighting."""
    service = IncidentService(db)
    incidents = service.get_active_incidents()
    return [IncidentOut.model_validate(inc) for inc in incidents]


@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve single incident details."""
    service = IncidentService(db)
    incident = service.get_incident_by_id(incident_id)
    return IncidentOut.model_validate(incident)


@router.post("", response_model=IncidentOut, status_code=status.HTTP_201_CREATED)
def report_incident(
    incident_data: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    """Report a new road incident, waterlogging, or blockade (Dispatcher/Traffic Admin)."""
    service = IncidentService(db)
    incident = service.create_incident(incident_data, reported_by=current_user.id)
    return IncidentOut.model_validate(incident)


@router.patch("/{incident_id}", response_model=IncidentOut)
def update_incident(
    incident_id: str,
    incident_data: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    """Update details or severity of an incident."""
    service = IncidentService(db)
    incident = service.update_incident(incident_id, incident_data, current_user_id=current_user.id)
    return IncidentOut.model_validate(incident)


@router.post("/{incident_id}/resolve", response_model=IncidentOut)
def resolve_incident(
    incident_id: str,
    resolve_data: IncidentResolve,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    """Mark an incident as resolved, restoring normal corridor throughput."""
    service = IncidentService(db)
    incident = service.resolve_incident(incident_id, resolve_data, current_user_id=current_user.id)
    return IncidentOut.model_validate(incident)
