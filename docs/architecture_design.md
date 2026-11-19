# System Architecture Design Document
## Project: Weather Forecast & Monitoring System
**Document Version:** 1.0.0  
**Phase:** Week 1 — Architecture Design  

---

### 1. High-Level System Architecture

The application adopts a **decoupled Client-Server Architecture** adhering to RESTful API conventions and strict separation of concerns. The frontend React Single-Page Application (SPA) acts as the presentation layer, while the Python Flask application serves as the API gateway, business logic orchestrator, and data access layer.

```mermaid
flowchart TD
    Client["React Frontend (SPA)<br/>Vite / React Context / React Router"]
    ReverseProxy["Vite Dev Server Proxy<br/>(:5173/api -> :5000/api)"]
    Backend["Flask REST API Server<br/>(:5000)"]
    ServiceLayer["Weather Service Layer<br/>(Input Validation, Sanitization, Caching)"]
    ExternalAPI["OpenWeatherMap API<br/>(External Meteorological Provider)"]
    Database[("SQLite Database<br/>SQLAlchemy ORM")]

    Client -->|HTTP / JSON Requests| ReverseProxy
    ReverseProxy -->|Forwarded Requests| Backend
    Backend -->|Routing & Controllers| ServiceLayer
    ServiceLayer -->|Secure HTTPS with API Key| ExternalAPI
    ExternalAPI -->|Raw Weather JSON| ServiceLayer
    ServiceLayer -->|Normalized Models| Backend
    Backend -->|CRUD Operations| Database
    Database -->|Persisted Entities| Backend
    Backend -->|Structured JSON Responses| Client
```

---

### 2. Layered Backend Architecture

The backend follows an industry-standard 4-tier modular pattern:

```mermaid
graph TD
    subgraph Presentation & Routing Tier
        A[Flask Blueprints / Routes]
    end
    subgraph Business Logic Tier
        B[Services: WeatherService, FavoritesService]
    end
    subgraph Data Access Tier
        C[SQLAlchemy Models: FavoriteCity, SearchHistory]
    end
    subgraph Persistence & External Tier
        D[SQLite Database Engine]
        E[OpenWeatherMap REST API]
    end

    A --> B
    B --> C
    B --> E
    C --> D
```

1. **Routing Tier (`backend/routes/`):**
   - Parses HTTP requests, URL parameters, query strings, and JSON request bodies.
   - Enforces preliminary validation and invokes corresponding services.
   - Serializes responses into standard JSON envelopes with explicit HTTP status codes (200, 201, 400, 404, 500).

2. **Service Tier (`backend/services/`):**
   - Implements business logic and data aggregation.
   - Interfaces with the external OpenWeatherMap endpoints using Python `requests` with configured request timeouts.
   - Transforms raw external API payloads into sanitized, normalized dictionaries tailored for the frontend.

3. **Data Access / ORM Tier (`backend/models/` & `backend/database/`):**
   - Defines declarative SQLAlchemy models (`FavoriteCity`, `SearchHistory`).
   - Encapsulates database transactions, preventing raw SQL injection vulnerabilities.
   - Provides serialization methods (`to_dict()`) for clean decoupling from the presentation layer.

4. **Configuration Tier (`backend/config.py`):**
   - Centralizes environment variable extraction (`python-dotenv`).
   - Segregates settings into `DevelopmentConfig`, `TestingConfig`, and `ProductionConfig`.

---

### 3. Frontend Architecture

The frontend is constructed using a modern React component-tree hierarchy:

```mermaid
graph TD
    App[App.jsx]
    WeatherProvider[WeatherContext Provider<br/>Global State: Units, Active City, Cache]
    ThemeProvider[ThemeContext Provider<br/>Dark / Light Theme Tokens]
    Router[React Router DOM]

    Navbar[Navbar Component]
    Sidebar[Sidebar Navigation]
    
    DashboardPage[Dashboard Page]
    CityDetailsPage[City Details Page]
    FavoritesPage[Favorites Page]
    HistoryPage[Search History Page]
    SettingsPage[Settings Page]

    App --> ThemeProvider
    ThemeProvider --> WeatherProvider
    WeatherProvider --> Router
    Router --> Navbar
    Router --> Sidebar
    Router --> DashboardPage
    Router --> CityDetailsPage
    Router --> FavoritesPage
    Router --> HistoryPage
    Router --> SettingsPage
```

---

### 4. Security & Credential Protection Model

1. **Zero Secret Leakage:** The OpenWeatherMap API key is stored exclusively in `backend/.env`. It is loaded server-side into Python memory and injected into upstream outbound HTTPS requests. It is never transmitted across the browser boundary or bundled into JavaScript client code.
2. **CORS Governance:** `flask-cors` is configured to only whitelist trusted frontend origins (`http://localhost:5173` and `http://127.0.0.1:5173`), preventing unauthorized cross-origin abuse.
3. **Parameterized SQL Queries:** SQLAlchemy ORM compiles queries using parameterized statements, neutralizing SQL injection vectors.
4. **Input Sanitization:** User-supplied city queries are stripped of control characters, leading/trailing whitespaces, and validated against character-length limits prior to upstream dispatch.

