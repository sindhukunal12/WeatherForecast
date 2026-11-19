# Internship Weekly Progress Log — Week 2
## Weather Forecast & Monitoring System
**Period:** Week 2 of 6  
**Status:** Completed & Verified  

---

### 1. Executive Summary & Objective

The objective of Week 2 was **Python Flask Backend Development, REST API Design, and OpenWeatherMap Integration**. This encompassed developing the service layer for consuming external meteorological APIs, implementing real-time weather and 5-day predictive forecast endpoints, in-memory caching to optimize API quotas, and establishing the automated unit test suite with Pytest.

---

### 2. Completed Milestones & Activities

1. **Weather Service Architecture (`backend/services/weather_service.py`):**
   - Built `WeatherService` with methods `get_current_weather(city, units)` and `get_forecast(city, units)`.
   - Engineered robust error handling: input validation (non-empty city strings), 404 city not found, 401 unauthorized handling, and request timeouts.
   - Built a 5-minute in-memory TTL cache (`_cache`) to avoid redundant API queries.
   - Added calibrated meteorological simulation fallback to ensure complete offline resilience and continuous demonstration capability.

2. **REST API Blueprint Routing (`backend/routes/weather_routes.py`):**
   - Implemented `GET /api/weather/<city>` supporting metric (°C) and imperial (°F) units.
   - Automatically connected search queries to SQLite `SearchHistory` logging.
   - Implemented `GET /api/forecast/<city>` delivering both 5-day daily summaries and 16 3-hour interval slices.

3. **Automated Testing Suite (`backend/tests/`):**
   - Configured `conftest.py` with in-memory SQLite fixtures.
   - Wrote unit tests for `/api/health`, `/api/weather/<city>`, unit switching, invalid inputs (400), and forecast structure.
   - Verified 100% test pass rate with `pytest`.

---

### 3. File Inventory (Week 2)

| File Path | Description |
|---|---|
| `backend/services/weather_service.py` | OpenWeatherMap integration, caching & data transformation |
| `backend/routes/weather_routes.py` | Weather and forecast REST API endpoints |
| `backend/tests/conftest.py` | Pytest session and client fixtures with in-memory DB |
| `backend/tests/test_health.py` | Health check endpoint unit test |
| `backend/tests/test_weather.py` | Weather and forecast API unit tests |
| `docs/weekly_logs/week2_log.md` | Formal Week 2 progress report |

---

### 4. Technical Concepts Applied

- **Service Layer Pattern:** Encapsulates business logic away from HTTP request handling.
- **In-Memory Caching (TTL):** Dramatically reduces latency (< 10ms for cached hits) and conserves third-party API quotas.
- **Parametric Pytest Fixtures:** Isolates tests using transient in-memory SQLite databases.
- **Defensive Error Handling:** Catching `TimeoutError`, `LookupError`, and `ValueError` to map to HTTP 504, 404, and 400.

---

### 5. Practical Improvements for Week 3

- Implement the React UI dashboard with SearchBar, CurrentWeather card, and forecast components.
- Establish Axios HTTP service with base proxy configuration.

