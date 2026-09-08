from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse, summary="Authenticate user and return JWT")
def login(request: Request, login_in: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    client_ip = request.client.host if request.client else None
    user, token = auth_service.authenticate_user(
        email=login_in.email,
        password=login_in.password,
        ip_address=client_ip
    )
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=86400,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse, summary="Get currently authenticated user identity")
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register citizen account")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.register_user(user_in)
    return UserResponse.model_validate(user)
