from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate, UserUpdate
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.exceptions import AuthenticationError, ValidationError, NotFoundError
from app.services.audit_service import AuditService
from app.utils.enums import AuditAction, UserRole


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.audit_service = AuditService(db)

    def authenticate_user(self, email: str, password: str, ip_address: Optional[str] = None) -> Tuple[User, str]:
        user = self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password.")
        
        if not user.is_active:
            raise AuthenticationError("This user account has been deactivated.", code="INACTIVE_USER")

        token = create_access_token(subject=user.id, role=user.role.value)
        
        self.audit_service.log_action(
            action=AuditAction.LOGIN,
            entity_type="user",
            entity_id=user.id,
            user_id=user.id,
            metadata={"email": user.email, "role": user.role.value},
            ip_address=ip_address
        )
        return user, token

    def register_user(self, user_in: UserCreate, created_by: Optional[User] = None) -> User:
        existing = self.user_repo.get_by_email(user_in.email)
        if existing:
            raise ValidationError(f"A user with email '{user_in.email}' already exists.")

        user = User(
            name=user_in.name,
            email=user_in.email.lower().strip(),
            phone=user_in.phone,
            password_hash=get_password_hash(user_in.password),
            role=user_in.role,
            department=user_in.department,
            is_active=True
        )
        created = self.user_repo.create(user)

        self.audit_service.log_action(
            action=AuditAction.CREATE_USER,
            entity_type="user",
            entity_id=created.id,
            user_id=created_by.id if created_by else created.id,
            metadata={"email": created.email, "role": created.role.value}
        )
        return created

    def update_user(self, user_id: str, user_in: UserUpdate, actor: User) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)

        if user_in.name is not None:
            user.name = user_in.name
        if user_in.phone is not None:
            user.phone = user_in.phone
        if user_in.department is not None:
            user.department = user_in.department
        if user_in.is_active is not None and actor.role == UserRole.ADMIN:
            user.is_active = user_in.is_active

        return self.user_repo.update(user)
