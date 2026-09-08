from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid
from app.utils.enums import RouteEventType

if TYPE_CHECKING:
    from app.models.emergency import Emergency
    from app.models.route import Route
    from app.models.user import User


class RouteEvent(Base, TimestampMixin):
    __tablename__ = "route_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    emergency_id: Mapped[str] = mapped_column(String(36), ForeignKey("emergencies.id", ondelete="CASCADE"), nullable=False, index=True)
    route_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("routes.id", ondelete="SET NULL"), nullable=True)
    
    event_type: Mapped[RouteEventType] = mapped_column(SQLEnum(RouteEventType), nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    old_eta_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    new_eta_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    triggered_by_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    details_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    emergency: Mapped["Emergency"] = relationship("Emergency", back_populates="route_events", foreign_keys=[emergency_id])
    route: Mapped[Optional["Route"]] = relationship("Route", back_populates="route_events", foreign_keys=[route_id])
    triggered_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[triggered_by_id])
