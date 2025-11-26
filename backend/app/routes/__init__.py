"""Exporta routers da aplicação."""

from .auth import router as auth_router

__all__ = ["auth_router"]
