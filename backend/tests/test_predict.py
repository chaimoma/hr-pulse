from fastapi.testclient import TestClient
from backend.app.main import app, verify_token
import pytest

# overriding the verify_token dependency for tests
async def override_verify_token():
    return {"sub": "testuser"}

app.dependency_overrides[verify_token] = override_verify_token

client = TestClient(app)

def test_predict_salary():
    payload = {
        "job_title": "Data Scientist",
        "job_description": "We are looking for a Python expert with ML knowledge.",
        "rating": 4.5,
        "location": "Remote",
        "size": "500-1000",
        "industry": "Tech",
        "sector": "Software",
        "founded": 2010
    }
    
    response = client.post("/predict", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "predicted_salary" in data
    assert data["predicted_salary"].startswith("$")
    print(f"Prediction success: {data['predicted_salary']}")