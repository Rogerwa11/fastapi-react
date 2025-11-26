'''Configurações do projeto'''

import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    secret_key: str = os.getenv("SECRET_KEY", "megakey-super-secret")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    data_file: str = "data/users.json"

settings = Settings()
