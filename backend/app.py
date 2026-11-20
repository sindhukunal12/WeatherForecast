"""
Flask Application Entry Point and Application Factory.
Provides the create_app factory pattern, blueprint registrations,
CORS initialization, and health endpoint.
"""

import os
import sys
from pathlib import Path

# Ensure workspace root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from backend.config import get_config
from backend.database import init_db
from backend.routes.weather_routes import weather_bp
from backend.routes.favorites_routes import favorites_bp
from backend.routes.history_routes import history_bp


def create_app(config_class=None):
    """
    Application factory pattern to configure and create Flask app instance.
    """
    app = Flask(__name__)

    if config_class is None:
        config_class = get_config()

    app.config.from_object(config_class)

    # Initialize CORS for cross-origin communication with React frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # Initialize SQLAlchemy database and create tables
    init_db(app)

    # Register API Blueprints
    app.register_blueprint(weather_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(history_bp)

    # Base Health Check Endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Health check endpoint to verify backend status and configuration."""
        return jsonify(
            {
                "status": "healthy",
                "service": "Weather Forecast & Monitoring System API",
                "version": "1.0.0",
                "environment": app.config.get("ENV", "development"),
                "database": "connected",
                "api_key_configured": bool(
                    app.config.get("OPENWEATHER_API_KEY")
                    and app.config.get("OPENWEATHER_API_KEY")
                    != "your_openweathermap_api_key_here"
                ),
            }
        ), 200

    # Production Frontend Static Build Serving (Vite SPA)
    frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
    if frontend_dist.exists():
        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            if path and (frontend_dist / path).exists():
                return send_from_directory(frontend_dist, path)
            return send_from_directory(frontend_dist, "index.html")
    else:
        @app.route("/")
        def index():
            return jsonify(
                {
                    "message": "Weather Forecast & Monitoring API is operational.",
                    "health_endpoint": "/api/health",
                    "docs": "Run frontend development server or build frontend via 'npm run build'",
                }
            )

    # Global Error Handlers
    @app.errorhandler(404)
    def handle_not_found(error):
        if frontend_dist.exists() and not request.path.startswith("/api/"):
            return send_from_directory(frontend_dist, "index.html")
        return jsonify({"error": "Resource not found", "status_code": 404}), 404

    @app.errorhandler(500)
    def handle_internal_error(error):
        return (
            jsonify(
                {
                    "error": "Internal server error occurred",
                    "status_code": 500,
                }
            ),
            500,
        )

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    debug = app.config.get("DEBUG", True)
    print(f"🚀 Starting Weather Forecast API server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
