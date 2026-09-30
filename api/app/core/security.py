import os
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher

ALGORITHM = "HS256"
EXPIRATION_MINUTES = int(os.environ["JWT_EXPIRATION_MINUTES"])
SECRET = os.environ["JWT_SECRET"]

_hasher = PasswordHash((BcryptHasher(),))
_scheme = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    return _hasher.hash(password)

def verify_password(password: str, hash_saved: str) -> bool:
    return _hasher.verify(password, hash_saved)

def create_token(user_id: str) -> str:
    payload: dict[str, Any] = {
        "sub": user_id,
        "exp": datetime.now(UTC) + timedelta(minutes=EXPIRATION_MINUTES),
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)

def invalid_credentials() -> HTTPException:
    return HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        "Invalid Token or expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

def actual_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_scheme),
) -> ObjectId:
    if credentials is None:
        raise invalid_credentials()
    try:
        payload = jwt.decode(credentials.credentials, SECRET, algorithms=[ALGORITHM])
        return ObjectId(payload["sub"])
    except (jwt.InvalidTokenError, KeyError) as exc:
        raise invalid_credentials() from exc
