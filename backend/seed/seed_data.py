"""
Database Seed Script for Bhubaneswar Emergency Network
Populates initial development users, vehicles, hospitals, incidents, and test emergencies.
"""
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.station import Station
from app.models.vehicle import Vehicle
from app.models.incident import Incident
from app.models.emergency import Emergency
from app.models.notification import Notification
from app.models.audit_log import AuditLog
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
    AuditAction,
)


def seed_database():
    print("==================================================")
    print(" Initializing Database Tables & Seeding Data...   ")
    print("==================================================")

    # Re-create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "admin@ero.gov.in").first():
            print("[INFO] Database already contains seed accounts. Skipping recreation.")
            return

        print("\n1. Creating Role-Based Seed Accounts...")
        hashed_password = get_password_hash("emergency2026")

        users = [
            User(
                name="Chief Admin S. Mohapatra",
                email="admin@ero.gov.in",
                phone="+919876543210",
                password_hash=hashed_password,
                role=UserRole.ADMIN,
                is_active=True,
            ),
            User(
                name="Dispatcher Officer Priya Nayak",
                email="dispatcher@ero.gov.in",
                phone="+919876543211",
                password_hash=hashed_password,
                role=UserRole.DISPATCHER,
                is_active=True,
            ),
            User(
                name="Pilot Rajesh Sahoo",
                email="driver@ero.gov.in",
                phone="+919876543212",
                password_hash=hashed_password,
                role=UserRole.DRIVER,
                is_active=True,
            ),
            User(
                name="Pilot Amitav Jena",
                email="driver2@ero.gov.in",
                phone="+919876543213",
                password_hash=hashed_password,
                role=UserRole.DRIVER,
                is_active=True,
            ),
            User(
                name="Citizen Debabrata Dash",
                email="citizen@ero.gov.in",
                phone="+919876543214",
                password_hash=hashed_password,
                role=UserRole.CITIZEN,
                is_active=True,
            ),
            User(
                name="Dr. Ananya Ray (AIIMS Trauma Triage)",
                email="hospital@ero.gov.in",
                phone="+919876543215",
                password_hash=hashed_password,
                role=UserRole.HOSPITAL,
                is_active=True,
            ),
        ]
        db.add_all(users)
        db.commit()

        # Reload users to get IDs
        dispatcher = db.query(User).filter(User.email == "dispatcher@ero.gov.in").first()
        driver1 = db.query(User).filter(User.email == "driver@ero.gov.in").first()
        driver2 = db.query(User).filter(User.email == "driver2@ero.gov.in").first()
        citizen = db.query(User).filter(User.email == "citizen@ero.gov.in").first()

        print("\n2. Creating Bhubaneswar Stations & Hospitals...")
        stations = [
            Station(
                name="AIIMS Bhubaneswar Level-1 Trauma Centre",
                type="HOSPITAL",
                address="Sijua, Patrapada, Bhubaneswar, Odisha 751019",
                latitude=20.2285,
                longitude=85.7765,
                contact_phone="+916742476789",
                total_ambulances=8,
                available_ambulances=5,
                trauma_bays_total=12,
                trauma_bays_available=4,
            ),
            Station(
                name="SUM Ultimate Medicare",
                type="HOSPITAL",
                address="K8 Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha 751003",
                latitude=20.2882,
                longitude=85.7621,
                contact_phone="+916742386281",
                total_ambulances=6,
                available_ambulances=3,
                trauma_bays_total=10,
                trauma_bays_available=3,
            ),
            Station(
                name="Apollo Hospitals Bhubaneswar",
                type="HOSPITAL",
                address="Plot No. 251, Sainik School Rd, Unit 15, Bhubaneswar 751005",
                latitude=20.3060,
                longitude=85.8312,
                contact_phone="+916746661066",
                total_ambulances=5,
                available_ambulances=2,
                trauma_bays_total=8,
                trauma_bays_available=2,
            ),
            Station(
                name="Baramunda Central Fire Station",
                type="FIRE_STATION",
                address="Near Baramunda ISBT, Bhubaneswar 751003",
                latitude=20.2748,
                longitude=85.7951,
                contact_phone="+916742354101",
                total_ambulances=0,
                available_ambulances=0,
                trauma_bays_total=0,
                trauma_bays_available=0,
            ),
            Station(
                name="Master Canteen Traffic Police Control HQ",
                type="POLICE_STATION",
                address="Station Square, Kharvela Nagar, Bhubaneswar 751001",
                latitude=20.2662,
                longitude=85.8436,
                contact_phone="+916742533000",
                total_ambulances=0,
                available_ambulances=0,
                trauma_bays_total=0,
                trauma_bays_available=0,
            ),
        ]
        db.add_all(stations)
        db.commit()

        aiims = db.query(Station).filter(Station.name.like("%AIIMS%")).first()

        print("\n3. Creating Fleet Vehicles...")
        vehicles = [
            Vehicle(
                vehicle_number="OD-02-AX-1081",
                call_sign="ALS-Alpha-101",
                type=VehicleType.AMBULANCE,
                status=VehicleStatus.AVAILABLE,
                driver_id=driver1.id,
                current_latitude=20.2644,
                current_longitude=85.8281,
                speed_kmh=0.0,
                fuel_level_percent=92,
            ),
            Vehicle(
                vehicle_number="OD-02-BX-1082",
                call_sign="BLS-Bravo-102",
                type=VehicleType.AMBULANCE,
                status=VehicleStatus.AVAILABLE,
                driver_id=driver2.id,
                current_latitude=20.2961,
                current_longitude=85.8245,
                speed_kmh=0.0,
                fuel_level_percent=88,
            ),
            Vehicle(
                vehicle_number="OD-02-CX-1083",
                call_sign="ICU-Charlie-103",
                type=VehicleType.AMBULANCE,
                status=VehicleStatus.AVAILABLE,
                current_latitude=20.2410,
                current_longitude=85.7890,
                speed_kmh=0.0,
                fuel_level_percent=100,
            ),
            Vehicle(
                vehicle_number="OD-02-FT-2011",
                call_sign="Fire-Foxtrot-201",
                type=VehicleType.FIRE_TRUCK,
                status=VehicleStatus.AVAILABLE,
                current_latitude=20.2748,
                current_longitude=85.7951,
                speed_kmh=0.0,
                fuel_level_percent=95,
            ),
            Vehicle(
                vehicle_number="OD-02-PC-3011",
                call_sign="Police-Papa-301",
                type=VehicleType.POLICE,
                status=VehicleStatus.AVAILABLE,
                current_latitude=20.2662,
                current_longitude=85.8436,
                speed_kmh=0.0,
                fuel_level_percent=90,
            ),
        ]
        db.add_all(vehicles)
        db.commit()

        print("\n4. Creating Bhubaneswar Road Incidents & Traffic Bottlenecks...")
        incidents = [
            Incident(
                title="Rasulgarh Square Waterlogging",
                type=IncidentType.WATERLOGGING,
                severity=IncidentSeverity.HIGH,
                status=IncidentStatus.ACTIVE,
                latitude=20.2897,
                longitude=85.8647,
                address="Rasulgarh Overbridge Junction, Bhubaneswar",
                description="Heavy monsoon waterlogging under Rasulgarh overbridge. Speed reduced to 10 km/h.",
                created_by_id=dispatcher.id,
            ),
            Incident(
                title="Vani Vihar Flyover Metro Construction",
                type=IncidentType.CONSTRUCTION,
                severity=IncidentSeverity.MEDIUM,
                status=IncidentStatus.ACTIVE,
                latitude=20.3015,
                longitude=85.8410,
                address="NH-16 near Utkal University, Vani Vihar",
                description="Single lane barricading for metro pillar foundation near Utkal University.",
                created_by_id=dispatcher.id,
            ),
            Incident(
                title="Jayadev Vihar Junction Traffic Signal Glitch",
                type=IncidentType.SIGNAL_FAILURE,
                severity=IncidentSeverity.HIGH,
                status=IncidentStatus.ACTIVE,
                latitude=20.3041,
                longitude=85.8239,
                address="Jayadev Vihar Square, Bhubaneswar",
                description="Automated signal timing failure causing heavy gridlock towards Nandankanan road.",
                created_by_id=dispatcher.id,
            ),
        ]
        db.add_all(incidents)
        db.commit()

        print("\n5. Creating Initial Test Emergency Cases...")
        emergency_1 = Emergency(
            emergency_number="EMG-2026-0001",
            type=EmergencyType.MEDICAL,
            priority=EmergencyPriority.CRITICAL,
            status=EmergencyStatus.TRIAGED,
            citizen_id=citizen.id,
            destination_hospital_id=aiims.id,
            pickup_address="Plot 104, Saheed Nagar, Bhubaneswar",
            pickup_latitude=20.2961,
            pickup_longitude=85.8245,
            destination_name=aiims.name,
            destination_address=aiims.address,
            destination_latitude=aiims.latitude,
            destination_longitude=aiims.longitude,
            caller_name="Debabrata Dash",
            caller_phone="+919876543214",
            description="Severe acute cardiac distress. Patient is conscious but in severe discomfort.",
            eta_minutes=14,
            distance_remaining_km=8.2,
        )
        db.add(emergency_1)
        db.commit()

        print("\n6. Adding Audit & Initial Notifications...")
        audit = AuditLog(
            user_id=citizen.id,
            action=AuditAction.CREATE_EMERGENCY,
            entity_type="EMERGENCY",
            entity_id=emergency_1.id,
            metadata_json='{"priority": "CRITICAL", "type": "MEDICAL", "city": "Bhubaneswar"}',
        )
        notification = Notification(
            user_id=dispatcher.id,
            emergency_id=emergency_1.id,
            title="NEW SOS: Critical Cardiac Emergency Reported",
            message="Critical emergency EMG-2026-0001 reported in Saheed Nagar. Immediate triage required.",
            type="EMERGENCY_CREATED",
        )
        db.add_all([audit, notification])
        db.commit()

        print("==================================================")
        print(" SEED DATA COMPLETED SUCCESSFULLY!                ")
        print("==================================================")
        print("\n[DEVELOPMENT CREDENTIALS]")
        print("--------------------------------------------------")
        print("Role:       ADMIN")
        print("Email:      admin@ero.gov.in")
        print("Password:   emergency2026")
        print("--------------------------------------------------")
        print("Role:       DISPATCHER")
        print("Email:      dispatcher@ero.gov.in")
        print("Password:   emergency2026")
        print("--------------------------------------------------")
        print("Role:       DRIVER (Ambulance 1081)")
        print("Email:      driver@ero.gov.in")
        print("Password:   emergency2026")
        print("--------------------------------------------------")
        print("Role:       CITIZEN")
        print("Email:      citizen@ero.gov.in")
        print("Password:   emergency2026")
        print("--------------------------------------------------")
        print("Role:       HOSPITAL (AIIMS Trauma Triage)")
        print("Email:      hospital@ero.gov.in")
        print("Password:   emergency2026")
        print("==================================================")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Database seeding failed: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
