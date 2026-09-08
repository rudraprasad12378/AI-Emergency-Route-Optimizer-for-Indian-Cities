from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.incident import Incident
from app.utils.enums import IncidentType, IncidentSeverity, IncidentStatus


class IncidentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, incident_id: str) -> Optional[Incident]:
        return self.db.get(Incident, incident_id)

    def get_all(
        self,
        skip: int = 0,
        limit: int = 50,
        incident_type: Optional[IncidentType] = None,
        severity: Optional[IncidentSeverity] = None,
        status: Optional[IncidentStatus] = None
    ) -> List[Incident]:
        stmt = select(Incident)
        if incident_type:
            stmt = stmt.where(Incident.type == incident_type)
        if severity:
            stmt = stmt.where(Incident.severity == severity)
        if status:
            stmt = stmt.where(Incident.status == status)
        stmt = stmt.offset(skip).limit(limit).order_by(Incident.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_active(self) -> List[Incident]:
        stmt = select(Incident).where(Incident.status == IncidentStatus.ACTIVE)
        return list(self.db.scalars(stmt).all())

    def get_active_incidents(self) -> List[Incident]:
        return self.get_active()

    def count(
        self,
        incident_type: Optional[IncidentType] = None,
        severity: Optional[IncidentSeverity] = None,
        status: Optional[IncidentStatus] = None
    ) -> int:
        stmt = select(Incident)
        if incident_type:
            stmt = stmt.where(Incident.type == incident_type)
        if severity:
            stmt = stmt.where(Incident.severity == severity)
        if status:
            stmt = stmt.where(Incident.status == status)
        return len(list(self.db.scalars(stmt).all()))

    def create(self, incident: Incident) -> Incident:
        self.db.add(incident)
        self.db.commit()
        self.db.refresh(incident)
        return incident

    def update(self, incident: Incident) -> Incident:
        self.db.commit()
        self.db.refresh(incident)
        return incident
