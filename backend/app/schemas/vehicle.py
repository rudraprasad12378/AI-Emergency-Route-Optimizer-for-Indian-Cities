from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.enums import VehicleType, VehicleStatus


class VehicleLocationUpdate(BaseModel):
    latitude: float = Field(ge=19.0, le=22.0, description="Latitude in Odisha region")
    longitude: float = Field(ge=83.0, le=88.0, description="Longitude in Odisha region")
    speed_kmh: Optional[float] = Field(default=0.0, ge=0.0, le=200.0)
    heading_deg: Optional[float] = Field(default=0.0, ge=0.0, le=360.0)
    fuel_level_percent: Optional[int] = Field(default=100, ge=0, le=100)


class VehicleCreate(BaseModel):
    vehicle_number: str = Field(min_length=3, max_length=50)
    call_sign: str = Field(min_length=2, max_length=50)
    type: VehicleType = VehicleType.AMBULANCE
    status: VehicleStatus = VehicleStatus.AVAILABLE
    driver_id: Optional[str] = None
    station_id: Optional[str] = None
    current_latitude: float = 20.2961
    current_longitude: float = 85.8245
    fuel_level_percent: int = 100


class VehicleUpdate(BaseModel):
    call_sign: Optional[str] = None
    type: Optional[VehicleType] = None
    status: Optional[VehicleStatus] = None
    driver_id: Optional[str] = None
    station_id: Optional[str] = None
    fuel_level_percent: Optional[int] = None


class VehicleResponse(BaseModel):
    id: str
    vehicle_number: str
    call_sign: str
    type: VehicleType
    status: VehicleStatus
    driver_id: Optional[str] = None
    current_latitude: float
    current_longitude: float
    heading_deg: float
    speed_kmh: float
    fuel_level_percent: int
    current_location_updated_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


VehicleOut = VehicleResponse
