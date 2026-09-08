from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
import time

from app.db.session import get_db
from app.core.config import settings

router = APIRouter(tags=["Health & Diagnostics"])

_START_TIME = time.time()


@router.get("/health")
def liveness_check():
    """Basic liveness probe verifying HTTP stack responsiveness."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "uptime_seconds": round(time.time() - _START_TIME, 2),
        "city": settings.DEFAULT_CITY
    }


@router.get("/health/ready")
def readiness_check(db: Session = Depends(get_db)):
    """Deep readiness probe verifying active database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "database": "connected",
            "environment": settings.ENVIRONMENT,
            "version": settings.APP_VERSION
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )
