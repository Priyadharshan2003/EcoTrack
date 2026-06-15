from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api import routes

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# CORS configuration for Expo frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"status": "ok", "message": "EcoTrack API is running."}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "ai_status": "configured" if settings.GEMINI_API_KEY else "unconfigured"}
