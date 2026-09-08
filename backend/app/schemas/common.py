import math
from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Page number")
    limit: int = Field(default=20, ge=1, le=100, description="Items per page")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    limit: int
    pages: int

    @classmethod
    def create(cls, items: List[T], total: int, page: int = 1, limit: int = 20):
        pages = math.ceil(total / limit) if limit > 0 else 1
        return cls(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=max(1, pages)
        )


class MessageResponse(BaseModel):
    success: bool = True
    message: str
