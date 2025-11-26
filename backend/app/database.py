"""Utilitários para persistência simples em arquivo JSON."""

from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional

from .config import settings

_storage_lock = Lock()


def _resolve_data_path() -> Path:
    base_dir = Path(__file__).resolve().parent
    return (base_dir / settings.data_file).resolve()


DATA_PATH = _resolve_data_path()
DATA_PATH.parent.mkdir(parents=True, exist_ok=True)

if not DATA_PATH.exists():
    DATA_PATH.write_text(json.dumps({"users": []}), encoding="utf-8")


def _read_storage() -> Dict[str, Any]:
    with _storage_lock:
        if not DATA_PATH.exists():
            return {"users": []}
        raw = DATA_PATH.read_text(encoding="utf-8")
        if not raw.strip():
            return {"users": []}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"users": []}


def _write_storage(data: Dict[str, Any]) -> None:
    with _storage_lock:
        DATA_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")


def list_users() -> List[Dict[str, Any]]:
    storage = _read_storage()
    return storage.get("users", [])


def find_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    return next((user for user in list_users() if user.get("username") == username), None)


def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return next((user for user in list_users() if user.get("id") == user_id), None)


def save_user(user: Dict[str, Any]) -> None:
    storage = _read_storage()
    users = storage.get("users", [])
    users.append(user)
    storage["users"] = users
    _write_storage(storage)


def replace_users(users: List[Dict[str, Any]]) -> None:
    _write_storage({"users": users})
