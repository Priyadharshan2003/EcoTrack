import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoTrack API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment Variables
    GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")
    SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")
    
    class Config:
        case_sensitive = True

settings = Settings()
