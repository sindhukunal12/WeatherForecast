"""
Search History API Routes Blueprint
Endpoints for tracking, retrieving, and clearing searched cities stored in SQLite.
"""

from flask import Blueprint, jsonify, request
from backend.models import SearchHistory
from backend.database import db

history_bp = Blueprint("history", __name__, url_prefix="/api")


@history_bp.route("/history", methods=["GET"])
def get_history():
    """
    Retrieve search history ordered by most recent searches.
    Query parameters:
      - limit: int (default 15)
      - distinct: bool (default true) - return unique city names with latest timestamp
    """
    try:
        limit = min(int(request.args.get("limit", 15)), 50)
        distinct = request.args.get("distinct", "true").lower() == "true"

        if distinct:
            # Query most recent searches, deduplicating by city name
            all_entries = SearchHistory.query.order_by(SearchHistory.searched_at.desc()).all()
            seen_cities = set()
            distinct_list = []
            for entry in all_entries:
                low_city = entry.city_name.lower()
                if low_city not in seen_cities:
                    seen_cities.add(low_city)
                    distinct_list.append(entry.to_dict())
                if len(distinct_list) >= limit:
                    break
            return jsonify(distinct_list), 200
        else:
            entries = SearchHistory.query.order_by(
                SearchHistory.searched_at.desc()
            ).limit(limit).all()
            return jsonify([e.to_dict() for e in entries]), 200

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve history: {str(e)}", "status_code": 500}), 500


@history_bp.route("/history", methods=["POST"])
def add_history():
    """
    Log a new city search event.
    Payload: { "city_name": "..." }
    """
    data = request.get_json(silent=True) or {}
    city_name = data.get("city_name", "").strip()

    if not city_name:
        return jsonify({"error": "city_name is required", "status_code": 400}), 400

    try:
        entry = SearchHistory(city_name=city_name.title())
        db.session.add(entry)
        db.session.commit()
        return jsonify({"message": "Search logged successfully", "history": entry.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to log search: {str(e)}", "status_code": 500}), 500


@history_bp.route("/history", methods=["DELETE"])
def clear_history():
    """
    Clear all search history records.
    """
    try:
        SearchHistory.query.delete()
        db.session.commit()
        return jsonify({"message": "Search history cleared successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to clear history: {str(e)}", "status_code": 500}), 500

