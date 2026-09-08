from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate


class NotificationService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = NotificationRepository(db)

    def send_notification(
        self,
        title: str,
        message: str,
        user_id: Optional[str] = None,
        target_role: Optional[str] = None,
        emergency_id: Optional[str] = None,
        notification_type: str = "info"
    ) -> Notification:
        notif = Notification(
            title=title,
            message=message,
            user_id=user_id,
            target_role=target_role,
            emergency_id=emergency_id,
            type=notification_type
        )
        return self.repo.create(notif)

    def get_user_notifications(
        self,
        user_id: Optional[str] = None,
        unread_only: bool = False,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Notification], int]:
        skip = (page - 1) * limit
        items = self.repo.get_for_user_or_role(user_id=user_id, skip=skip, limit=limit)
        if unread_only:
            items = [n for n in items if not n.is_read]
        total = len(items)
        return items, total

    def get_notifications(
        self,
        user_id: Optional[str] = None,
        role: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Notification]:
        return self.repo.get_for_user_or_role(user_id=user_id, role=role, skip=skip, limit=limit)

    def mark_read(self, notification_id: str, user_id: Optional[str] = None) -> Optional[Notification]:
        return self.repo.mark_as_read(notification_id)

    def mark_all_read(self, user_id: Optional[str] = None, role: Optional[str] = None) -> int:
        return self.repo.mark_all_as_read(user_id=user_id, role=role)
