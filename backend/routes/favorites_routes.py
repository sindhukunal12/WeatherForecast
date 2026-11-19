"""
Favorites API Routes Blueprint
CRUD endpoints for managing user's bookmarked favorite cities stored in SQLite.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import func
from backend.models import FavoriteCity
from backend.services.weather_service import WeatherService
from backend.database import db

favorites_bp = Blueprint("favorites", __name__, url_prefix="/api")


@favorites_bp.route("/favorites", methods=["GET"])
def get_favorites():
    """
    Retrieve all bookmarked cities.
    Optional query parameter: ?with_weather=true to attach live weather metrics.
    """
    try:
        favorites = FavoriteCity.query.order_by(FavoriteCity.created_at.desc()).all()
        with_weather = request.args.get("with_weather", "false").lower() == "true"
        units = request.args.get("units", "metric")

        results = []
        for fav in favorites:
            fav_dict = fav.to_dict()
            if with_weather:
                try:
                    w = WeatherService.get_current_weather(fav.city_name, units=units)
                    fav_dict["weather"] = {
                        "temperature": w["temperature"]["current"],
                        "feels_like": w["temperature"]["feels_like"],
                        "unit": w["temperature"]["unit"],
                        "condition": w["condition"]["main"],
                        "icon": w["condition"]["icon"],
                        "humidity": w["metrics"]["humidity"],
                        "wind_speed": w["metrics"]["wind_speed"],
                    }
                except Exception:
                    fav_dict["weather"] = None
            results.append(fav_dict)

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve favorites: {str(e)}", "status_code": 500}), 500


@favorites_bp.route("/favorites", methods=["POST"])
def add_favorite():
    """
    Add a new city to favorites.
    Payload: { "city_name": "...", "country": "...", "latitude": ..., "longitude": ... }
    """
    data = request.get_json(silent=True) or {}
    city_name = data.get("city_name", "").strip()

    if not city_name:
        return jsonify({"error": "city_name is required", "status_code": 400}), 400

    # Normalize city title
    city_clean = city_name.title()

    # Check for existing duplicate (case-insensitive)
    existing = FavoriteCity.query.filter(
        func.lower(FavoriteCity.city_name) == func.lower(city_clean)
    ).first()

    if existing:
        return jsonify(
            {
                "error": f"City '{city_clean}' is already in your favorites",
                "favorite": existing.to_dict(),
                "status_code": 409,
            }
        ), 409

    try:
        favorite = FavoriteCity(
            city_name=city_clean,
            country=data.get("country"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
        )
        db.session.add(favorite)
        db.session.commit()

        return jsonify(
            {
                "message": "City added to favorites successfully",
                "favorite": favorite.to_dict(),
            }
        ), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save favorite: {str(e)}", "status_code": 500}), 500


@favorites_bp.route("/favorites/<int:fav_id>", methods=["DELETE"])
def delete_favorite(fav_id):
    """
    Remove a city from favorites by ID.
    """
    favorite = db.session.get(FavoriteCity, fav_id)
    if not favorite:
        return jsonify({"error": f"Favorite with id {fav_id} not found", "status_code": 404}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite deleted successfully", "id": fav_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete favorite: {str(e)}", "status_code": 500}), 500
