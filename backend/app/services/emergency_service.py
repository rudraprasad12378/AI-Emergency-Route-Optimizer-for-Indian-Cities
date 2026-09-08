from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.emergency import Emergency
from app.models.user import User
from app.repositories.emergency_repository import EmergencyRepository
from app.schemas.emergency import EmergencyCreate, EmergencyUpdate, EmergencyTriage
from app.services.vehicle_service import VehicleService
from app.services.notification_service import NotificationService
from app.services.audit_service import AuditService
from app.services.route_service import RouteService
from app.core.exceptions import (
    NotFoundError,
    ValidationError,
    InvalidStateTransitionError,
    PermissionDeniedError,
)
from app.utils.enums import EmergencyStatus, EmergencyPriority, EmergencyType, AuditAction, UserRole, VehicleStatus


class EmergencyService:
    # State Machine Definition: Current State -> Allowed Next States
    VALID_TRANSITIONS = {
        EmergencyStatus.REQUESTED: [EmergencyStatus.TRIAGED, EmergencyStatus.ASSIGNED, EmergencyStatus.CANCELLED],
        EmergencyStatus.TRIAGED: [EmergencyStatus.ASSIGNED, EmergencyStatus.CANCELLED],
        EmergencyStatus.ASSIGNED: [EmergencyStatus.ACCEPTED, EmergencyStatus.CANCELLED],
        EmergencyStatus.ACCEPTED: [EmergencyStatus.EN_ROUTE, EmergencyStatus.CANCELLED],
        EmergencyStatus.EN_ROUTE: [EmergencyStatus.REROUTING, EmergencyStatus.ARRIVING, EmergencyStatus.ARRIVED, EmergencyStatus.CANCELLED],
        EmergencyStatus.REROUTING: [EmergencyStatus.EN_ROUTE, EmergencyStatus.ARRIVING, EmergencyStatus.ARRIVED],
        EmergencyStatus.ARRIVING: [EmergencyStatus.ARRIVED, EmergencyStatus.CANCELLED],
        EmergencyStatus.ARRIVED: [EmergencyStatus.COMPLETED],
        EmergencyStatus.COMPLETED: [],
        EmergencyStatus.CANCELLED: [],
    }

    def __init__(self, db: Session):
        self.db = db
        self.repo = EmergencyRepository(db)
        self.vehicle_service = VehicleService(db)
        self.notif_service = NotificationService(db)
        self.audit_service = AuditService(db)
        self.route_service = RouteService(db)

    def _generate_emergency_number(self) -> str:
        count = self.repo.count() + 890
        year = datetime.now().year
        return f"EMG-{year}-{str(count).zfill(4)}"

    def get_emergency(self, emergency_id: str) -> Emergency:
        emg = self.repo.get_by_id(emergency_id)
        if not emg:
            raise NotFoundError("Emergency", emergency_id)
        return emg

    def list_emergencies(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[EmergencyStatus] = None,
        priority: Optional[EmergencyPriority] = None,
        emergency_type: Optional[EmergencyType] = None,
        citizen_id: Optional[str] = None,
        assigned_vehicle_id: Optional[str] = None,
        hospital_id: Optional[str] = None
    ) -> List[Emergency]:
        return self.repo.get_all(
            skip=skip,
            limit=limit,
            status=status,
            priority=priority,
            emergency_type=emergency_type,
            citizen_id=citizen_id,
            assigned_vehicle_id=assigned_vehicle_id,
            hospital_id=hospital_id
        )

    def create_emergency(self, emg_in: EmergencyCreate, citizen: Optional[User] = None) -> Emergency:
        emg = Emergency(
            emergency_number=self._generate_emergency_number(),
            type=emg_in.type,
            priority=emg_in.priority,
            status=EmergencyStatus.REQUESTED,
            citizen_id=citizen.id if citizen else None,
            pickup_address=emg_in.pickup_address,
            pickup_landmark=emg_in.pickup_landmark,
            pickup_latitude=emg_in.pickup_latitude,
            pickup_longitude=emg_in.pickup_longitude,
            destination_name=emg_in.destination_name,
            destination_address=emg_in.destination_address,
            destination_latitude=emg_in.destination_latitude,
            destination_longitude=emg_in.destination_longitude,
            description=emg_in.description,
            patient_count=emg_in.patient_count,
            caller_name=emg_in.caller_name or (citizen.name if citizen else "Citizen Caller"),
            caller_phone=emg_in.caller_phone or (citizen.phone if citizen else "+91 108"),
            destination_hospital_id=emg_in.destination_hospital_id,
            eta_minutes=14,
            distance_remaining_km=8.2,
            simulation_progress=0
        )
        created = self.repo.create(emg)

        # Pre-compute routes
        try:
            self.route_service.calculate_routes(created.id)
        except Exception:
            pass

        self.audit_service.log_action(
            action=AuditAction.CREATE_EMERGENCY,
            entity_type="emergency",
            entity_id=created.id,
            user_id=citizen.id if citizen else None,
            metadata={"emergency_number": created.emergency_number, "priority": created.priority.value}
        )

        self.notif_service.send_notification(
            title=f"🚨 New Emergency: {created.emergency_number}",
            message=f"{created.type.value.capitalize()} at {created.pickup_address}. Priority: {created.priority.value.upper()}.",
            target_role="dispatcher",
            emergency_id=created.id,
            notification_type="critical" if created.priority == EmergencyPriority.CRITICAL else "warning"
        )
        return created

    def _validate_transition(self, emergency: Emergency, target_status: EmergencyStatus):
        allowed = self.VALID_TRANSITIONS.get(emergency.status, [])
        if target_status not in allowed:
            raise InvalidStateTransitionError(
                current_state=emergency.status.value,
                requested_state=target_status.value,
                allowed_states=[s.value for s in allowed]
            )

    def triage_emergency(self, emergency_id: str, triage_in: EmergencyTriage, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.TRIAGED)

        emg.status = EmergencyStatus.TRIAGED
        emg.priority = triage_in.priority
        if triage_in.destination_hospital_id:
            emg.destination_hospital_id = triage_in.destination_hospital_id
        emg.triaged_at = datetime.now(timezone.utc)
        
        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.TRIAGE_EMERGENCY,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id,
            metadata={"priority": updated.priority.value}
        )
        return updated

    def assign_vehicle(self, emergency_id: str, vehicle_id: str, actor: User) -> Emergency:
        """
        Transactional Vehicle Assignment.
        Locks vehicle row with SELECT FOR UPDATE, sets Vehicle -> ASSIGNED, Emergency -> ASSIGNED.
        """
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.ASSIGNED)

        # Concurrency Lock on Vehicle
        vehicle = self.vehicle_service.reserve_and_assign_vehicle(vehicle_id)

        emg.assigned_vehicle_id = vehicle.id
        emg.status = EmergencyStatus.ASSIGNED
        emg.assigned_at = datetime.now(timezone.utc)
        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.ASSIGN_VEHICLE,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id,
            metadata={"vehicle_id": vehicle.id, "call_sign": vehicle.call_sign}
        )

        # Notify Driver and Citizen
        self.notif_service.send_notification(
            title=f"🚨 New Mission Assignment: {updated.emergency_number}",
            message=f"Proceed to {updated.pickup_address}. Priority: {updated.priority.value.upper()}.",
            target_role="driver",
            user_id=vehicle.driver_id,
            emergency_id=updated.id,
            notification_type="critical"
        )
        self.notif_service.send_notification(
            title="Ambulance Assigned to Your Request",
            message=f"Unit {vehicle.call_sign} assigned. ETA: {updated.eta_minutes} mins.",
            target_role="citizen",
            user_id=updated.citizen_id,
            emergency_id=updated.id,
            notification_type="info"
        )
        return updated

    def accept_mission(self, emergency_id: str, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.ACCEPTED)

        emg.status = EmergencyStatus.ACCEPTED
        emg.accepted_at = datetime.now(timezone.utc)
        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.ACCEPT_EMERGENCY,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id
        )

        self.notif_service.send_notification(
            title=f"Mission Acknowledged: {updated.emergency_number}",
            message=f"Driver acknowledged assignment. Preparing transit.",
            target_role="dispatcher",
            emergency_id=updated.id,
            notification_type="info"
        )
        return updated

    def start_journey(self, emergency_id: str, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.EN_ROUTE)

        emg.status = EmergencyStatus.EN_ROUTE
        emg.started_at = datetime.now(timezone.utc)
        emg.green_corridor_active = True

        # Update vehicle status
        if emg.assigned_vehicle:
            emg.assigned_vehicle.status = VehicleStatus.EN_ROUTE
            self.vehicle_service.repo.update(emg.assigned_vehicle)

        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.START_EMERGENCY,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id
        )

        # Notify Control Center and Hospital
        self.notif_service.send_notification(
            title=f"Ambulance En Route: {updated.emergency_number}",
            message=f"Unit en route with Green Corridor priority. ETA: {updated.eta_minutes}m.",
            target_role="dispatcher",
            emergency_id=updated.id,
            notification_type="info"
        )
        self.notif_service.send_notification(
            title=f"Incoming Emergency: {updated.emergency_number}",
            message=f"{updated.type.value.capitalize()} ({updated.priority.value.upper()}) heading to trauma bay. ETA: {updated.eta_minutes}m.",
            target_role="hospital",
            emergency_id=updated.id,
            notification_type="warning"
        )
        return updated

    def mark_arrived(self, emergency_id: str, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.ARRIVED)

        emg.status = EmergencyStatus.ARRIVED
        emg.arrived_at = datetime.now(timezone.utc)
        emg.eta_minutes = 0
        emg.distance_remaining_km = 0.0
        emg.simulation_progress = 100

        if emg.assigned_vehicle:
            emg.assigned_vehicle.status = VehicleStatus.AT_SCENE
            self.vehicle_service.repo.update(emg.assigned_vehicle)

        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.ARRIVE,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id
        )

        self.notif_service.send_notification(
            title=f"Ambulance Arrived at Hospital Bay",
            message=f"Unit docked at trauma reception for emergency {updated.emergency_number}.",
            target_role="hospital",
            emergency_id=updated.id,
            notification_type="success"
        )
        return updated

    def complete_emergency(self, emergency_id: str, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.COMPLETED)

        emg.status = EmergencyStatus.COMPLETED
        emg.completed_at = datetime.now(timezone.utc)
        emg.green_corridor_active = False

        # Free vehicle back to AVAILABLE
        if emg.assigned_vehicle:
            emg.assigned_vehicle.status = VehicleStatus.AVAILABLE
            self.vehicle_service.repo.update(emg.assigned_vehicle)

        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.COMPLETE,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id
        )

        self.notif_service.send_notification(
            title=f"Emergency Completed: {updated.emergency_number}",
            message=f"Patient handover finalized. Unit released to available pool.",
            target_role="all",
            emergency_id=updated.id,
            notification_type="success"
        )
        return updated

    def cancel_emergency(self, emergency_id: str, reason: str, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        self._validate_transition(emg, EmergencyStatus.CANCELLED)

        emg.status = EmergencyStatus.CANCELLED
        emg.cancelled_at = datetime.now(timezone.utc)

        if emg.assigned_vehicle:
            emg.assigned_vehicle.status = VehicleStatus.AVAILABLE
            self.vehicle_service.repo.update(emg.assigned_vehicle)

        updated = self.repo.update(emg)

        self.audit_service.log_action(
            action=AuditAction.CANCEL,
            entity_type="emergency",
            entity_id=updated.id,
            user_id=actor.id,
            metadata={"reason": reason}
        )
        return updated

    def toggle_green_corridor(self, emergency_id: str, active: bool, actor: User) -> Emergency:
        emg = self.get_emergency(emergency_id)
        emg.green_corridor_active = active
        return self.repo.update(emg)
