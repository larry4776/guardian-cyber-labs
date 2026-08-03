import os

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h

settings = Settings()