# Internship Weekly Progress Log — Week 4
## Weather Forecast & Monitoring System
**Period:** Week 4 of 6  
**Status:** Completed & Verified  

---

### 1. Executive Summary & Objective

The objective of Week 4 was **SQLite Integration, Favorites Management, Search History Tracking, and React Context State Architecture**. This milestone focused on full-stack CRUD capabilities, database persistence across application restarts, and multi-page routing via React Router DOM.

---

### 2. Completed Milestones & Activities

1. **Backend Persistence & CRUD Endpoints:**
   - Implemented `backend/routes/favorites_routes.py`:
     - `GET /api/favorites` (supporting `with_weather=true` for live temperature enrichment)
     - `POST /api/favorites` (with duplicate detection returning HTTP 409)
     - `DELETE /api/favorites/<id>` (with 404 verification)
   - Implemented `backend/routes/history_routes.py`:
     - `GET /api/history` (distinct recent searches ordered by UTC timestamp)
     - `POST /api/history`
     - `DELETE /api/history` (clear history audit log)
   - Verified with Pytest integration tests: `test_favorites.py` and `test_history.py`.

2. **React Global State Management (`WeatherContext.jsx`):**
   - Implemented Context API managing `activeCity`, `currentWeather`, `forecast`, `favorites`, `history`, `units`, and `loading`.
   - Connected actions: `addFavorite`, `removeFavorite`, `isCityFavorite`, `clearHistory`, and `toggleUnits`.

3. **Multi-Page Routing & Dedicated Views:**
   - `FavoritesPage.jsx`: Card grid of saved cities with live temperature badges and one-click removal.
   - `HistoryPage.jsx`: Chronological search log with one-click re-search and clear action.
   - `CityDetailsPage.jsx`: In-depth analytical view featuring coordinates and 3-hour interval slices.
   - `Sidebar.jsx`: Accessible navigation bar with live badge counts.

---

### 3. File Inventory (Week 4)

| File Path | Description |
|---|---|
| `backend/routes/favorites_routes.py` | Favorites CRUD REST API routes |
| `backend/routes/history_routes.py` | Search history REST API routes |
| `backend/tests/test_favorites.py` | Favorites lifecycle test suite |
| `backend/tests/test_history.py` | Search history test suite |
| `frontend/src/context/WeatherContext.jsx` | Global state management via Context API |
| `frontend/src/components/FavoriteCard.jsx` | Bookmarked city card component |
| `frontend/src/components/Sidebar.jsx` | Multi-view navigation sidebar |
| `frontend/src/pages/FavoritesPage.jsx` | Bookmarked cities management view |
| `frontend/src/pages/HistoryPage.jsx` | Search history audit view |
| `frontend/src/pages/CityDetailsPage.jsx` | Detailed meteorological analysis view |
| `docs/weekly_logs/week4_log.md` | Formal Week 4 progress report |

---

### 4. Technical Concepts Applied

- **ACID Relational Persistence:** Using SQLAlchemy ORM transactions (`commit()`, `rollback()`) to guarantee data integrity.
- **Context API State Distribution:** Eliminates prop-drilling by sharing weather and favorites state across all routed pages.
- **Client-Side Routing:** Seamless single-page transitions using React Router DOM (`NavLink`, `Routes`, `Route`).
- **RESTful Idempotency & Status Codes:** Returning 201 for resource creation, 409 for conflicts, and 404 for missing entities.
