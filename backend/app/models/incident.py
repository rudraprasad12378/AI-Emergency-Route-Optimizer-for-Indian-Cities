from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Float, Integer, Enum as SQLEnum, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid
from app.utils.enums import IncidentType, IncidentSeverity, IncidentStatus

if TYPE_CHECKING:
    from app.models.user import User


class Incident(Base, TimestampMixin):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    type: Mapped[IncidentType] = mapped_column(SQLEnum(IncidentType), default=IncidentType.ROAD_BLOCKAGE, nullable=False, index=True)
    severity: Mapped[IncidentSeverity] = mapped_column(SQLEnum(IncidentSeverity), default=IncidentSeverity.HIGH, nullable=False, index=True)
    status: Mapped[IncidentStatus] = mapped_column(SQLEnum(IncidentStatus), default=IncidentStatus.ACTIVE, nullable=False, index=True)

    # Location Details
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Operational Impact
    delay_minutes: Mapped[int] = mapped_column(Integer, default=5)
    radius_meters: Mapped[int] = mapped_column(Integer, default=300)

    # Creator & Resolver
    created_by_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    created_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by_id])
