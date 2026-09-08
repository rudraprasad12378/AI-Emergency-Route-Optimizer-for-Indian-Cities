from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class NotificationCreate(BaseModel):
    user_id: Optional[str] = None
    target_role: Optional[str] = None
    emergency_id: Optional[str] = None
    title: str = Field(min_length=2, max_length=150)
    message: str = Field(min_length=2)
    type: str = "info"


class NotificationResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    target_role: Optional[str] = None
    emergency_id: Optional[str] = None
    title: str
    message: str
    type: str
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


NotificationOut = NotificationResponse
