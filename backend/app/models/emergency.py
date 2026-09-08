from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, Enum as SQLEnum, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid
from app.utils.enums import EmergencyType, EmergencyPriority, EmergencyStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.vehicle import Vehicle
    from app.models.station import Station
    from app.models.route import Route
    from app.models.route_event import RouteEvent
    from app.models.notification import Notification


class Emergency(Base, TimestampMixin):
    __tablename__ = "emergencies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    emergency_number: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    type: Mapped[EmergencyType] = mapped_column(SQLEnum(EmergencyType), default=EmergencyType.MEDICAL, nullable=False, index=True)
    priority: Mapped[EmergencyPriority] = mapped_column(SQLEnum(EmergencyPriority), default=EmergencyPriority.CRITICAL, nullable=False, index=True)
    status: Mapped[EmergencyStatus] = mapped_column(SQLEnum(EmergencyStatus), default=EmergencyStatus.REQUESTED, nullable=False, index=True)

    # Foreign Keys
    citizen_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_vehicle_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("vehicles.id", ondelete="SET NULL"), nullable=True, index=True)
    destination_hospital_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("stations.id", ondelete="SET NULL"), nullable=True, index=True)

    # Location Details
    pickup_address: Mapped[str] = mapped_column(String(255), nullable=False)
    pickup_landmark: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    pickup_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    pickup_longitude: Mapped[float] = mapped_column(Float, nullable=False)

    destination_name: Mapped[str] = mapped_column(String(120), nullable=False, default="AIIMS Bhubaneswar")
    destination_address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    destination_latitude: Mapped[float] = mapped_column(Float, nullable=False, default=20.2312)
    destination_longitude: Mapped[float] = mapped_column(Float, nullable=False, default=85.7766)

    # Triage and Caller Details
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    patient_count: Mapped[int] = mapped_column(Integer, default=1)
    caller_name: Mapped[str] = mapped_column(String(100), default="Citizen Caller")
    caller_phone: Mapped[str] = mapped_column(String(20), default="+91 108")
    
    # Corridor and Live Telemetry
    green_corridor_active: Mapped[bool] = mapped_column(Boolean, default=False)
    eta_minutes: Mapped[int] = mapped_column(Integer, default=14)
    distance_remaining_km: Mapped[float] = mapped_column(Float, default=8.2)
    simulation_progress: Mapped[int] = mapped_column(Integer, default=0)

    # Lifecycle Milestones Timestamps
    triaged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    assigned_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    accepted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    arriving_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    arrived_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    citizen: Mapped[Optional["User"]] = relationship("User", back_populates="reported_emergencies", foreign_keys=[citizen_id])
    assigned_vehicle: Mapped[Optional["Vehicle"]] = relationship("Vehicle", back_populates="assigned_emergencies", foreign_keys=[assigned_vehicle_id])
    destination_hospital: Mapped[Optional["Station"]] = relationship("Station", back_populates="inbound_emergencies", foreign_keys=[destination_hospital_id])
    routes: Mapped[List["Route"]] = relationship("Route", back_populates="emergency", cascade="all, delete-orphan")
    route_events: Mapped[List["RouteEvent"]] = relationship("RouteEvent", back_populates="emergency", cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="emergency", cascade="all, delete-orphan")
