"""
Data models module using SQLAlchemy ORM.
Defines schemas for Favorite cities and Search history.
"""

from datetime import datetime, timezone
from backend.database import db


class FavoriteCity(db.Model):
    """
    FavoriteCity Model
    Stores user's saved favorite cities for quick weather access.
    """
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    city_name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(10), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def to_dict(self):
        """Serialize model instance to dictionary for JSON response."""
        return {
            "id": self.id,
            "city_name": self.city_name,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<FavoriteCity id={self.id} city_name='{self.city_name}' country='{self.country}'>"


class SearchHistory(db.Model):
    """
    SearchHistory Model
    Tracks previously searched cities with chronological timestamps.
    """
    __tablename__ = "search_history"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    city_name = db.Column(db.String(100), nullable=False)
    searched_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def to_dict(self):
        """Serialize model instance to dictionary for JSON response."""
        return {
            "id": self.id,
            "city_name": self.city_name,
            "searched_at": self.searched_at.isoformat() if self.searched_at else None,
        }

    def __repr__(self):
        return f"<SearchHistory id={self.id} city_name='{self.city_name}' searched_at='{self.searched_at}'>"

