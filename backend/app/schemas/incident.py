from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.enums import IncidentType, IncidentSeverity, IncidentStatus


class IncidentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    type: IncidentType = IncidentType.ROAD_BLOCKAGE
    severity: IncidentSeverity = IncidentSeverity.HIGH
    latitude: float = Field(ge=19.0, le=22.0)
    longitude: float = Field(ge=83.0, le=88.0)
    address: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    delay_minutes: int = Field(default=5, ge=1, le=180)
    radius_meters: int = Field(default=300, ge=50, le=5000)


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    status: Optional[IncidentStatus] = None
    description: Optional[str] = None
    delay_minutes: Optional[int] = None


class IncidentResolve(BaseModel):
    notes: Optional[str] = None


class IncidentResponse(BaseModel):
    id: str
    title: str
    type: IncidentType
    severity: IncidentSeverity
    status: IncidentStatus
    latitude: float
    longitude: float
    address: str
    description: Optional[str] = None
    delay_minutes: int
    radius_meters: int
    created_by_id: Optional[str] = None
    started_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


IncidentOut = IncidentResponse
