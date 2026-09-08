from datetime import datetime, timezone
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.models.user import User
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleLocationUpdate
from app.core.exceptions import NotFoundError, ValidationError, PermissionDeniedError, VehicleUnavailableError
from app.services.audit_service import AuditService
from app.utils.enums import VehicleStatus, VehicleType, AuditAction, UserRole


class VehicleService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = VehicleRepository(db)
        self.audit_service = AuditService(db)

    def get_vehicle_by_id(self, vehicle_id: str) -> Vehicle:
        veh = self.repo.get_by_id(vehicle_id)
        if not veh:
            raise NotFoundError("Vehicle", vehicle_id)
        return veh

    def get_vehicle(self, vehicle_id: str) -> Vehicle:
        return self.get_vehicle_by_id(vehicle_id)

    def get_vehicles(
        self,
        type: Optional[VehicleType] = None,
        status: Optional[VehicleStatus] = None,
        station_id: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Vehicle], int]:
        skip = (page - 1) * limit
        items = self.repo.get_all(skip=skip, limit=limit, vehicle_type=type, status=status)
        total = self.repo.count(vehicle_type=type, status=status)
        return items, total

    def list_vehicles(
        self,
        skip: int = 0,
        limit: int = 50,
        vehicle_type: Optional[VehicleType] = None,
        status: Optional[VehicleStatus] = None
    ) -> List[Vehicle]:
        return self.repo.get_all(skip=skip, limit=limit, vehicle_type=vehicle_type, status=status)

    def get_available_vehicles(self, vehicle_type: Optional[VehicleType] = None) -> List[Vehicle]:
        return self.repo.get_all(skip=0, limit=100, vehicle_type=vehicle_type, status=VehicleStatus.AVAILABLE)

    def register_vehicle(self, veh_in: VehicleCreate, current_user_id: Optional[str] = None) -> Vehicle:
        existing = self.repo.get_by_call_sign(veh_in.call_sign)
        if existing:
            raise ValidationError(f"Vehicle with call sign '{veh_in.call_sign}' already exists.")

        veh = Vehicle(
            vehicle_number=veh_in.vehicle_number,
            call_sign=veh_in.call_sign,
            type=veh_in.type,
            status=veh_in.status,
            driver_id=veh_in.driver_id,
            current_latitude=veh_in.current_latitude,
            current_longitude=veh_in.current_longitude,
            fuel_level_percent=veh_in.fuel_level_percent,
            current_location_updated_at=datetime.now(timezone.utc)
        )
        created = self.repo.create(veh)

        self.audit_service.log_action(
            action=AuditAction.REGISTER_VEHICLE,
            entity_type="vehicle",
            entity_id=created.id,
            user_id=current_user_id,
            metadata={"call_sign": created.call_sign, "type": created.type.value}
        )
        return created

    def update_vehicle(self, vehicle_id: str, veh_in: VehicleUpdate, current_user_id: Optional[str] = None) -> Vehicle:
        veh = self.get_vehicle(vehicle_id)
        
        if veh_in.call_sign is not None:
            veh.call_sign = veh_in.call_sign
        if veh_in.type is not None:
            veh.type = veh_in.type
        if veh_in.status is not None:
            veh.status = veh_in.status
        if veh_in.driver_id is not None:
            veh.driver_id = veh_in.driver_id
        if veh_in.fuel_level_percent is not None:
            veh.fuel_level_percent = veh_in.fuel_level_percent

        return self.repo.update(veh)

    def update_location(self, vehicle_id: str, loc_in: VehicleLocationUpdate, current_user: User) -> Vehicle:
        """
        Updates vehicle GPS telemetry.
        Enforces server-side security: DRIVER can ONLY update vehicle they are assigned to,
        or DISPATCHER / ADMIN can update any.
        """
        veh = self.get_vehicle(vehicle_id)

        if current_user.role == UserRole.DRIVER:
            if veh.driver_id != current_user.id:
                raise PermissionDeniedError(
                    f"Driver '{current_user.name}' is not authorized to transmit telemetry for unit '{veh.call_sign}'.",
                    code="UNAUTHORIZED_VEHICLE_CONTROL"
                )

        veh.current_latitude = loc_in.latitude
        veh.current_longitude = loc_in.longitude
        if loc_in.speed_kmh is not None:
            veh.speed_kmh = loc_in.speed_kmh
        if loc_in.heading_deg is not None:
            veh.heading_deg = loc_in.heading_deg
        if loc_in.fuel_level_percent is not None:
            veh.fuel_level_percent = loc_in.fuel_level_percent
        veh.current_location_updated_at = datetime.now(timezone.utc)

        return self.repo.update(veh)

    def reserve_and_assign_vehicle(self, vehicle_id: str) -> Vehicle:
        """
        Transactional lock (SELECT FOR UPDATE) to ensure no double-booking race condition.
        """
        veh = self.repo.get_by_id_for_update(vehicle_id)
        if not veh:
            raise NotFoundError("Vehicle", vehicle_id)

        if veh.status != VehicleStatus.AVAILABLE:
            raise VehicleUnavailableError(veh.call_sign, veh.status.value)

        veh.status = VehicleStatus.ASSIGNED
        return self.repo.update(veh)
