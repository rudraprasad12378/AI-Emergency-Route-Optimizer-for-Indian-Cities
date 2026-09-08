from typing import Any, Dict, Optional, List
from fastapi import HTTPException, status


class AppException(HTTPException):
    """Base application exception with structured error code and message."""
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail={"code": code, "message": message, "details": details or {}})
        self.code = code
        self.message = message
        self.details = details or {}


class AuthenticationError(AppException):
    def __init__(self, message: str = "Invalid email or password", code: str = "AUTHENTICATION_FAILED", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code=code,
            message=message,
            details=details
        )


class PermissionDeniedError(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action", code: str = "PERMISSION_DENIED", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code=code,
            message=message,
            details=details
        )


class NotFoundError(AppException):
    def __init__(self, resource: str, resource_id: Any):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="RESOURCE_NOT_FOUND",
            message=f"{resource} with ID '{resource_id}' was not found.",
            details={"resource": resource, "id": str(resource_id)}
        )


class InvalidStateTransitionError(AppException):
    def __init__(self, current_state: str, requested_state: str, allowed_states: list):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            code="INVALID_STATE_TRANSITION",
            message=f"Cannot transition from '{current_state}' to '{requested_state}'. Allowed transitions: {allowed_states}",
            details={"current_state": current_state, "requested_state": requested_state, "allowed_states": allowed_states}
        )


class VehicleUnavailableError(AppException):
    def __init__(self, vehicle_id: str, current_status: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            code="VEHICLE_UNAVAILABLE",
            message=f"Vehicle '{vehicle_id}' is currently '{current_status}' and cannot be assigned.",
            details={"vehicle_id": vehicle_id, "current_status": current_status}
        )


class ValidationError(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VALIDATION_ERROR",
            message=message,
            details=details
        )
