from fastapi import FastAPI, UploadFile, File, Form
from faster_whisper import WhisperModel
import tempfile
import os

app = FastAPI()

MODEL_SIZE = "tiny"

model = WhisperModel(
    MODEL_SIZE,
    device="cpu",
    compute_type="int8"
)


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "faster-whisper",
        "model": MODEL_SIZE
    }


@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form("en")
):
    temp_path = None

    try:
        suffix = os.path.splitext(audio.filename or ".webm")[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_path = temp_file.name

            content = await audio.read()
            temp_file.write(content)

        segments, info = model.transcribe(
            temp_path,
            language=language,
            beam_size=1,
            vad_filter=True
        )

        text = " ".join(
            segment.text.strip()
            for segment in segments
        ).strip()

        return {
            "success": True,
            "text": text,
            "language": info.language
        }

    except Exception as error:

        print("STT Error:", error)

        return {
            "success": False,
            "message": str(error)
        }

    finally:

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)