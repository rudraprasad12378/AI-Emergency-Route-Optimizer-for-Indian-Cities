from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.schemas.common import PaginatedResponse
from app.services.notification_service import NotificationService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=PaginatedResponse[NotificationOut])
def get_user_notifications(
    unread_only: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve notifications tailored to the authenticated user's role and assigned tasks."""
    service = NotificationService(db)
    items, total = service.get_user_notifications(
        user_id=current_user.id,
        unread_only=unread_only,
        page=page,
        limit=limit
    )
    return PaginatedResponse.create(
        items=[NotificationOut.model_validate(n) for n in items],
        total=total,
        page=page,
        limit=limit
    )


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark an individual notification as read."""
    service = NotificationService(db)
    notification = service.mark_read(notification_id=notification_id, user_id=current_user.id)
    return NotificationOut.model_validate(notification)


@router.post("/read-all", response_model=dict)
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all active notifications for the authenticated user as read."""
    service = NotificationService(db)
    count = service.mark_all_read(user_id=current_user.id)
    return {"message": f"Successfully marked {count} notifications as read", "updated_count": count}
