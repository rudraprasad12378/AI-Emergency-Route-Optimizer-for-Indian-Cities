from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.emergency import (
    EmergencyCreate,
    EmergencyUpdate,
    EmergencyTriage,
    EmergencyAssign,
    EmergencyResponse
)
from app.schemas.common import MessageResponse
from app.services.emergency_service import EmergencyService
from app.api.dependencies import (
    get_current_user,
    require_dispatcher,
    require_driver,
    require_staff
)
from app.models.user import User
from app.utils.enums import EmergencyStatus, EmergencyPriority, EmergencyType, UserRole

router = APIRouter(prefix="/emergencies", tags=["Emergencies"])


@router.post("", response_model=EmergencyResponse, status_code=status.HTTP_201_CREATED, summary="Create emergency request")
def create_emergency(
    emg_in: EmergencyCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.create_emergency(emg_in, citizen=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.get("", response_model=List[EmergencyResponse], summary="List emergency missions with filtering")
def list_emergencies(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[EmergencyStatus] = None,
    priority: Optional[EmergencyPriority] = None,
    emergency_type: Optional[EmergencyType] = None,
    citizen_id: Optional[str] = None,
    assigned_vehicle_id: Optional[str] = None,
    hospital_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    
    # If authenticated user is CITIZEN, only return own emergencies
    if current_user.role == UserRole.CITIZEN:
        citizen_id = current_user.id

    emergencies = emergency_service.list_emergencies(
        skip=skip,
        limit=limit,
        status=status,
        priority=priority,
        emergency_type=emergency_type,
        citizen_id=citizen_id,
        assigned_vehicle_id=assigned_vehicle_id,
        hospital_id=hospital_id
    )
    return [EmergencyResponse.model_validate(e) for e in emergencies]


@router.get("/{emergency_id}", response_model=EmergencyResponse, summary="Get emergency details by ID")
def get_emergency(
    emergency_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.get_emergency(emergency_id)
    return EmergencyResponse.model_validate(emergency)


@router.patch("/{emergency_id}", response_model=EmergencyResponse, summary="Update allowed emergency fields")
def update_emergency(
    emergency_id: str,
    emg_in: EmergencyUpdate,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emg = emergency_service.get_emergency(emergency_id)
    if emg_in.description is not None:
        emg.description = emg_in.description
    if emg_in.patient_count is not None:
        emg.patient_count = emg_in.patient_count
    if emg_in.destination_name is not None:
        emg.destination_name = emg_in.destination_name
    if emg_in.destination_hospital_id is not None:
        emg.destination_hospital_id = emg_in.destination_hospital_id
    if emg_in.green_corridor_active is not None:
        emg.green_corridor_active = emg_in.green_corridor_active
    
    updated = emergency_service.repo.update(emg)
    return EmergencyResponse.model_validate(updated)


@router.post("/{emergency_id}/triage", response_model=EmergencyResponse, summary="Triage emergency priority (Dispatcher only)")
def triage_emergency(
    emergency_id: str,
    triage_in: EmergencyTriage,
    current_user: User = Depends(require_dispatcher),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.triage_emergency(emergency_id, triage_in, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/assign", response_model=EmergencyResponse, summary="Assign vehicle to emergency (Dispatcher only)")
def assign_vehicle(
    emergency_id: str,
    assign_in: EmergencyAssign,
    current_user: User = Depends(require_dispatcher),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.assign_vehicle(emergency_id, assign_in.vehicle_id, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/accept", response_model=EmergencyResponse, summary="Driver acknowledges mission assignment (Driver only)")
def accept_mission(
    emergency_id: str,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.accept_mission(emergency_id, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/start", response_model=EmergencyResponse, summary="Driver starts transit journey (Driver only)")
def start_journey(
    emergency_id: str,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.start_journey(emergency_id, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/arrive", response_model=EmergencyResponse, summary="Mark ambulance arrived at destination")
def mark_arrived(
    emergency_id: str,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.mark_arrived(emergency_id, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/complete", response_model=EmergencyResponse, summary="Complete emergency and handover patient")
def complete_emergency(
    emergency_id: str,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.complete_emergency(emergency_id, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/cancel", response_model=EmergencyResponse, summary="Cancel emergency incident")
def cancel_emergency(
    emergency_id: str,
    reason: str = Query("Cancelled by dispatcher", description="Cancellation reason"),
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.cancel_emergency(emergency_id, reason=reason, actor=current_user)
    return EmergencyResponse.model_validate(emergency)


@router.post("/{emergency_id}/green-corridor", response_model=EmergencyResponse, summary="Toggle green corridor preemption")
def toggle_green_corridor(
    emergency_id: str,
    active: bool = Query(True),
    current_user: User = Depends(require_dispatcher),
    db: Session = Depends(get_db)
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.toggle_green_corridor(emergency_id, active=active, actor=current_user)
    return EmergencyResponse.model_validate(emergency)
