import os
import tempfile

from fastapi import APIRouter, UploadFile, File

from services.whisper_service import whisper_service


router = APIRouter()


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[1] or ".wav"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        result = whisper_service.transcribe(temp_path)
        return result

    finally:
        os.remove(temp_path)