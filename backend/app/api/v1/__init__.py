from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.emergencies import router as emergencies_router
from app.api.v1.vehicles import router as vehicles_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.routes import router as routes_router
from app.api.v1.hospitals import router as hospitals_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.admin import router as admin_router
from app.api.v1.health import router as health_router

api_v1_router = APIRouter()

# Health endpoints mounted at root and v1
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(emergencies_router)
api_v1_router.include_router(vehicles_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(routes_router)
api_v1_router.include_router(hospitals_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(admin_router)
