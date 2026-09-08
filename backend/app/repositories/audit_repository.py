from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.audit_log import AuditLog
from app.utils.enums import AuditAction


class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, log: AuditLog) -> AuditLog:
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_all(
        self,
        skip: int = 0,
        limit: int = 50,
        user_id: Optional[str] = None,
        action: Optional[AuditAction] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
    ) -> List[AuditLog]:
        stmt = select(AuditLog)
        if user_id:
            stmt = stmt.where(AuditLog.user_id == user_id)
        if action:
            stmt = stmt.where(AuditLog.action == action)
        if entity_type:
            stmt = stmt.where(AuditLog.entity_type == entity_type)
        if entity_id:
            stmt = stmt.where(AuditLog.entity_id == entity_id)
        stmt = stmt.offset(skip).limit(limit).order_by(AuditLog.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def count(
        self,
        user_id: Optional[str] = None,
        action: Optional[AuditAction] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
    ) -> int:
        stmt = select(func.count(AuditLog.id))
        if user_id:
            stmt = stmt.where(AuditLog.user_id == user_id)
        if action:
            stmt = stmt.where(AuditLog.action == action)
        if entity_type:
            stmt = stmt.where(AuditLog.entity_type == entity_type)
        if entity_id:
            stmt = stmt.where(AuditLog.entity_id == entity_id)
        return self.db.scalar(stmt) or 0
