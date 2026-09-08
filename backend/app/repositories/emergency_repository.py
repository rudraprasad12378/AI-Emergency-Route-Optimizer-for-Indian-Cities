from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.emergency import Emergency
from app.utils.enums import EmergencyStatus, EmergencyPriority, EmergencyType


class EmergencyRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, emergency_id: str) -> Optional[Emergency]:
        stmt = (
            select(Emergency)
            .where(Emergency.id == emergency_id)
            .options(joinedload(Emergency.assigned_vehicle), joinedload(Emergency.destination_hospital))
        )
        return self.db.scalars(stmt).first()

    def get_by_emergency_number(self, emergency_number: str) -> Optional[Emergency]:
        stmt = select(Emergency).where(Emergency.emergency_number == emergency_number)
        return self.db.scalars(stmt).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[EmergencyStatus] = None,
        priority: Optional[EmergencyPriority] = None,
        emergency_type: Optional[EmergencyType] = None,
        citizen_id: Optional[str] = None,
        assigned_vehicle_id: Optional[str] = None,
        hospital_id: Optional[str] = None
    ) -> List[Emergency]:
        stmt = select(Emergency).options(
            joinedload(Emergency.assigned_vehicle),
            joinedload(Emergency.destination_hospital)
        )
        if status:
            stmt = stmt.where(Emergency.status == status)
        if priority:
            stmt = stmt.where(Emergency.priority == priority)
        if emergency_type:
            stmt = stmt.where(Emergency.type == emergency_type)
        if citizen_id:
            stmt = stmt.where(Emergency.citizen_id == citizen_id)
        if assigned_vehicle_id:
            stmt = stmt.where(Emergency.assigned_vehicle_id == assigned_vehicle_id)
        if hospital_id:
            stmt = stmt.where(Emergency.destination_hospital_id == hospital_id)
        
        stmt = stmt.offset(skip).limit(limit).order_by(Emergency.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def count(
        self,
        status: Optional[EmergencyStatus] = None,
        priority: Optional[EmergencyPriority] = None,
        emergency_type: Optional[EmergencyType] = None,
        citizen_id: Optional[str] = None
    ) -> int:
        stmt = select(Emergency)
        if status:
            stmt = stmt.where(Emergency.status == status)
        if priority:
            stmt = stmt.where(Emergency.priority == priority)
        if emergency_type:
            stmt = stmt.where(Emergency.type == emergency_type)
        if citizen_id:
            stmt = stmt.where(Emergency.citizen_id == citizen_id)
        return len(list(self.db.scalars(stmt).all()))

    def create(self, emergency: Emergency) -> Emergency:
        self.db.add(emergency)
        self.db.commit()
        self.db.refresh(emergency)
        return emergency

    def update(self, emergency: Emergency) -> Emergency:
        self.db.commit()
        self.db.refresh(emergency)
        return emergency
