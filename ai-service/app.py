import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.transcribe import router as transcribe_router
from routes.conversation import router as conversation_router


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="VOCO AI Service",
    description="AI service for VOCO Native Language Learning Platform",
    version="1.0.0"
)


# ============================================================
# CORS Configuration
# ============================================================

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_url
]

# Remove duplicate origins
allowed_origins = list(set(allowed_origins))


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Health Check
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "voco-ai"
    }


# ============================================================
# AI Routes
# ============================================================

app.include_router(transcribe_router)
app.include_router(conversation_router)


# ============================================================
# Application Information
# ============================================================

@app.get("/")
def root():
    return {
        "service": "VOCO AI Service",
        "status": "running",
        "docs": "/docs"
    }