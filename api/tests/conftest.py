import os

os.environ.setdefault("JWT_SECRET", "test-secret-sufficiently-long-for-hs256-32b")
os.environ.setdefault("JWT_EXPIRATION_MINUTES", "60")
os.environ.setdefault("MONGODB_URL", "mongodb://localhost:27017")
os.environ.setdefault("MONGODB_DATABASE", "trenderdb_test")

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)
