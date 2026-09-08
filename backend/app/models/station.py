from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.emergency import Emergency


class Station(Base, TimestampMixin):
    __tablename__ = "stations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False, default="hospital")
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    coverage_radius_km: Mapped[float] = mapped_column(Float, default=8.0)
    
    # Capacity
    total_ambulances: Mapped[int] = mapped_column(Integer, default=4)
    available_ambulances: Mapped[int] = mapped_column(Integer, default=4)
    trauma_bays_total: Mapped[int] = mapped_column(Integer, default=5)
    trauma_bays_available: Mapped[int] = mapped_column(Integer, default=3)

    # Relationships
    inbound_emergencies: Mapped[List["Emergency"]] = relationship("Emergency", back_populates="destination_hospital", foreign_keys="Emergency.destination_hospital_id")
