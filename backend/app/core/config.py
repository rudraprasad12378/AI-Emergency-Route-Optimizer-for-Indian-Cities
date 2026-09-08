import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Emergency Route Optimizer for Indian Cities"
    APP_NAME: str = "AI Emergency Route Optimizer for Indian Cities"
    VERSION: str = "1.0.0"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    DEFAULT_CITY: str = "Bhubaneswar"

    # Security
    SECRET_KEY: str = "emergency_route_optimizer_super_secret_jwt_key_2026_odisha"
    JWT_SECRET_KEY: str = "emergency_route_optimizer_super_secret_jwt_key_2026_odisha"
    ALGORITHM: str = "HS256"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database (PostgreSQL is default; configurable via environment variables)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/emergency_route_optimizer"
    )

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # AI Route Scoring Weights
    ETA_WEIGHT: float = 0.40
    TRAFFIC_WEIGHT: float = 0.30
    RISK_WEIGHT: float = 0.20
    INCIDENT_WEIGHT: float = 0.10
    AI_ETA_WEIGHT: float = 0.40
    AI_TRAFFIC_WEIGHT: float = 0.30
    AI_RISK_WEIGHT: float = 0.20
    AI_INCIDENT_PENALTY: float = 0.10
    AI_GREEN_CORRIDOR_BONUS: float = 15.0

    # City Geofence (Bhubaneswar Coordinates)
    CITY_CENTER_LAT: float = 20.2961
    CITY_CENTER_LNG: float = 85.8245
    MIN_LAT: float = 19.5
    MAX_LAT: float = 21.5
    MIN_LNG: float = 84.5
    MAX_LNG: float = 86.5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
