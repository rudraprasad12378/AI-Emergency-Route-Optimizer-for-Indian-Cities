from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.utils.enums import TrafficLevel, RouteEventType, EmergencyPriority


class RouteResponse(BaseModel):
    id: str
    emergency_id: str
    route_name: str
    distance_km: float
    eta_minutes: int
    time_saved_minutes: float = 0.0
    traffic_level: TrafficLevel = TrafficLevel.FREE
    risk_score: float = 10.0
    ai_score: float = 85.0
    confidence_score: float = 0.90
    is_recommended: bool = False
    ai_explanation: Optional[str] = None
    waypoints_json: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        from_attributes = True


class RouteCalculationRequest(BaseModel):
    emergency_id: Optional[str] = None
    pickup_lat: float = Field(ge=19.0, le=22.0)
    pickup_lng: float = Field(ge=83.0, le=88.0)
    dest_lat: float = Field(ge=19.0, le=22.0)
    dest_lng: float = Field(ge=83.0, le=88.0)
    priority: EmergencyPriority = EmergencyPriority.CRITICAL
    avoid_incidents: bool = True
    prioritize_signals: bool = True


class RouteEventResponse(BaseModel):
    id: str
    emergency_id: str
    route_id: Optional[str] = None
    event_type: RouteEventType
    reason: str
    old_eta_minutes: Optional[int] = None
    new_eta_minutes: Optional[int] = None
    triggered_by_id: Optional[str] = None
    details_json: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        from_attributes = True


class AIRecommendationDetail(BaseModel):
    recommended_route_id: str
    confidence: float
    reason: str
    time_saved_minutes: float
    score: float


class AIRecommendationResponse(BaseModel):
    recommended_route_id: str
    confidence: float
    reason: str
    time_saved_minutes: float
    score: float
    candidate_routes: List[RouteResponse]


class RouteCalculationResponse(BaseModel):
    routes: List[RouteResponse]
    candidate_routes: List[RouteResponse]
    ai_recommendation: AIRecommendationDetail
    recommended_route_id: str
    confidence: float
    reason: str
    time_saved_minutes: float
    score: float


class RerouteRequest(BaseModel):
    emergency_id: str
    reason: str = Field(min_length=3, max_length=255)
    incident_id: Optional[str] = None


class RerouteResponse(BaseModel):
    status: str = "REROUTED"
    emergency_id: str
    event_id: str
    new_eta_minutes: int
    routes: List[RouteResponse]
    ai_recommendation: AIRecommendationDetail


RouteOut = RouteResponse
RouteEventOut = RouteEventResponse
