from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, generate_uuid
from app.utils.enums import UserRole

if TYPE_CHECKING:
    from app.models.emergency import Emergency
    from app.models.vehicle import Vehicle
    from app.models.notification import Notification
    from app.models.audit_log import AuditLog


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), nullable=False, default=UserRole.CITIZEN, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    assigned_vehicles: Mapped[List["Vehicle"]] = relationship("Vehicle", back_populates="driver", foreign_keys="Vehicle.driver_id")
    reported_emergencies: Mapped[List["Emergency"]] = relationship("Emergency", back_populates="citizen", foreign_keys="Emergency.citizen_id")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user")
