"""Rotas de autenticação."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from ..schemas import Token, UserCreate, UserLogin, UserPublic
from ..services import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    create_login_token,
    get_user_from_token,
    register_user,
)


router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar novo usuário",
)
async def register(payload: UserCreate) -> UserPublic:
    try:
        return register_user(payload)
    except UserAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Autenticar usuário e retornar token",
)
async def login(payload: UserLogin) -> Token:
    try:
        return create_login_token(payload)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


@router.get(
    "/me",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Retornar usuário autenticado",
)
async def read_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
    try:
        user = get_user_from_token(token)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    return UserPublic.model_validate(user)
