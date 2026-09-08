from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.emergency import EmergencyOut
from app.schemas.station import StationOut
from app.services.hospital_service import HospitalService
from app.api.dependencies import get_current_user, require_hospital

router = APIRouter(prefix="/hospitals", tags=["Hospital Operations"])


@router.get("", response_model=List[StationOut])
def list_hospitals_and_trauma_centers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all registered hospitals, trauma centers, and medical triage facilities."""
    service = HospitalService(db)
    hospitals = service.get_all_hospitals()
    return [StationOut.model_validate(h) for h in hospitals]


@router.get("/incoming", response_model=List[EmergencyOut])
def get_incoming_emergencies(
    hospital_id: Optional[str] = Query(None, description="Optional filter for a specific hospital"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve live inbound emergency cases with ETA, assigned units, and triage priorities.
    Hospitals use this to prep trauma bays, surgeons, and blood banks before patient arrival.
    """
    service = HospitalService(db)
    # If user is a hospital user without specifying hospital_id, service handles lookup
    emergencies = service.get_incoming_emergencies_for_hospital(
        hospital_id=hospital_id,
        current_user=current_user
    )
    return [EmergencyOut.model_validate(e) for e in emergencies]
