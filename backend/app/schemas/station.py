from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class StationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    type: str = "hospital"
    address: str = Field(min_length=3, max_length=255)
    latitude: float = Field(ge=19.0, le=22.0)
    longitude: float = Field(ge=83.0, le=88.0)
    contact_phone: Optional[str] = None
    coverage_radius_km: float = 8.0
    total_ambulances: int = 4
    available_ambulances: int = 4
    trauma_bays_total: int = 5
    trauma_bays_available: int = 3


class StationUpdate(BaseModel):
    available_ambulances: Optional[int] = None
    trauma_bays_available: Optional[int] = None
    contact_phone: Optional[str] = None


class StationResponse(BaseModel):
    id: str
    name: str
    type: str
    address: str
    latitude: float
    longitude: float
    contact_phone: Optional[str] = None
    coverage_radius_km: float
    total_ambulances: int
    available_ambulances: int
    trauma_bays_total: int
    trauma_bays_available: int
    created_at: datetime

    class Config:
        from_attributes = True


StationOut = StationResponse
