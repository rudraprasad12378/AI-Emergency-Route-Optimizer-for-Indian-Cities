from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.utils.enums import VehicleType, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleLocationUpdate, VehicleOut
from app.schemas.common import PaginatedResponse
from app.services.vehicle_service import VehicleService
from app.api.dependencies import get_current_user, require_dispatcher, require_driver, require_admin

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("", response_model=PaginatedResponse[VehicleOut])
def list_vehicles(
    type: Optional[VehicleType] = None,
    status: Optional[VehicleStatus] = None,
    station_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all vehicles with optional filters for type, status, and station."""
    service = VehicleService(db)
    items, total = service.get_vehicles(type=type, status=status, station_id=station_id, page=page, limit=limit)
    return PaginatedResponse.create(items=[VehicleOut.model_validate(v) for v in items], total=total, page=page, limit=limit)


@router.get("/available", response_model=List[VehicleOut])
def list_available_vehicles(
    type: Optional[VehicleType] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all available vehicles ready for dispatch."""
    service = VehicleService(db)
    vehicles = service.get_available_vehicles(vehicle_type=type)
    return [VehicleOut.model_validate(v) for v in vehicles]


@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(
    vehicle_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get single vehicle details by ID."""
    service = VehicleService(db)
    vehicle = service.get_vehicle_by_id(vehicle_id)
    return VehicleOut.model_validate(vehicle)


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def register_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Register a new vehicle in the emergency fleet (Admin only)."""
    service = VehicleService(db)
    vehicle = service.register_vehicle(vehicle_data, current_user_id=current_user.id)
    return VehicleOut.model_validate(vehicle)


@router.patch("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(
    vehicle_id: str,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    """Update vehicle specifications or station assignment (Dispatcher/Admin)."""
    service = VehicleService(db)
    vehicle = service.update_vehicle(vehicle_id, vehicle_data, current_user_id=current_user.id)
    return VehicleOut.model_validate(vehicle)


@router.post("/{vehicle_id}/location", response_model=VehicleOut)
def update_vehicle_location(
    vehicle_id: str,
    location_data: VehicleLocationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update live GPS coordinates of vehicle telemetry.
    Strictly enforces that the updating driver is the assigned driver of this vehicle.
    """
    service = VehicleService(db)
    vehicle = service.update_location(vehicle_id, location_data, current_user=current_user)
    return VehicleOut.model_validate(vehicle)
