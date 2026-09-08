from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.route import Route
from app.models.route_event import RouteEvent


class RouteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, route_id: str) -> Optional[Route]:
        return self.db.get(Route, route_id)

    def get_by_emergency_id(self, emergency_id: str) -> List[Route]:
        stmt = select(Route).where(Route.emergency_id == emergency_id).order_by(Route.is_recommended.desc(), Route.ai_score.desc())
        return list(self.db.scalars(stmt).all())

    def create(self, route: Route) -> Route:
        self.db.add(route)
        self.db.commit()
        self.db.refresh(route)
        return route

    def create_event(self, event: RouteEvent) -> RouteEvent:
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_events_by_emergency_id(self, emergency_id: str) -> List[RouteEvent]:
        stmt = select(RouteEvent).where(RouteEvent.emergency_id == emergency_id).order_by(RouteEvent.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def clear_routes_for_emergency(self, emergency_id: str):
        routes = self.get_by_emergency_id(emergency_id)
        for r in routes:
            self.db.delete(r)
        self.db.commit()
