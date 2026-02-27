from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_predict_salary():
    #login as admin
    login_response = client.post("/login", json={"username": "admin", "password": "admin"})
    token = login_response.json()["access_token"]
    
    #test Prediction
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
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/predict", json=payload, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert "predicted_salary" in data
    print(f"Prediction success: {data['predicted_salary']}")