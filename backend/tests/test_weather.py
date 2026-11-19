"""
Unit and integration tests for Weather and Forecast endpoints.
"""


def test_get_current_weather_success(client):
    """Verify retrieving current weather for a valid city returns structured metrics."""
    response = client.get("/api/weather/London")
    assert response.status_code == 200
    data = response.get_json()

    # Verify root fields
    assert data["city"] == "London"
    assert "country" in data
    assert "coordinates" in data

    # Verify temperature block
    assert "temperature" in data
    assert "current" in data["temperature"]
    assert "feels_like" in data["temperature"]
    assert "temp_min" in data["temperature"]
    assert "temp_max" in data["temperature"]

    # Verify condition and metrics
    assert "condition" in data
    assert "main" in data["condition"]
    assert "icon" in data["condition"]
    assert "metrics" in data
    assert "humidity" in data["metrics"]
    assert "wind_speed" in data["metrics"]
    assert "pressure" in data["metrics"]


def test_get_weather_imperial_units(client):
    """Verify that specifying imperial units reflects in the response payload."""
    response = client.get("/api/weather/Paris?units=imperial")
    assert response.status_code == 200
    data = response.get_json()
    assert data["temperature"]["unit"] == "°F"


def test_get_weather_empty_city_returns_400(client):
    """Verify querying with empty or whitespace city returns 400 Bad Request."""
    response = client.get("/api/weather/%20")
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data


def test_get_forecast_success(client):
    """Verify retrieving 5-day predictive forecast for a city."""
    response = client.get("/api/forecast/Tokyo")
    assert response.status_code == 200
    data = response.get_json()

    assert data["city"] == "Tokyo"
    assert "daily" in data
    assert len(data["daily"]) == 5
    assert "slices" in data

    # Verify daily aggregate format
    first_day = data["daily"][0]
    assert "date" in first_day
    assert "temp_min" in first_day
    assert "temp_max" in first_day
    assert "condition" in first_day
    assert "icon" in first_day

