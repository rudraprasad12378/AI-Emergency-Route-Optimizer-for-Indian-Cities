from typing import Optional, List, TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid
from app.utils.enums import VehicleType, VehicleStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.emergency import Emergency


class Vehicle(Base, TimestampMixin):
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    vehicle_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    call_sign: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    type: Mapped[VehicleType] = mapped_column(SQLEnum(VehicleType), default=VehicleType.AMBULANCE, nullable=False, index=True)
    status: Mapped[VehicleStatus] = mapped_column(SQLEnum(VehicleStatus), default=VehicleStatus.AVAILABLE, nullable=False, index=True)
    
    # Assigned Driver (Optional)
    driver_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Telemetry
    current_latitude: Mapped[float] = mapped_column(Float, default=20.2961)
    current_longitude: Mapped[float] = mapped_column(Float, default=85.8245)
    heading_deg: Mapped[float] = mapped_column(Float, default=0.0)
    speed_kmh: Mapped[float] = mapped_column(Float, default=0.0)
    fuel_level_percent: Mapped[int] = mapped_column(Integer, default=100)
    current_location_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    driver: Mapped[Optional["User"]] = relationship("User", back_populates="assigned_vehicles", foreign_keys=[driver_id])
    assigned_emergencies: Mapped[List["Emergency"]] = relationship("Emergency", back_populates="assigned_vehicle", foreign_keys="Emergency.assigned_vehicle_id")
