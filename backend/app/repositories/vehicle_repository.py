from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.vehicle import Vehicle
from app.utils.enums import VehicleType, VehicleStatus


class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, vehicle_id: str) -> Optional[Vehicle]:
        return self.db.get(Vehicle, vehicle_id)

    def get_by_id_for_update(self, vehicle_id: str) -> Optional[Vehicle]:
        """
        Locks the vehicle row with SELECT ... FOR UPDATE (in PostgreSQL)
        to prevent race conditions / double assignments by simultaneous dispatchers.
        """
        # SQLite does not support FOR UPDATE, but PostgreSQL does
        stmt = select(Vehicle).where(Vehicle.id == vehicle_id)
        if self.db.bind and self.db.bind.dialect.name == "postgresql":
            stmt = stmt.with_for_update()
        return self.db.scalars(stmt).first()

    def get_by_call_sign(self, call_sign: str) -> Optional[Vehicle]:
        stmt = select(Vehicle).where(Vehicle.call_sign == call_sign)
        return self.db.scalars(stmt).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 50,
        vehicle_type: Optional[VehicleType] = None,
        status: Optional[VehicleStatus] = None
    ) -> List[Vehicle]:
        stmt = select(Vehicle)
        if vehicle_type:
            stmt = stmt.where(Vehicle.type == vehicle_type)
        if status:
            stmt = stmt.where(Vehicle.status == status)
        stmt = stmt.offset(skip).limit(limit).order_by(Vehicle.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def count(self, vehicle_type: Optional[VehicleType] = None, status: Optional[VehicleStatus] = None) -> int:
        stmt = select(Vehicle)
        if vehicle_type:
            stmt = stmt.where(Vehicle.type == vehicle_type)
        if status:
            stmt = stmt.where(Vehicle.status == status)
        return len(list(self.db.scalars(stmt).all()))

    def create(self, vehicle: Vehicle) -> Vehicle:
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def update(self, vehicle: Vehicle) -> Vehicle:
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle
