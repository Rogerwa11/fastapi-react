"""Serviço responsável por criar e validar tokens JWT."""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from ..config import settings
from ..schemas import TokenPayload


class InvalidTokenError(Exception):
    """Erro disparado quando um token não é válido."""


def _ensure_secret_key() -> str:
    if not settings.secret_key:
        raise RuntimeError("SECRET_KEY não configurada.")
    return settings.secret_key


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    secret_key = _ensure_secret_key()
    expire_delta = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.now(timezone.utc) + expire_delta

    payload = {"exp": expire, "sub": subject}
    return jwt.encode(payload, secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> TokenPayload:
    secret_key = _ensure_secret_key()
    try:
        payload = jwt.decode(token, secret_key, algorithms=[settings.algorithm])
        return TokenPayload(**payload)
    except (JWTError, ValueError) as exc:
        raise InvalidTokenError("Token inválido ou expirado.") from exc

