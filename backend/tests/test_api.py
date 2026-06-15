from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "EcoTrack API is running."}

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ai_status" in data

def test_calculate_footprint():
    payload = {
        "activities": [
            {"id": "1", "type": "cab_travel", "distance_km": 10},
            {"id": "2", "type": "walk", "distance_km": 2}
        ]
    }
    response = client.post("/api/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    # 10 km cab * 0.25 = 2.5
    assert data["total_emissions_kg"] == 2.5

def test_insights_fallback():
    payload = {
        "user_id": "test",
        "recent_activities": [{"type": "cab_travel"}],
        "total_emissions": 6.0
    }
    response = client.post("/api/insights", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    # If API key is not configured, it should fallback
    assert data["source"] in ["ai", "fallback"]
