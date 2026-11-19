"""
Weather API Routes Blueprint
Exposes endpoints for current weather observation and 5-day predictive forecasts.
"""

from flask import Blueprint, jsonify, request
from backend.services.weather_service import WeatherService
from backend.models import SearchHistory
from backend.database import db

weather_bp = Blueprint("weather", __name__, url_prefix="/api")


@weather_bp.route("/weather/<string:city>", methods=["GET"])
def get_weather(city):
    """
    Retrieve real-time weather metrics for a specified city.
    Automatically logs search query to SearchHistory table in SQLite.
    """
    units = request.args.get("units", "metric")
    if units not in ["metric", "imperial"]:
        units = "metric"

    try:
        data = WeatherService.get_current_weather(city, units=units)

        # Automatically log valid search event into SQLite
        try:
            history_entry = SearchHistory(city_name=data.get("city", city.strip().title()))
            db.session.add(history_entry)
            db.session.commit()
        except Exception:
            db.session.rollback()

        return jsonify(data), 200

    except ValueError as e:
        return jsonify({"error": str(e), "status_code": 400}), 400
    except LookupError as e:
        return jsonify({"error": str(e), "status_code": 404}), 404
    except TimeoutError as e:
        return jsonify({"error": str(e), "status_code": 504}), 504
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve weather: {str(e)}", "status_code": 500}), 500


@weather_bp.route("/forecast/<string:city>", methods=["GET"])
def get_forecast(city):
    """
    Retrieve 5-day predictive forecast with daily summaries and 3-hour slices.
    """
    units = request.args.get("units", "metric")
    if units not in ["metric", "imperial"]:
        units = "metric"

    try:
        data = WeatherService.get_forecast(city, units=units)
        return jsonify(data), 200

    except ValueError as e:
        return jsonify({"error": str(e), "status_code": 400}), 400
    except LookupError as e:
        return jsonify({"error": str(e), "status_code": 404}), 404
    except TimeoutError as e:
        return jsonify({"error": str(e), "status_code": 504}), 504
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve forecast: {str(e)}", "status_code": 500}), 500

