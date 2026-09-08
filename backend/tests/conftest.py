import pytest
import os
import sys
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.station import Station
from app.models.vehicle import Vehicle
from app.models.incident import Incident
from app.models.emergency import Emergency
from app.utils.enums import (
    UserRole,
    VehicleType,
    VehicleStatus,
    EmergencyType,
    EmergencyPriority,
    EmergencyStatus,
    IncidentType,
    IncidentSeverity,
    IncidentStatus,
)

# In-memory SQLite for fast, isolated test execution
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine_test = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(scope="function")
def db():
    """Yields an isolated, freshly migrated database session per test."""
    Base.metadata.create_all(bind=engine_test)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine_test)


@pytest.fixture(scope="function")
def client(db):
    """FastAPI TestClient with overridden get_db dependency."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def seed_test_data(db):
    """Populates basic test fixtures."""
    hashed = get_password_hash("testpass123")

    admin = User(name="Test Admin", email="admin@test.com", password_hash=hashed, role=UserRole.ADMIN)
    dispatcher = User(name="Test Dispatcher", email="dispatcher@test.com", password_hash=hashed, role=UserRole.DISPATCHER)
    driver = User(name="Test Driver", email="driver@test.com", password_hash=hashed, role=UserRole.DRIVER)
    driver2 = User(name="Other Driver", email="driver2@test.com", password_hash=hashed, role=UserRole.DRIVER)
    citizen = User(name="Test Citizen", email="citizen@test.com", password_hash=hashed, role=UserRole.CITIZEN)
    hospital_user = User(name="Test Hospital User", email="hospital@test.com", password_hash=hashed, role=UserRole.HOSPITAL)
    inactive_user = User(name="Inactive User", email="inactive@test.com", password_hash=hashed, role=UserRole.CITIZEN, is_active=False)

    db.add_all([admin, dispatcher, driver, driver2, citizen, hospital_user, inactive_user])
    db.commit()

    hospital = Station(
        name="AIIMS Test Trauma Hospital",
        type="HOSPITAL",
        address="Patrapada, Bhubaneswar",
        latitude=20.2285,
        longitude=85.7765,
        contact_phone="+916742476789",
    )
    db.add(hospital)
    db.commit()

    vehicle = Vehicle(
        vehicle_number="OD-02-TEST-101",
        call_sign="ALS-TEST-1",
        type=VehicleType.AMBULANCE,
        status=VehicleStatus.AVAILABLE,
        driver_id=driver.id,
        current_latitude=20.2961,
        current_longitude=85.8245,
    )
    db.add(vehicle)
    db.commit()

    return {
        "admin": admin,
        "dispatcher": dispatcher,
        "driver": driver,
        "driver2": driver2,
        "citizen": citizen,
        "hospital_user": hospital_user,
        "inactive_user": inactive_user,
        "hospital": hospital,
        "vehicle": vehicle,
    }


def get_token_headers(user: User) -> dict:
    """Helper to create authorization bearer header for test requests."""
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role.value})
    return {"Authorization": f"Bearer {token}"}
