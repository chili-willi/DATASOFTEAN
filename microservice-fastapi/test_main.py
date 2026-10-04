from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"

def test_get_ledger():
    response = client.get("/api/micro/blockchain/ledger")
    assert response.status_code == 200
    data = response.json()
    assert "length" in data
    assert "chain" in data
    assert data["is_valid"] is True
