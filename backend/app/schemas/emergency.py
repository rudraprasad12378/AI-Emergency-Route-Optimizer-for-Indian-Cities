from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.utils.enums import EmergencyType, EmergencyPriority, EmergencyStatus
from app.schemas.vehicle import VehicleResponse


class EmergencyCreate(BaseModel):
    type: EmergencyType = EmergencyType.MEDICAL
    priority: EmergencyPriority = EmergencyPriority.CRITICAL
    pickup_address: str = Field(min_length=3, max_length=255)
    pickup_landmark: Optional[str] = None
    pickup_latitude: float = Field(ge=19.0, le=22.0)
    pickup_longitude: float = Field(ge=83.0, le=88.0)
    destination_name: str = Field(default="AIIMS Bhubaneswar")
    destination_address: Optional[str] = "Sijua, Patrapada, Bhubaneswar"
    destination_latitude: float = Field(default=20.2312)
    destination_longitude: float = Field(default=85.7766)
    description: Optional[str] = None
    patient_count: int = Field(default=1, ge=1, le=50)
    caller_name: str = Field(default="Citizen Caller")
    caller_phone: str = Field(default="+91 108")
    destination_hospital_id: Optional[str] = None


class EmergencyTriage(BaseModel):
    priority: EmergencyPriority
    destination_hospital_id: Optional[str] = None
    notes: Optional[str] = None


class EmergencyAssign(BaseModel):
    vehicle_id: str = Field(description="ID of the vehicle to assign")
    instructions: Optional[str] = None


class EmergencyComplete(BaseModel):
    handover_notes: Optional[str] = None


class EmergencyCancel(BaseModel):
    reason: str = Field(min_length=3, max_length=255)


class EmergencyUpdate(BaseModel):
    description: Optional[str] = None
    patient_count: Optional[int] = None
    destination_name: Optional[str] = None
    destination_hospital_id: Optional[str] = None
    green_corridor_active: Optional[bool] = None


class EmergencyResponse(BaseModel):
    id: str
    emergency_number: str
    type: EmergencyType
    priority: EmergencyPriority
    status: EmergencyStatus
    citizen_id: Optional[str] = None
    assigned_vehicle_id: Optional[str] = None
    destination_hospital_id: Optional[str] = None
    
    pickup_address: str
    pickup_landmark: Optional[str] = None
    pickup_latitude: float
    pickup_longitude: float

    destination_name: str
    destination_address: Optional[str] = None
    destination_latitude: float
    destination_longitude: float

    description: Optional[str] = None
    patient_count: int
    caller_name: str
    caller_phone: str

    green_corridor_active: bool
    eta_minutes: int
    distance_remaining_km: float
    simulation_progress: int

    created_at: datetime
    triaged_at: Optional[datetime] = None
    assigned_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    arriving_at: Optional[datetime] = None
    arrived_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None

    assigned_vehicle: Optional[VehicleResponse] = None

    class Config:
        from_attributes = True


EmergencyOut = EmergencyResponse
