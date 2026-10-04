from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.transcribe import router as transcribe_router
from routes.conversation import router as conversation_router

app = FastAPI(title="VOCO AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "voco-ai"
    }

app.include_router(transcribe_router)
app.include_router(conversation_router)