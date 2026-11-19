# Internship Weekly Progress Log — Week 3
## Weather Forecast & Monitoring System
**Period:** Week 3 of 6  
**Status:** Completed & Verified  

---

### 1. Executive Summary & Objective

The objective of Week 3 was **React Frontend Development, Dashboard UI, City Search, and Frontend-Backend Integration**. This involved building the component architecture, establishing Axios client services, developing the responsive dashboard, and binding frontend search actions to the Flask REST API.

---

### 2. Completed Milestones & Activities

1. **Frontend Service Architecture (`frontend/src/services/api.js`):**
   - Configured centralized Axios instance with 12s timeout, JSON headers, and endpoint abstractions (`getCurrentWeather`, `getForecast`, `getHealth`).
   - Integrated Vite reverse proxy mapping `/api` to `http://localhost:5000`.

2. **Core Presentation Components:**
   - `SearchBar.jsx`: Interactive search bar with instant query execution and quick-access recent search chips.
   - `CurrentWeather.jsx`: Glassmorphism hero card displaying real-time temperature, condition icon, city, country, feels-like, and min/max temperatures.
   - `WeatherDetails.jsx`: Atmospheric metrics grid (Humidity, Wind Speed & Compass Direction, Pressure, Visibility, Sunrise, and Sunset).
   - `ForecastCard.jsx`: 5-day predictive forecast cards with day-of-week, weather icons, humidity, and temperature ranges.
   - `LoadingSkeleton.jsx` & `ErrorMessage.jsx`: Shimmer skeleton loading and friendly error banner with retry triggers.

3. **Dashboard Page Integration (`frontend/src/pages/DashboardPage.jsx`):**
   - Combined search, hero weather, atmospheric details, and forecast projections into a unified dashboard view.

---

### 3. File Inventory (Week 3)

| File Path | Description |
|---|---|
| `frontend/src/services/api.js` | Axios API service layer |
| `frontend/src/components/SearchBar.jsx` | City search bar with recent chips |
| `frontend/src/components/CurrentWeather.jsx` | Glassmorphic current weather card |
| `frontend/src/components/WeatherDetails.jsx` | 6-card atmospheric metrics grid |
| `frontend/src/components/ForecastCard.jsx` | 5-day forecast cards |
| `frontend/src/components/LoadingSkeleton.jsx` | Shimmer loading skeleton |
| `frontend/src/components/ErrorMessage.jsx` | Error alert card with retry action |
| `frontend/src/pages/DashboardPage.jsx` | Unified dashboard page view |
| `docs/weekly_logs/week3_log.md` | Formal Week 3 progress report |

---

### 4. Technical Concepts Applied

- **Component-Driven Architecture:** Breaking UI into modular, isolated, reusable React functional components.
- **Controlled Components:** Managing form state in React inputs.
- **Glassmorphism CSS:** Using `backdrop-filter: blur(16px)` and variable alpha borders.
- **Async Data Fetching:** Utilizing Promises with Axios to handle loading, success, and error states.

