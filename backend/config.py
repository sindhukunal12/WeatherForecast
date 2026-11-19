"""
Application Configuration Module
Defines configuration environments for development, testing, and production.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory for the backend package
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env file if present
load_dotenv(BASE_DIR / ".env")


class Config:
    """Base configuration with shared default parameters."""
    SECRET_KEY = os.getenv("SECRET_KEY", "default-dev-secret-key-change-in-prod")
    DEBUG = False
    TESTING = False

    # Database Settings
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEFAULT_DB_PATH = BASE_DIR / "database" / "weather.db"
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}"
    )

    # OpenWeatherMap API Settings
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
    OPENWEATHER_BASE_URL = os.getenv(
        "OPENWEATHER_BASE_URL", "https://api.openweathermap.org/data/2.5"
    )
    OPENWEATHER_TIMEOUT_SECONDS = int(os.getenv("OPENWEATHER_TIMEOUT", "10"))

    # CORS Settings
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]


class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True


class TestingConfig(Config):
    """Testing environment configuration using an in-memory SQLite database."""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    OPENWEATHER_API_KEY = "test_api_key"


class ProductionConfig(Config):
    """Production environment configuration with strict checks."""
    DEBUG = False
    TESTING = False


# Environment configuration mapping
config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


def get_config():
    """Retrieve configuration based on FLASK_ENV environment variable."""
    env_name = os.getenv("FLASK_ENV", "development").lower()
    return config_by_name.get(env_name, DevelopmentConfig)
