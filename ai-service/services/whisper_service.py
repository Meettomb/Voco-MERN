from faster_whisper import WhisperModel


class WhisperService:
    def __init__(self):
        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, audio_path: str):
        segments, info = self.model.transcribe(audio_path)

        text = " ".join(segment.text.strip() for segment in segments)

        return {
            "text": text,
            "language": info.language
        }


whisper_service = WhisperService()