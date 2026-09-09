from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.station import Station
from app.schemas.station import StationOut, StationCreate
from app.api.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/stations", tags=["Stations & Bases"])


@router.get("", response_model=List[StationOut])
def list_stations(
    type: Optional[str] = Query(None, description="Filter by type: HOSPITAL, AMBULANCE_DEPOT, FIRE_STATION, etc."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all emergency stations, hospitals, and base depots."""
    query = db.query(Station)
    if type:
        query = query.filter(Station.type.ilike(f"%{type}%"))
    stations = query.order_by(Station.name.asc()).all()
    return [StationOut.model_validate(s) for s in stations]


@router.get("/{station_id}", response_model=StationOut)
def get_station(
    station_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a single station or hospital facility."""
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        from app.core.exceptions import NotFoundError
        raise NotFoundError("Station", station_id)
    return StationOut.model_validate(station)


@router.post("", response_model=StationOut, status_code=status.HTTP_201_CREATED)
def create_station(
    station_data: StationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Register a new station or hospital facility (Admin only)."""
    station = Station(
        name=station_data.name,
        type=station_data.type,
        address=station_data.address,
        latitude=station_data.latitude,
        longitude=station_data.longitude,
        contact_phone=station_data.contact_phone,
        coverage_radius_km=station_data.coverage_radius_km,
        total_ambulances=station_data.total_ambulances,
        available_ambulances=station_data.available_ambulances,
        trauma_bays_total=station_data.trauma_bays_total,
        trauma_bays_available=station_data.trauma_bays_available,
    )
    db.add(station)
    db.commit()
    db.refresh(station)
    return StationOut.model_validate(station)
