from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.station import Station


class StationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, station_id: str) -> Optional[Station]:
        return self.db.get(Station, station_id)

    def get_all(self, skip: int = 0, limit: int = 50, station_type: Optional[str] = None) -> List[Station]:
        stmt = select(Station)
        if station_type and station_type != "all":
            stmt = stmt.where(Station.type == station_type)
        stmt = stmt.offset(skip).limit(limit).order_by(Station.name.asc())
        return list(self.db.scalars(stmt).all())

    def create(self, station: Station) -> Station:
        self.db.add(station)
        self.db.commit()
        self.db.refresh(station)
        return station

    def update(self, station: Station) -> Station:
        self.db.commit()
        self.db.refresh(station)
        return station
