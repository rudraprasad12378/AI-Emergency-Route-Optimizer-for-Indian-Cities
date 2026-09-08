from datetime import datetime, timezone
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models.incident import Incident
from app.models.user import User
from app.repositories.incident_repository import IncidentRepository
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResolve
from app.core.exceptions import NotFoundError
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService
from app.utils.enums import IncidentStatus, IncidentType, IncidentSeverity, AuditAction


class IncidentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = IncidentRepository(db)
        self.audit_service = AuditService(db)
        self.notif_service = NotificationService(db)

    def get_incident_by_id(self, incident_id: str) -> Incident:
        inc = self.repo.get_by_id(incident_id)
        if not inc:
            raise NotFoundError("Incident", incident_id)
        return inc

    def get_incident(self, incident_id: str) -> Incident:
        return self.get_incident_by_id(incident_id)

    def get_incidents(
        self,
        status: Optional[IncidentStatus] = None,
        severity: Optional[IncidentSeverity] = None,
        incident_type: Optional[IncidentType] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Incident], int]:
        skip = (page - 1) * limit
        items = self.repo.get_all(skip=skip, limit=limit, incident_type=incident_type, severity=severity, status=status)
        total = self.repo.count(incident_type=incident_type, severity=severity, status=status)
        return items, total

    def list_incidents(
        self,
        skip: int = 0,
        limit: int = 50,
        incident_type: Optional[IncidentType] = None,
        severity: Optional[IncidentSeverity] = None,
        status: Optional[IncidentStatus] = None
    ) -> List[Incident]:
        return self.repo.get_all(skip=skip, limit=limit, incident_type=incident_type, severity=severity, status=status)

    def get_active_incidents(self) -> List[Incident]:
        return self.repo.get_active()

    def create_incident(self, inc_in: IncidentCreate, reported_by: Optional[str] = None) -> Incident:
        inc = Incident(
            title=inc_in.title,
            type=inc_in.type,
            severity=inc_in.severity,
            status=IncidentStatus.ACTIVE,
            latitude=inc_in.latitude,
            longitude=inc_in.longitude,
            address=inc_in.address,
            description=inc_in.description,
            delay_minutes=inc_in.delay_minutes,
            radius_meters=inc_in.radius_meters,
            created_by_id=reported_by,
            started_at=datetime.now(timezone.utc)
        )
        created = self.repo.create(inc)

        self.audit_service.log_action(
            action=AuditAction.CREATE_INCIDENT,
            entity_type="incident",
            entity_id=created.id,
            user_id=reported_by,
            metadata={"title": created.title, "severity": created.severity.value, "delay_min": created.delay_minutes}
        )

        self.notif_service.send_notification(
            title=f"Road Hazard: {created.title}",
            message=f"{created.type.value.replace('_', ' ').capitalize()} reported near {created.address}. AI avoidance radius active.",
            target_role="dispatcher",
            notification_type="warning"
        )
        return created

    def report_incident(self, inc_in: IncidentCreate, actor: User) -> Incident:
        return self.create_incident(inc_in=inc_in, reported_by=actor.id if actor else None)

    def update_incident(self, incident_id: str, inc_in: IncidentUpdate, current_user_id: Optional[str] = None) -> Incident:
        inc = self.get_incident_by_id(incident_id)
        if inc_in.title is not None:
            inc.title = inc_in.title
        if inc_in.severity is not None:
            inc.severity = inc_in.severity
        if inc_in.status is not None:
            inc.status = inc_in.status
        if inc_in.description is not None:
            inc.description = inc_in.description
        if inc_in.delay_minutes is not None:
            inc.delay_minutes = inc_in.delay_minutes
        return self.repo.update(inc)

    def resolve_incident(self, incident_id: str, resolve_data: Optional[IncidentResolve] = None, current_user_id: Optional[str] = None) -> Incident:
        inc = self.get_incident_by_id(incident_id)
        inc.status = IncidentStatus.RESOLVED
        inc.resolved_at = datetime.now(timezone.utc)
        updated = self.repo.update(inc)

        self.audit_service.log_action(
            action=AuditAction.RESOLVE_INCIDENT,
            entity_type="incident",
            entity_id=updated.id,
            user_id=current_user_id,
            metadata={"title": updated.title}
        )
        return updated
