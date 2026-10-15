# VOCO — AI Services Setup

This file contains the setup steps for the local AI services used by VOCO.

## AI Service Architecture

VOCO uses three local AI services:

```text
React
  |
  v
Node / Express
  |
  +----> Ollama + Qwen3 1.7B
  |
  +----> Faster-Whisper STT
  |
  +----> Piper TTS
```

Voice conversation:

```text
Microphone
    ↓
Faster-Whisper
    ↓
Transcript
    ↓
Qwen3 1.7B / Ollama
    ↓
AI response
    ↓
Piper TTS
    ↓
WAV audio
    ↓
Browser
```

---

# 1. Prerequisites

Install:

- Node.js
- Python
- Ollama

Check Node.js:

```bash
node --version
npm --version
```

Check Python:

```bash
python --version
```

---

# 2. Ollama — AI Model

VOCO uses Ollama to run Qwen3 locally.

## Start Ollama

Open a terminal and run:

```bash
set OLLAMA_IGPU_ENABLE=1
ollama serve
```

The Ollama service should be available at:

```text
127.0.0.1:11434
```

## Download Qwen3

If Qwen3 1.7B has not already been downloaded:

```bash
ollama pull qwen3:1.7b
```

Check installed models:

```bash
ollama list
```

You should see:

```text
qwen3:1.7b
```

Keep Ollama running while using VOCO AI.

---

# 3. Faster-Whisper — Speech-to-Text

Faster-Whisper converts the user's microphone audio into text.

## Go to STT directory

From the VOCO project root:

```bash
cd stt
```

## Create Python virtual environment

```bash
python -m venv venv
```

## Activate virtual environment

Windows:

```powershell
venv\Scripts\activate
```

You should see `(venv)` in the terminal.

## Install dependencies

The STT dependencies are stored in `requirements.txt`.

```bash
pip install -r requirements.txt
```

If the environment has the PyAV compatibility problem encountered during setup, use:

```bash
pip install av==18.1.0
```

## Start STT service

```bash
uvicorn app:app --host 127.0.0.1 --port 8001
```

The STT service runs at:

```text
127.0.0.1:8001
```

## Test STT service

Open:

```text
http://127.0.0.1:8001/health
```

A successful service should return a health response indicating that Faster-Whisper is running.

Keep this terminal running while using VOCO voice input.

---

# 4. Piper — Text-to-Speech

Piper converts the AI response text into speech.

## Go to TTS directory

From the VOCO project root:

```bash
cd tts
```

## Create Python virtual environment

```bash
python -m venv venv
```

## Activate virtual environment

Windows:

```powershell
venv\Scripts\activate
```

## Upgrade pip

```bash
python -m pip install --upgrade pip
```

## Install Piper

```bash
pip install piper-tts
```

---

# 5. Download English Piper Voice

Download the English voice into the Piper/TTS directory:

```bash
python -m piper.download_voices en_US-lessac-medium
```

This should provide the English voice model files in the `tts` directory.

## Test English Piper

Run:

```bash
echo Hello! Welcome to VOCO. Let's practice English together. | python -m piper -m en_US-lessac-medium.onnx -f test.wav
```

This should create:

```text
test.wav
```

Open the file and verify that you can hear the English speech.

---

# 6. Download Hindi Piper Voice

Download the Hindi voice into the Piper/TTS directory:

```bash
python -m piper.download_voices hi_IN-pratham-medium
```

## Test Hindi Piper

Run:

```bash
python -m piper -m hi_IN-pratham-medium -f hindi_test.wav -- "नमस्ते! आपका स्वागत है। आज हम हिंदी में बातचीत करेंगे।"
```

This should create:

```text
hindi_test.wav
```

Open the file and verify that you can hear the Hindi speech.

---

# 7. Install Piper API Dependencies

With the TTS `venv` activated:

```bash
python -m pip install fastapi uvicorn
```

The Piper FastAPI server is used by the React application to request generated audio.

---

# 8. Start Piper TTS Service

From the `tts` directory:

```bash
uvicorn app:app --host 127.0.0.1 --port 8002
```

The TTS service runs at:

```text
127.0.0.1:8002
```

## Test TTS service

Open:

```text
http://127.0.0.1:8002/health
```

A successful response should be similar to:

```json
{
  "success": true,
  "service": "piper"
}
```

Keep this terminal running while using VOCO AI voice responses.

---

# 9. Piper Voice Files

The current VOCO TTS server expects these voice models:

```text
tts/
├── app.py
├── en_US-lessac-medium.onnx
├── hi_IN-pratham-medium.onnx
└── ...
```

The corresponding Piper metadata files should remain with the downloaded voice models.

The configured languages are:

```text
en → English
hi → Hindi
```

---

# 10. TTS CORS Configuration

The React development server normally runs on:

```text
http://localhost:3000
```

The Piper service runs on:

```text
http://127.0.0.1:8002
```

Therefore the Piper FastAPI server must allow the React origin.

