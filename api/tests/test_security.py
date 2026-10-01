import jwt
import pytest
from bson import ObjectId
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.core.security import (
    ALGORITHM,
    SECRET,
    actual_user,
    create_token,
    hash_password,
    verify_password,
)


def credentials(token: str) -> HTTPAuthorizationCredentials:
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)


def test_hash_password_does_not_store_plaintext():
    hashed = hash_password("secreta123")
    assert hashed != "secreta123"
    assert "secreta123" not in hashed


def test_hash_password_verifies_correct_password():
    hashed = hash_password("secreta123")
    assert verify_password("secreta123", hashed) is True


def test_verify_password_rejects_wrong_password():
    hashed = hash_password("secreta123")
    assert verify_password("otra-password", hashed) is False


def test_create_token_generates_valid_jwt():
    user_id = str(ObjectId())
    token = create_token(user_id)
    payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
    assert payload["sub"] == user_id
    assert "exp" in payload
    assert "iat" in payload


def test_actual_user_with_valid_token_returns_object_id():
    user_id = ObjectId()
    token = create_token(str(user_id))
    assert actual_user(credentials(token)) == user_id


def test_actual_user_without_token_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        actual_user(None)
    assert exc_info.value.status_code == 401
    assert exc_info.value.headers == {"WWW-Authenticate": "Bearer"}


def test_actual_user_with_garbage_token_raises_401():
    with pytest.raises(HTTPException) as exc_info:
        actual_user(credentials("token-basura"))
    assert exc_info.value.status_code == 401


def test_actual_user_with_token_signed_with_other_secret_raises_401():
    other = jwt.encode(
        {"sub": str(ObjectId())},
        "another-secret-sufficiently-long-32b",
        algorithm=ALGORITHM,
    )
    with pytest.raises(HTTPException) as exc_info:
        actual_user(credentials(other))
    assert exc_info.value.status_code == 401


def test_actual_user_with_token_without_sub_raises_401():
    token = jwt.encode({"exp": 9999999999}, SECRET, algorithm=ALGORITHM)
    with pytest.raises(HTTPException) as exc_info:
        actual_user(credentials(token))
    assert exc_info.value.status_code == 401
