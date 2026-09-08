from enum import Enum


class UserRole(str, Enum):
    DISPATCHER = "DISPATCHER"
    DRIVER = "DRIVER"
    CITIZEN = "CITIZEN"
    HOSPITAL = "HOSPITAL"
    ADMIN = "ADMIN"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class VehicleType(str, Enum):
    AMBULANCE = "AMBULANCE"
    FIRE_TRUCK = "FIRE_TRUCK"
    POLICE = "POLICE"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class VehicleStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    ASSIGNED = "ASSIGNED"
    EN_ROUTE = "EN_ROUTE"
    AT_SCENE = "AT_SCENE"
    OFFLINE = "OFFLINE"
    MAINTENANCE = "MAINTENANCE"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class EmergencyType(str, Enum):
    MEDICAL = "MEDICAL"
    FIRE = "FIRE"
    POLICE = "POLICE"
    CARDIAC_ARREST = "CARDIAC_ARREST"
    ROAD_ACCIDENT = "ROAD_ACCIDENT"
    BUILDING_FIRE = "BUILDING_FIRE"
    MATERNITY_EMERGENCY = "MATERNITY_EMERGENCY"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class EmergencyPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class EmergencyStatus(str, Enum):
    REQUESTED = "REQUESTED"
    TRIAGED = "TRIAGED"
    ASSIGNED = "ASSIGNED"
    ACCEPTED = "ACCEPTED"
    EN_ROUTE = "EN_ROUTE"
    REROUTING = "REROUTING"
    ARRIVING = "ARRIVING"
    ARRIVED = "ARRIVED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class IncidentType(str, Enum):
    ROAD_ACCIDENT = "ROAD_ACCIDENT"
    ROAD_BLOCKAGE = "ROAD_BLOCKAGE"
    WATERLOGGING = "WATERLOGGING"
    CONSTRUCTION = "CONSTRUCTION"
    FLOODING = "FLOODING"
    SIGNAL_FAILURE = "SIGNAL_FAILURE"
    VVIP_MOVEMENT = "VVIP_MOVEMENT"
    PROCESSION = "PROCESSION"
    OTHER = "OTHER"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class IncidentSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class IncidentStatus(str, Enum):
    ACTIVE = "ACTIVE"
    RESOLVED = "RESOLVED"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class TrafficLevel(str, Enum):
    FREE = "FREE"
    MODERATE = "MODERATE"
    HEAVY = "HEAVY"
    SEVERE = "SEVERE"
    BLOCKED = "BLOCKED"

    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.lower():
                    return member
        return None


class RouteEventType(str, Enum):
    ORIGINAL_DISPATCH = "ORIGINAL_DISPATCH"
    RECALCULATED = "RECALCULATED"
    REROUTE_APPROVED = "REROUTE_APPROVED"
    HAZARD_AVOIDANCE = "HAZARD_AVOIDANCE"
    TRAFFIC_UPDATE = "TRAFFIC_UPDATE"
    DESTINATION_CHANGED = "DESTINATION_CHANGED"


class AuditAction(str, Enum):
    LOGIN = "LOGIN"
    CREATE_EMERGENCY = "CREATE_EMERGENCY"
    TRIAGE_EMERGENCY = "TRIAGE_EMERGENCY"
    ASSIGN_VEHICLE = "ASSIGN_VEHICLE"
    ACCEPT_EMERGENCY = "ACCEPT_EMERGENCY"
    START_EMERGENCY = "START_EMERGENCY"
    UPDATE_LOCATION = "UPDATE_LOCATION"
    REROUTE = "REROUTE"
    ARRIVE = "ARRIVE"
    COMPLETE = "COMPLETE"
    CANCEL = "CANCEL"
    CREATE_INCIDENT = "CREATE_INCIDENT"
    RESOLVE_INCIDENT = "RESOLVE_INCIDENT"
    REGISTER_VEHICLE = "REGISTER_VEHICLE"
    CREATE_USER = "CREATE_USER"
