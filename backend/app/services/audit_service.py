import json
from typing import Optional, Any, Dict, List, Tuple
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.repositories.audit_repository import AuditRepository
from app.utils.enums import AuditAction


class AuditService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AuditRepository(db)

    def log_action(
        self,
        action: AuditAction,
        entity_type: str,
        entity_id: str,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> AuditLog:
        """Create structured audit log entry."""
        metadata_str = None
        if metadata:
            # Strip any sensitive fields if accidentally included
            clean_meta = {k: v for k, v in metadata.items() if "password" not in k.lower() and "token" not in k.lower()}
            metadata_str = json.dumps(clean_meta)

        log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id),
            metadata_json=metadata_str,
            ip_address=ip_address
        )
        return self.repo.create(log)

    def get_logs(
        self,
        action: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        user_id: Optional[str] = None,
        page: int = 1,
        limit: int = 25,
    ) -> Tuple[List[AuditLog], int]:
        skip = (page - 1) * limit
        audit_action = AuditAction(action) if action else None
        items = self.repo.get_all(
            skip=skip,
            limit=limit,
            user_id=user_id,
            action=audit_action,
            entity_type=entity_type,
            entity_id=entity_id,
        )
        total = self.repo.count(
            user_id=user_id,
            action=audit_action,
            entity_type=entity_type,
            entity_id=entity_id,
        )
        return items, total
