from pydantic import BaseModel, Field
from typing import List, Optional

class ActivityData(BaseModel):
    id: str
    type: str = Field(..., description="E.g. cab_travel, food_order, walk")
    distance_km: Optional[float] = None
    cost: Optional[float] = None
    description: Optional[str] = None

class CalculateRequest(BaseModel):
    activities: List[ActivityData]

class InsightRequest(BaseModel):
    user_id: str
    recent_activities: List[dict]
    total_emissions: float

class OffsetRequest(BaseModel):
    user_id: str
    amount_kg: float
    habitat_id: str

class OffsetResponse(BaseModel):
    success: bool
    transaction_id: str
    message: str
