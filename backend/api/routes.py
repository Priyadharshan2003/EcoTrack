from fastapi import APIRouter, HTTPException, BackgroundTasks
from backend.models.schemas import CalculateRequest, InsightRequest, OffsetRequest, OffsetResponse
from backend.services.ai import generate_insight
from backend.services.fallback import get_fallback_insight
from backend.core.emission_factors import calculate_emissions
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/calculate")
async def calculate_footprint(request: CalculateRequest):
    """Calculate the carbon footprint for a batch of activities."""
    results = []
    total = 0.0
    for act in request.activities:
        # Distance calculation logic could be expanded here
        val = act.distance_km if act.distance_km else 1.0
        emissions = calculate_emissions(act.type, val)
        total += emissions
        results.append({
            "id": act.id,
            "emissions_kg": round(emissions, 2)
        })
    return {"status": "success", "total_emissions_kg": round(total, 2), "activities": results}

@router.post("/insights")
async def get_insights(request: InsightRequest):
    """Get AI-powered insights, with a strict rule-based fallback."""
    try:
        insight = await generate_insight(request.recent_activities, request.total_emissions)
        source = "ai"
    except Exception as e:
        logger.error(f"Fallback triggered due to: {str(e)}")
        insight = get_fallback_insight(request.recent_activities, request.total_emissions)
        source = "fallback"
        
    return {
        "status": "success",
        "insight": insight,
        "source": source
    }

@router.post("/offset/purchase", response_model=OffsetResponse)
async def purchase_offset(request: OffsetRequest):
    """Mock offset purchase processing (e.g., via Stripe/Supabase)."""
    if request.amount_kg <= 0:
        raise HTTPException(status_code=400, detail="Invalid offset amount")
        
    # In a real app, integrate Stripe here and write transaction to Supabase
    transaction_id = f"txn_{uuid.uuid4().hex[:12]}"
    
    return OffsetResponse(
        success=True,
        transaction_id=transaction_id,
        message=f"Successfully offset {request.amount_kg} kg of CO₂ in habitat {request.habitat_id}"
    )

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    """Retrieve user's verification history from Supabase (Mocked for now)."""
    # Requires Supabase client integration for real data
    return {
        "user_id": user_id,
        "history": [
            {"id": "mock_1", "type": "walk", "emissions_kg": 0.0, "timestamp": "2023-10-01T10:00:00Z"},
            {"id": "mock_2", "type": "cab_travel", "emissions_kg": 1.2, "timestamp": "2023-10-01T14:00:00Z"},
        ]
    }
