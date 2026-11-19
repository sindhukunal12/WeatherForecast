"""
Pytest Fixtures and Test Environment Setup.
Initializes an in-memory SQLite database for isolated test execution.
"""

import pytest
from backend.app import create_app
from backend.config import TestingConfig
from backend.database import db


@pytest.fixture(scope="session")
def app():
    """Create and configure a Flask application instance for testing."""
    test_app = create_app(TestingConfig)
    return test_app


@pytest.fixture(scope="function")
def client(app):
    """Provide a test client with freshly initialized database tables per test."""
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()
