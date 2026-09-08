from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.emergency import Emergency
from app.models.station import Station
from app.models.user import User
from app.repositories.station_repository import StationRepository
from app.repositories.emergency_repository import EmergencyRepository
from app.schemas.station import StationCreate, StationUpdate
from app.core.exceptions import NotFoundError
from app.utils.enums import EmergencyStatus


class HospitalService:
    def __init__(self, db: Session):
        self.db = db
        self.station_repo = StationRepository(db)
        self.emergency_repo = EmergencyRepository(db)

    def get_station(self, station_id: str) -> Station:
        station = self.station_repo.get_by_id(station_id)
        if not station:
            raise NotFoundError("Station/Hospital", station_id)
        return station

    def get_all_hospitals(self) -> List[Station]:
        return self.station_repo.get_all(skip=0, limit=100, station_type="HOSPITAL")

    def list_stations(self, skip: int = 0, limit: int = 50, station_type: Optional[str] = None) -> List[Station]:
        return self.station_repo.get_all(skip=skip, limit=limit, station_type=station_type)

    def get_incoming_emergencies_for_hospital(
        self,
        hospital_id: Optional[str] = None,
        current_user: Optional[User] = None
    ) -> List[Emergency]:
        return self.get_incoming_emergencies(hospital_id=hospital_id)

    def get_incoming_emergencies(self, hospital_id: Optional[str] = None) -> List[Emergency]:
        """
        Returns active inbound transports destined for hospitals.
        Excludes COMPLETED and CANCELLED.
        """
        all_emergencies = self.emergency_repo.get_all(limit=100)
        active_inbound = [
            e for e in all_emergencies
            if e.status in [
                EmergencyStatus.REQUESTED,
                EmergencyStatus.TRIAGED,
                EmergencyStatus.ASSIGNED,
                EmergencyStatus.ACCEPTED,
                EmergencyStatus.EN_ROUTE,
                EmergencyStatus.REROUTING,
                EmergencyStatus.ARRIVING,
                EmergencyStatus.ARRIVED,
            ]
        ]
        if hospital_id:
            active_inbound = [e for e in active_inbound if e.destination_hospital_id == hospital_id]
        return active_inbound

    def create_station(self, station_in: StationCreate, actor: Optional[User] = None) -> Station:
        station = Station(
            name=station_in.name,
            type=station_in.type,
            address=station_in.address,
            latitude=station_in.latitude,
            longitude=station_in.longitude,
            contact_phone=station_in.contact_phone,
            coverage_radius_km=station_in.coverage_radius_km,
            total_ambulances=station_in.total_ambulances,
            available_ambulances=station_in.available_ambulances,
            trauma_bays_total=station_in.trauma_bays_total,
            trauma_bays_available=station_in.trauma_bays_available
        )
        return self.station_repo.create(station)

    def update_station(self, station_id: str, station_in: StationUpdate, actor: Optional[User] = None) -> Station:
        station = self.get_station(station_id)
        if station_in.available_ambulances is not None:
            station.available_ambulances = station_in.available_ambulances
        if station_in.trauma_bays_available is not None:
            station.trauma_bays_available = station_in.trauma_bays_available
        if station_in.contact_phone is not None:
            station.contact_phone = station_in.contact_phone
        return self.station_repo.update(station)
