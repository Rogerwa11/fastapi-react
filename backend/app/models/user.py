"""Modelos de domínio relacionados a usuários."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass(slots=True)
class User:
    id: str
    username: str
    hashed_password: str
    full_name: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
