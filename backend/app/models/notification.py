from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.emergency import Emergency


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    target_role: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    emergency_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("emergencies.id", ondelete="CASCADE"), nullable=True, index=True)
    
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="info")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="notifications", foreign_keys=[user_id])
    emergency: Mapped[Optional["Emergency"]] = relationship("Emergency", back_populates="notifications", foreign_keys=[emergency_id])
