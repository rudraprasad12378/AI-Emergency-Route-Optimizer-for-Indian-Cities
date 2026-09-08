from typing import Generator, List, Callable, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationError, PermissionDeniedError
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.utils.enums import UserRole

security_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> User:
    """Validate JWT token and return authenticated User entity from database."""
    if not credentials or not credentials.credentials:
        raise AuthenticationError("Authentication credentials were not provided.")

    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise AuthenticationError("Invalid or expired access token.")

    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationError("Access token payload missing user identity.")

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise AuthenticationError("User account not found or inactive.")

    return user


def require_role(allowed_roles: List[UserRole]) -> Callable:
    """Dependency factory enforcing server-side Role-Based Access Control (RBAC)."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != UserRole.ADMIN:
            raise PermissionDeniedError(
                f"Role '{current_user.role.value}' is not authorized to access this resource. Allowed roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker


# Convenient role dependencies
require_dispatcher = require_role([UserRole.DISPATCHER])
require_driver = require_role([UserRole.DRIVER])
require_citizen = require_role([UserRole.CITIZEN])
require_hospital = require_role([UserRole.HOSPITAL])
require_admin = require_role([UserRole.ADMIN])
require_staff = require_role([UserRole.DISPATCHER, UserRole.DRIVER, UserRole.HOSPITAL, UserRole.ADMIN])
