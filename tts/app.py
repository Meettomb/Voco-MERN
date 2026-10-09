from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

import subprocess
import tempfile
import os
import uuid
import sys


app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


VOICES = {
    "en": os.path.join(
        BASE_DIR,
        "en_US-lessac-medium.onnx"
    ),
    "hi": os.path.join(
        BASE_DIR,
        "hi_IN-pratham-medium.onnx"
    )
}


class TTSRequest(BaseModel):
    text: str
    language: str = "en"


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "piper"
    }


@app.post("/synthesize")
def synthesize(request: TTSRequest):

    language = request.language

    model = VOICES.get(language)

    if not model:
        return {
            "success": False,
            "message": f"Unsupported language: {language}"
        }

    if not os.path.exists(model):
        return {
            "success": False,
            "message": f"Piper model not found: {model}"
        }

    output_file = os.path.join(
        tempfile.gettempdir(),
        f"voco_tts_{uuid.uuid4().hex}.wav"
    )

    try:

        command = [
            sys.executable,
            "-m",
            "piper",
            "-m",
            model,
            "-f",
            output_file
        ]

        env = os.environ.copy()

        # Force UTF-8 for Piper on Windows
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"

        subprocess.run(
            command,
            input=request.text,
            text=True,
            encoding="utf-8",
            check=True,
            env=env
        )

        return FileResponse(
            output_file,
            media_type="audio/wav",
            filename="voco_response.wav"
        )

    except Exception as error:

        print("Piper error:", error)

        return {
            "success": False,
            "message": str(error)
        }