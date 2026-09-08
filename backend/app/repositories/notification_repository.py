from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.notification import Notification


class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, notification_id: str) -> Optional[Notification]:
        return self.db.get(Notification, notification_id)

    def get_for_user_or_role(
        self,
        user_id: Optional[str] = None,
        role: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Notification]:
        stmt = select(Notification)
        conditions = []
        if user_id:
            conditions.append(Notification.user_id == user_id)
        if role:
            conditions.append(Notification.target_role == role)
            conditions.append(Notification.target_role == "all")
        
        if conditions:
            from sqlalchemy import or_
            stmt = stmt.where(or_(*conditions))
            
        stmt = stmt.offset(skip).limit(limit).order_by(Notification.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def mark_as_read(self, notification_id: str) -> Optional[Notification]:
        notif = self.get_by_id(notification_id)
        if notif:
            notif.is_read = True
            notif.read_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(notif)
        return notif

    def mark_all_as_read(self, user_id: Optional[str] = None, role: Optional[str] = None):
        notifications = self.get_for_user_or_role(user_id=user_id, role=role, limit=200)
        now = datetime.now(timezone.utc)
        for n in notifications:
            n.is_read = True
            n.read_at = now
        self.db.commit()

    def create(self, notification: Notification) -> Notification:
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification
