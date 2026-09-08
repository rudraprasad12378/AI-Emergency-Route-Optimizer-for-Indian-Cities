from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import UserResponse, UserCreate, UserUpdate
from app.services.auth_service import AuthService
from app.api.dependencies import get_current_user, require_admin
from app.models.user import User
from app.utils.enums import UserRole

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse], summary="List users (Admin/Staff only)")
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: Optional[UserRole] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    users = auth_service.user_repo.get_all(skip=skip, limit=limit, role=role)
    return [UserResponse.model_validate(u) for u in users]


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Create user account (Admin only)")
def create_user(
    user_in: UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    user = auth_service.register_user(user_in, created_by=current_user)
    return UserResponse.model_validate(user)


@router.get("/{user_id}", response_model=UserResponse, summary="Get user by ID")
def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    user = auth_service.user_repo.get_by_id(user_id)
    return UserResponse.model_validate(user)


@router.patch("/{user_id}", response_model=UserResponse, summary="Update user profile")
def update_user(
    user_id: str,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    user = auth_service.update_user(user_id, user_in, actor=current_user)
    return UserResponse.model_validate(user)
