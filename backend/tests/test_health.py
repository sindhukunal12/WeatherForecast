"""
Unit tests for the Health and Diagnostics endpoint.
"""


def test_health_check_endpoint(client):
    """Verify that /api/health returns 200 OK with expected metadata."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert "Weather Forecast" in data["service"]
    assert data["database"] == "connected"

