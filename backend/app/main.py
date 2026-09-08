from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.exceptions import AppException
from app.core.logging import setup_logging
from app.db.base import Base
from app.db.session import engine
from app.api.v1 import api_v1_router
from app.api.v1.health import router as health_router

# Configure structured logging
setup_logging()
logger = logging.getLogger("ero.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle hook for database tables check and logging."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]")
    logger.info(f"Connected to database: {settings.DATABASE_URL.split('@')[-1]}")
    # Create tables if not using standalone alembic migrations
    Base.metadata.create_all(bind=engine)
    logger.info("Database schemas verified.")
    yield
    logger.info(f"Shutting down {settings.APP_NAME} gracefully.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production AI Emergency Route Optimizer & Intelligent Corridor Management API for Indian Cities.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions with structured error responses."""
    logger.warning(f"AppException on {request.method} {request.url.path}: {exc.code} - {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            }
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Format Pydantic schema validation errors into clean, readable format."""
    logger.warning(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(l) for l in err.get("loc", []) if l != "body"])
        errors.append(f"{loc}: {err.get('msg')}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request payload validation failed.",
                "details": errors,
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions without leaking stack traces."""
    logger.error(f"Unhandled server error on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred.",
            }
        },
    )


# Mount API routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
# Also mount at /api for flexible route compatibility
app.include_router(api_v1_router, prefix="/api")
# Root health route
app.include_router(health_router)


@app.get("/")
def root():
    """Root redirect / discovery."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }
