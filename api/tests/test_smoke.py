import pytest


def test_root_responds_ok(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"app": "TRender API", "version": "2.0.0"}


def test_docs_are_enabled(client):
    assert client.get("/openapi.json").status_code == 200


@pytest.mark.parametrize(
    "path",
    [
        "/courses",
        "/courses/active",
        "/sales",
        "/sales/sequence",
        "/subjects",
        "/roles",
        "/users",
        "/auth/me",
    ],
)
def test_protected_routes_without_token_return_401(client, path):
    assert client.get(path).status_code == 401


def test_unknown_route_returns_404(client):
    assert client.get("/does-not-exist").status_code == 404


def test_login_with_invalid_body_returns_422(client):
    response = client.post("/auth/login", json={"email": "not-an-email"})
    assert response.status_code == 422


def test_register_with_short_password_returns_422(client):
    response = client.post(
        "/auth/register",
        json={"name": "Ana Perez", "email": "ana@ejemplo.com", "password": "123"},
    )
    assert response.status_code == 422


def test_create_course_without_token_returns_401(client):
    response = client.post(
        "/courses",
        json={
            "course": "React from scratch",
            "subject": "Web",
            "instructor": "Fabian",
            "cost": 150000,
            "status": "Activo",
        },
    )
    assert response.status_code == 401
