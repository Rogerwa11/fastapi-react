"""Testes básicos da API de autenticação."""

from datetime import timedelta

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database import replace_users
from backend.app.services.token_service import (
    InvalidTokenError,
    create_access_token,
    decode_token,
)

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_storage():
    replace_users([])
    yield
    replace_users([])


def register_user(username: str, password: str, full_name: str | None = None) -> None:
    payload = {"username": username, "password": password}
    if full_name:
        payload["full_name"] = full_name
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201


def test_register_user_success():
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "secret123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "alice"
    assert "id" in data


def test_register_duplicate_user_fails():
    register_user("alice", "secret123")
    response = client.post(
        "/auth/register", json={"username": "alice", "password": "secret123"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Nome de usuário já cadastrado."


def test_register_with_long_password_succeeds():
    long_password = "a" * 200
    response = client.post(
        "/auth/register", json={"username": "alice", "password": long_password}
    )
    assert response.status_code == 201
    login_response = client.post(
        "/auth/login",
        data={"username": "alice", "password": long_password},
        headers={"Content-Type": "application/json"},
    )
    assert login_response.status_code == 200


def test_login_returns_token():
    register_user("alice", "secret123")
    response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "secret123"},
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials():
    register_user("alice", "secret123")
    response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "wrongpass"},
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 401


def test_me_endpoint_returns_user():
    register_user("alice", "secret123")
    login_response = client.post(
        "/auth/login",
        data={"username": "alice", "password": "secret123"},
        headers={"Content-Type": "application/json"},
    )
    token = login_response.json()["access_token"]

    me_response = client.get(
        "/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    data = me_response.json()
    assert data["username"] == "alice"


def test_expired_token_raises_error():
    token = create_access_token("pre-expired", expires_delta=timedelta(seconds=-1))
    with pytest.raises(InvalidTokenError):
        decode_token(token)

