
import logging
import os
import tempfile
import time
import wave
from contextlib import asynccontextmanager
from pathlib import Path
from threading import Lock

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from starlette.background import BackgroundTask
from piper import PiperVoice



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("voco-tts")

BASE_DIR = Path(__file__).resolve().parent

VOICES = {
    "en": BASE_DIR / "en_US-lessac-medium.onnx",
    "hi": BASE_DIR / "hi_IN-pratham-medium.onnx",
}

loaded_voices = {}
voice_locks = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    start = time.perf_counter()

    # Load both models once when the server starts.
    for language, model_path in VOICES.items():
        if not model_path.is_file():
            raise RuntimeError(
                f"Voice model not found: {model_path}"
            )

        load_start = time.perf_counter()

        loaded_voices[language] = PiperVoice.load(
            str(model_path)
        )
        voice_locks[language] = Lock()

        logger.info(
            "%s voice loaded in %.2f seconds",
            language,
            time.perf_counter() - load_start,
        )

    logger.info(
        "All voices loaded in %.2f seconds",
        time.perf_counter() - start,
    )

    yield

    loaded_voices.clear()
    voice_locks.clear()


app = FastAPI(lifespan=lifespan)

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


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    language: str = "en"


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "piper",
        "loaded_voices": list(loaded_voices.keys()),
    }


@app.post("/synthesize")
def synthesize(request: TTSRequest):
    language = request.language.strip().lower()
    text = request.text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty",
        )

    if language not in loaded_voices:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language: {language}",
        )

    output_path = None

    try:
        fd, output_path = tempfile.mkstemp(
            prefix="voco_tts_",
            suffix=".wav",
        )
        os.close(fd)

        start = time.perf_counter()

        # Reuse the voice loaded during server startup.
        with voice_locks[language]:
            with wave.open(output_path, "wb") as wav_file:
                loaded_voices[language].synthesize_wav(
                    text,
                    wav_file,
                )

        elapsed = time.perf_counter() - start

        logger.info(
            "Synthesis: language=%s, characters=%d, time=%.2f seconds",
            language,
            len(text),
            elapsed,
        )

        return FileResponse(
            path=output_path,
            media_type="audio/wav",
            filename="voco_response.wav",
            background=BackgroundTask(
                os.remove,
                output_path,
            ),
        )

    except HTTPException:
        raise

    except Exception as error:
        logger.exception("Piper synthesis failed")

        if output_path and os.path.exists(output_path):
            os.remove(output_path)

        raise HTTPException(
            status_code=500,
            detail="Speech synthesis failed",
        ) from error
