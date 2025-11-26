"""Serviço de autenticação e registro de usuários."""

from __future__ import annotations

from datetime import datetime
from typing import Dict
from uuid import uuid4

from passlib.context import CryptContext

from ..database import find_user_by_id, find_user_by_username, list_users, replace_users, save_user
from ..models import User
from ..schemas import Token, UserCreate, UserLogin, UserPublic
from .token_service import InvalidTokenError, create_access_token, decode_token

pwd_context = CryptContext(
    schemes=["argon2", "bcrypt_sha256"],
    deprecated=["bcrypt_sha256"],
)


class UserAlreadyExistsError(Exception):
    """Erro para indicar tentativa de registro de usuário já existente."""


class InvalidCredentialsError(Exception):
    """Erro retornado quando usuário ou senha estão incorretos."""


def _serialize_user(user: User) -> Dict[str, str]:
    return {
        "id": user.id,
        "username": user.username,
        "hashed_password": user.hashed_password,
        "full_name": user.full_name,
        "created_at": user.created_at.isoformat(),
    }


def _deserialize_user(data: Dict[str, str]) -> User:
    return User(
        id=data["id"],
        username=data["username"],
        hashed_password=data["hashed_password"],
        full_name=data.get("full_name"),
        created_at=datetime.fromisoformat(data["created_at"]) if data.get("created_at") else datetime.utcnow(),
    )


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def register_user(payload: UserCreate) -> UserPublic:
    if find_user_by_username(payload.username):
        raise UserAlreadyExistsError("Nome de usuário já cadastrado.")

    hashed = hash_password(payload.password)

    user = User(
        id=str(uuid4()),
        username=payload.username,
        hashed_password=hashed,
        full_name=payload.full_name,
    )
    save_user(_serialize_user(user))
    return UserPublic.model_validate(user)


def authenticate_user(payload: UserLogin) -> User:
    stored = find_user_by_username(payload.username)
    if not stored:
        raise InvalidCredentialsError("Credenciais inválidas.")

    user = _deserialize_user(stored)
    if not verify_password(payload.password, user.hashed_password):
        raise InvalidCredentialsError("Credenciais inválidas.")

    return user


def create_login_token(payload: UserLogin) -> Token:
    user = authenticate_user(payload)
    token = create_access_token(user.id)
    return Token(access_token=token)


def get_user_from_token(token: str) -> User:
    try:
        token_payload = decode_token(token)
    except InvalidTokenError as exc:
        raise InvalidCredentialsError(str(exc)) from exc

    stored = find_user_by_id(token_payload.sub)
    if not stored:
        raise InvalidCredentialsError("Usuário não encontrado.")
    return _deserialize_user(stored)


def delete_user(username: str) -> None:
    """Remove um usuário do arquivo JSON (auxiliar para testes)."""
    users = [user for user in list_users() if user.get("username") != username]
    replace_users(users)
