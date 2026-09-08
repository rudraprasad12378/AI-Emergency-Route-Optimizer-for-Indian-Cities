from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid
from app.utils.enums import TrafficLevel

if TYPE_CHECKING:
    from app.models.emergency import Emergency
    from app.models.route_event import RouteEvent


class Route(Base, TimestampMixin):
    __tablename__ = "routes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    emergency_id: Mapped[str] = mapped_column(String(36), ForeignKey("emergencies.id", ondelete="CASCADE"), nullable=False, index=True)
    route_name: Mapped[str] = mapped_column(String(120), nullable=False)
    
    # Distance and Time
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    eta_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    time_saved_minutes: Mapped[float] = mapped_column(Float, default=0.0)

    # Traffic and Scoring
    traffic_level: Mapped[TrafficLevel] = mapped_column(SQLEnum(TrafficLevel), default=TrafficLevel.MODERATE, nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, default=10.0)
    ai_score: Mapped[float] = mapped_column(Float, default=85.0)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.92)
    is_recommended: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # AI Rationale & Waypoints
    ai_explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    waypoints_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    emergency: Mapped["Emergency"] = relationship("Emergency", back_populates="routes", foreign_keys=[emergency_id])
    route_events: Mapped[List["RouteEvent"]] = relationship("RouteEvent", back_populates="route")
