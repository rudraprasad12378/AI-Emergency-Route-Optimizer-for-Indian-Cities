from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.utils.enums import UserRole


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email.lower().strip())
        return self.db.scalars(stmt).first()

    def get_all(self, skip: int = 0, limit: int = 50, role: Optional[UserRole] = None) -> List[User]:
        stmt = select(User)
        if role:
            stmt = stmt.where(User.role == role)
        stmt = stmt.offset(skip).limit(limit).order_by(User.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def count(self, role: Optional[UserRole] = None) -> int:
        stmt = select(User)
        if role:
            stmt = stmt.where(User.role == role)
        return len(list(self.db.scalars(stmt).all()))

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user
