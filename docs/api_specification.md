# RESTful API Specification
## Project: Weather Forecast & Monitoring System
**Document Version:** 1.0.0  
**Phase:** Week 1 — API Contract Design  
**Base URL:** `http://localhost:5000/api`  

---

### 1. Global Response & Error Convention

All API endpoints return JSON payloads. Errors adhere to a standard envelope format:

```json
{
  "error": "Descriptive human-readable error message",
  "status_code": 404
}
```

Standard HTTP status codes utilized:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Missing parameters, invalid payload, or duplicate record.
- `404 Not Found`: City or entity identifier not found.
- `500 Internal Server Error`: Unhandled backend exception or upstream API timeout.

---

### 2. Endpoints Specification

#### 2.1 System Health
- **Endpoint:** `GET /health`
- **Description:** Verifies backend responsiveness, service metadata, and database connectivity.
- **Request Headers:** None
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "service": "Weather Forecast & Monitoring System API",
    "version": "1.0.0",
    "environment": "development",
    "database": "connected"
  }
  ```

---

#### 2.2 Current Weather
- **Endpoint:** `GET /weather/<city>`
- **Description:** Fetches real-time weather observation parameters for a given city.
- **URL Parameters:** `city` (string, required) — e.g., `London`, `Tokyo`, `Mumbai`
- **Response `200 OK`:**
  ```json
  {
    "city": "London",
    "country": "GB",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    },
    "temperature": {
      "current": 15.4,
      "feels_like": 14.8,
      "temp_min": 13.2,
      "temp_max": 17.1
    },
    "condition": {
      "main": "Clouds",
      "description": "scattered clouds",
      "icon": "03d"
    },
    "metrics": {
      "humidity": 72,
      "pressure": 1014,
      "visibility": 10000,
      "wind_speed": 4.12,
      "wind_deg": 240
    },
    "sun": {
      "sunrise": 1711782100,
      "sunset": 1711825600
    },
    "timestamp": 1711803200
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: `{"error": "City name parameter cannot be empty", "status_code": 400}`
  - `404 Not Found`: `{"error": "City 'Atlantis' not found", "status_code": 404}`
  - `504 Gateway Timeout`: `{"error": "Weather service upstream timed out", "status_code": 504}`

---

#### 2.3 Five-Day Forecast
- **Endpoint:** `GET /forecast/<city>`
- **Description:** Fetches 5-day predictive forecast with timestamped 3-hour interval slices.
- **URL Parameters:** `city` (string, required)
- **Response `200 OK`:**
  ```json
  {
    "city": "London",
    "country": "GB",
    "cnt": 40,
    "forecast": [
      {
        "datetime": "2026-11-19 12:00:00",
        "timestamp": 1711800000,
        "temperature": 16.2,
        "temp_min": 14.5,
        "temp_max": 16.8,
        "humidity": 68,
        "condition": "Rain",
        "description": "light rain",
        "icon": "10d",
        "wind_speed": 4.5
      }
    ]
  }
  ```

---

#### 2.4 Favorites Management

##### Retrieve Saved Favorites
- **Endpoint:** `GET /favorites`
- **Response `200 OK`:**
  ```json
  [
    {
      "id": 1,
      "city_name": "Tokyo",
      "country": "JP",
      "latitude": 35.6762,
      "longitude": 139.6503,
      "created_at": "2026-11-19T04:20:00.000Z"
    }
  ]
  ```

##### Add New Favorite
- **Endpoint:** `POST /favorites`
- **Request Body:**
  ```json
  {
    "city_name": "Tokyo",
    "country": "JP",
    "latitude": 35.6762,
    "longitude": 139.6503
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "message": "City added to favorites successfully",
    "favorite": {
      "id": 1,
      "city_name": "Tokyo",
      "country": "JP",
      "latitude": 35.6762,
      "longitude": 139.6503,
      "created_at": "2026-11-19T04:20:00.000Z"
    }
  }
  ```

##### Delete Favorite
- **Endpoint:** `DELETE /favorites/<id>`
- **URL Parameters:** `id` (integer, required)
- **Response `200 OK`:**
  ```json
  {
    "message": "Favorite removed successfully",
    "id": 1
  }
  ```

---

#### 2.5 Search History Tracking

##### Retrieve Search History
- **Endpoint:** `GET /history`
- **Query Parameters:** `limit` (integer, optional, default: 10)
- **Response `200 OK`:**
  ```json
  [
    {
      "id": 42,
      "city_name": "London",
      "searched_at": "2026-11-19T04:22:30.000Z"
    }
  ]
  ```

##### Record New Search Event
- **Endpoint:** `POST /history`
- **Request Body:**
  ```json
  {
    "city_name": "London"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "message": "Search logged",
    "history": {
      "id": 42,
      "city_name": "London",
      "searched_at": "2026-11-19T04:22:30.000Z"
    }
  }
  ```

