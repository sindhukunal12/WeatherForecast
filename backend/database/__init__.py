"""
Database initialization package for SQLAlchemy ORM.
"""

from flask_sqlalchemy import SQLAlchemy

# Global SQLAlchemy database instance
db = SQLAlchemy()


def init_db(app):
    """
    Initialize SQLAlchemy with the Flask application context.
    Creates all defined database tables automatically if they do not exist.
    """
    db.init_app(app)
    with app.app_context():
        # Import models inside context to ensure they are registered with SQLAlchemy
        from backend.models import FavoriteCity, SearchHistory  # noqa: F401
        db.create_all()