`tts/app.py` should include:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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
```

After changing `app.py`, restart the Piper server:

```bash
uvicorn app:app --host 127.0.0.1 --port 8002
```

---

# 11. Test Piper Through HTTP

After the Piper FastAPI server is running, you can test the `/synthesize` endpoint from a second PowerShell window.

If the terminal is already in the Desktop directory:

```powershell
Invoke-WebRequest `
  -Uri "http://127.0.0.1:8002/synthesize" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"text":"Hello, welcome to VOCO.","language":"en"}' `
  -OutFile ".\test.wav"
```

This creates:

```text
test.wav
```

in the current directory.

Open the WAV file and verify that the audio plays.

If the file plays correctly, Piper itself is working and any remaining browser playback problem is on the React/browser side.

---

# 12. Node / Express Backend

From the project root, install the backend dependencies:

```bash
cd backend
npm install
```

The backend connects the React application to the local AI services.

Main AI routes:

```text
POST /api/ai/chat
POST /api/ai/transcribe
```

The backend uses:

```text
Ollama       → 127.0.0.1:11434
Faster-Whisper → 127.0.0.1:8001
Piper          → 127.0.0.1:8002
```

Start the backend using the project's configured command, for example:

```bash
npm start
```

---

# 13. React Frontend

From the VOCO project root:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The development application is normally available at:

```text
http://localhost:3000
```

---

# 14. Complete Startup Order

For a fresh development session, start the services in separate terminals.

## Terminal 1 — Ollama

```bash
ollama serve
```

Service:

```text
127.0.0.1:11434
```

---

## Terminal 2 — Faster-Whisper

```bash
cd stt
venv\Scripts\activate
uvicorn app:app --host 127.0.0.1 --port 8001
```

Service:

```text
127.0.0.1:8001
```

Test:

```text
http://127.0.0.1:8001/health
```

---

## Terminal 3 — Piper

```bash
cd tts
venv\Scripts\activate
uvicorn app:app --host 127.0.0.1 --port 8002
```

Service:

```text
127.0.0.1:8002
```

Test:

```text
http://127.0.0.1:8002/health
```

---

## Terminal 4 — Node / Express

```bash
cd backend
npm start
```

Use the actual backend start command configured in `package.json` if it differs.

---

## Terminal 5 — React

From the project root:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

# 15. AI Voice Conversation Flow

Once all services are running:

```text
User
 ↓
React
 ↓
Microphone
 ↓
Node / Express
 ↓
Faster-Whisper :8001
 ↓
Transcript
 ↓
Node / Express
 ↓
Ollama / Qwen3 :11434
 ↓
AI response
 ↓
Piper :8002
 ↓
WAV audio
 ↓
React
 ↓
AI speaks
```

---

# 16. Supported Languages

English:

```text
en
```

Hindi:

```text
hi
```

The selected language is passed through the voice pipeline:

```text
Language Selection
        ↓
Speech-to-Text
        ↓
Qwen3
        ↓
Text-to-Speech
```

---

# 17. Troubleshooting

## Ollama is not reachable

Start:

```bash
ollama serve
```

Check:

```bash
ollama list
```

Make sure:

```text
qwen3:1.7b
```

is installed.

---

## STT is not reachable

Check:

```text
http://127.0.0.1:8001/health
```

Make sure the STT `venv` is activated and the server is running:

```bash
uvicorn app:app --host 127.0.0.1 --port 8001
```

---

## Piper is not reachable

Check:

```text
http://127.0.0.1:8002/health
```

Make sure the TTS `venv` is activated and the server is running:

```bash
uvicorn app:app --host 127.0.0.1 --port 8002
```

---

## Piper model not found

Check that the expected `.onnx` files are inside:

```text
tts/
```

Expected:

```text
en_US-lessac-medium.onnx
hi_IN-pratham-medium.onnx
```

---

## Browser CORS error

Make sure `CORSMiddleware` is configured in `tts/app.py` and restart the Piper server.

---

## Browser TTS error

If the browser reports:

```text
NotSupportedError: Failed to load because no supported source was found.
```

check the browser console.

A successful TTS response should be:

```text
type: audio/wav
```

If it is:

```text
type: application/json
```

the Piper endpoint returned an error response rather than audio.

---

# 18. Current AI Service Status

Completed:

- [x] Ollama setup
- [x] Qwen3 1.7B
- [x] Faster-Whisper STT
- [x] English Piper voice
- [x] Hindi Piper voice
- [x] Piper FastAPI service
- [x] React → STT integration
- [x] React → Qwen3 integration
- [x] React → Piper integration
- [x] English/Hindi language routing
- [x] Browser WAV playback
- [x] Local AI voice conversation

Next:

- [ ] Automatic silence detection
- [ ] Improved microphone input
- [ ] Better speech segmentation
- [ ] Separate listening/speaking/generating states
- [ ] Barge-in / interruption
- [ ] Streaming
- [ ] Pronunciation scoring
- [ ] Grammar feedback
- [ ] Conversation scoring
