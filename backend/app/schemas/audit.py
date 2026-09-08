from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.utils.enums import AuditAction


class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: AuditAction
    entity_type: str
    entity_id: str
    metadata_json: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


AuditLogOut = AuditLogResponse
