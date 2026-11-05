# VOCO -- AI-Powered Language Learning Platform

VOCO is an AI-powered language-learning platform designed to help users
practise languages through structured learning activities and
voice-based conversations with an AI learning partner.

The platform combines vocabulary learning, chapter-based lessons,
multiple-choice assessments, learner progress tracking, and
conversational AI. Its voice conversation workflow integrates Ollama
with Qwen3, Faster-Whisper for speech recognition, and Piper for speech
synthesis.

> **Project status:** VOCO is under active development and testing. Some
> setup details and features may evolve as the project progresses.

## Table of Contents

-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [System Architecture](#system-architecture)
-   [AI Voice Conversation Workflow](#ai-voice-conversation-workflow)
-   [Prerequisites](#prerequisites)
-   [Repository Configuration](#repository-configuration)
-   [Environment Variables](#environment-variables)
-   [Installation and Setup](#installation-and-setup)
    -   [1. Clone the Repository](#1-clone-the-repository)
    -   [2. Configure the Backend](#2-configure-the-backend)
    -   [3. Configure the Frontend](#3-configure-the-frontend)
    -   [4. Set Up Ollama](#4-set-up-ollama)
    -   [5. Set Up the Speech-to-Text
        Service](#5-set-up-the-speech-to-text-service)
    -   [6. Set Up the Text-to-Speech
        Service](#6-set-up-the-text-to-speech-service)
    -   [7. Start VOCO](#7-start-voco)
-   [AI Services and Local Endpoints](#ai-services-and-local-endpoints)
-   [Supported Voice Languages](#supported-voice-languages)
-   [Troubleshooting](#troubleshooting)
-   [Security Notes](#security-notes)
-   [Future Improvements](#future-improvements)
-   [Contributing](#contributing)
-   [License](#license)

## Features

### Language Learning

-   User registration, login, and account management.
-   User profile management, including profile-picture support.
-   Learning-language and interface-language selection.
-   Chapter-based learning content.
-   Vocabulary and word-learning activities.
-   Multiple-choice question (MCQ) assessments.
-   Exam attempts, results, and learner progress tracking.
-   Dashboard views for learning activity and progress.
-   Administrative functionality for managing learning content.

### AI Voice Conversation

-   Voice-based conversations with an AI language-learning partner.
-   AI responses generated locally through Ollama and the Qwen3 1.7B
    model.
-   Speech recognition using Faster-Whisper.
-   Speech synthesis using Piper TTS.
-   English and Hindi voice-service configuration.
-   Integration of the speech services with the React frontend and
    Node.js backend.
-   Browser playback of generated WAV audio.

## Technology Stack

  -----------------------------------------------------------------------
  Area                                Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React, JavaScript, CSS

  Backend                             Node.js, Express.js

  Database                            MongoDB

  AI language model                   Ollama, Qwen3 1.7B

  Speech-to-Text (STT)                Python, FastAPI, Faster-Whisper

  Text-to-Speech (TTS)                Python, FastAPI, Piper

  Authentication                      JWT

  Email                               SMTP / Nodemailer

  Additional integrations             Twilio, YouTube Data API, GitHub
                                      image upload
  -----------------------------------------------------------------------

## System Architecture

The application uses a React frontend, an Express backend, MongoDB for
application data, and separate local AI services for conversational AI
and speech processing.

``` mermaid
flowchart TD
    U[User] --> FE[React Frontend]
    FE --> BE[Node.js / Express Backend]
    BE --> DB[(MongoDB)]
    BE --> AI[Ollama - Qwen3 1.7B]
    BE --> STT[Faster-Whisper STT Service]
    BE --> TTS[Piper TTS Service]
    STT --> BE
    AI --> BE
    TTS --> BE
    BE --> FE
    FE --> U
```

## AI Voice Conversation Workflow

The voice conversation flow connects the user's microphone input to
speech recognition, AI response generation, and speech synthesis.

``` mermaid
flowchart TD
    A[User speaks] --> B[React captures audio]
    B --> C[Backend AI API]
    C --> D[Faster-Whisper STT]
    D --> E[Recognized transcript]
    E --> F[Ollama - Qwen3 1.7B]
    F --> G[Generated AI response]
    G --> H[Piper TTS]
    H --> I[WAV audio response]
    I --> J[React plays audio]
```

## Prerequisites

Install the following before setting up the project:

-   [Node.js](https://nodejs.org/) and npm.
-   [Python](https://www.python.org/) for the STT and TTS services.
-   [Ollama](https://ollama.com/) for running the local Qwen model.
-   [MongoDB](https://www.mongodb.com/) database access.
-   Git.

The AI speech services run separately from the main React and Node.js
applications.

## Repository Configuration

The repository contains the application and its supporting AI services.
The following is a conceptual overview; actual folder names may differ
between project versions.

``` text
VOCO/
├── frontend/          # React application
├── backend/           # Node.js and Express application
├── stt/               # Faster-Whisper speech-to-text service
├── tts/               # Piper text-to-speech service
├── README.md
└── ...
```

## Environment Variables

VOCO uses environment variables for database connectivity,
authentication, email, third-party integrations, and service URLs.

Create a `.env` file in the backend and frontend directories using the
corresponding example files.

### Backend `.env.example`

``` env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB Database
MONGO_URI=

# Email Configuration (SMTP)
SMTP_EMAIL=
SMTP_PASS=

# JWT Authentication
JWT_SECRET=

# Twilio SMS Configuration
TWILIO_NO=
ACCOUNT_SID=
AUTH_TOKEN=

# Gemini API (only if used by the current backend code)
GEMINI_API_KEY=

# GitHub Image Upload Configuration
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_BRANCH=

# Ollama AI Service
OLLAMA_URL=http://127.0.0.1:11434

# Speech-to-Text Service
STT_URL=http://127.0.0.1:8001
```

### Frontend `.env.example`

``` env
# React Development Server
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true

# YouTube Data API v3
REACT_APP_YOUTUBE_API_KEY=

# Backend API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_URL=http://localhost:3000

# AI Speech Services
REACT_APP_STT_URL=http://127.0.0.1:8001
REACT_APP_TTS_URL=http://127.0.0.1:8002
```

> **Important:** Keep the variable names aligned with the names read by
> the application code. The `GEMINI_API_KEY` entry is included only as a
> compatibility placeholder from the supplied configuration; remove it
> if the current backend does not use Gemini. VOCO's described
> conversational model is Ollama with Qwen3 1.7B.

### Create your local environment files

From the relevant project directories, copy the example file:

``` bash
cp .env.example .env
```

On Windows Command Prompt, you can use:

``` cmd
copy .env.example .env
```

Then fill in the values required by your local setup. Do not commit the
resulting `.env` files.

## Installation and Setup

The commands below assume the service directories are named `backend`,
`frontend`, `stt`, and `tts`. Adjust the paths if your checkout uses
different folder names.

### 1. Clone the Repository

``` bash
git clone https://github.com/Meettomb/Voco-MERN.git
cd Voco-MERN
```

### 2. Configure the Backend

Navigate to the backend directory:

``` bash
cd backend
npm install
```

Create the backend `.env` file from `.env.example` and configure at
least the values required by your backend, including the MongoDB
connection string and JWT secret.

Start the backend using the start script defined in its `package.json`.
A common development command is:

``` bash
npm start
```

If the project defines a development script, use that script instead
(for example, `npm run dev`).

The backend is configured to use port `5000` in the example environment.

### 3. Configure the Frontend

In a separate terminal:

``` bash
cd frontend
npm install
```

Create the frontend `.env` file from `.env.example`. Check that
`REACT_APP_API_URL` points to the backend API.

Start the React development server:

``` bash
npm start
```

The frontend is configured to use `http://localhost:3000` in the example
environment.

### 4. Set Up Ollama

Install Ollama and download the Qwen3 1.7B model:

``` bash
ollama pull qwen3:1.7b
```

Start the Ollama service:

``` bash
ollama serve
```

Ollama's default local endpoint is:

``` text
http://127.0.0.1:11434
```

Verify that the model is available:

``` bash
ollama list
```

If Ollama is already running as a background service, you may not need
to start it manually.

### 5. Set Up the Speech-to-Text Service

The STT service uses Faster-Whisper through FastAPI.

Navigate to the STT service directory:

``` bash
cd stt
python -m venv venv
```

Activate the virtual environment.

**Windows Command Prompt:**

``` cmd
venv\Scripts\activate
```

**macOS / Linux:**

``` bash
source venv/bin/activate
```

Install the dependencies:

``` bash
pip install -r requirements.txt
```

If you encounter a PyAV installation or compatibility issue, the project
setup notes identify this version as a possible workaround:

``` bash
pip install av==18.1.0
```

Start the STT service:

``` bash
uvicorn app:app --host 127.0.0.1 --port 8001
```

The service health endpoint is:

``` text
http://127.0.0.1:8001/health
```

Keep this terminal running while using voice conversations.

### 6. Set Up the Text-to-Speech Service

The TTS service uses Piper to generate speech audio.

Navigate to the TTS service directory:

``` bash
cd tts
python -m venv venv
```

Activate the virtual environment.

**Windows Command Prompt:**

``` cmd
venv\Scripts\activate
```

**macOS / Linux:**

``` bash
source venv/bin/activate
```

Upgrade pip and install Piper:

``` bash
python -m pip install --upgrade pip
pip install piper-tts
```

Download the configured English and Hindi voice models:

``` bash
python -m piper.download_voices en_US-lessac-medium
python -m piper.download_voices hi_IN-pratham-medium
```

Install the FastAPI server dependencies if they are not already included
in the service requirements:

``` bash
python -m pip install fastapi uvicorn
```

Make sure the corresponding `.onnx` voice files and their `.onnx.json`
metadata files are available where the TTS application expects them.

Start the TTS service:

``` bash
uvicorn app:app --host 127.0.0.1 --port 8002
```

The service health endpoint is:

``` text
http://127.0.0.1:8002/health
```

Keep this terminal running while using voice conversations.

### 7. Start VOCO

Start each service in its own terminal. A typical local development
setup uses the following order:

  -----------------------------------------------------------------------
  Terminal                Service                 Command / action
  ----------------------- ----------------------- -----------------------
  1                       Ollama                  `ollama serve`

  2                       STT                     Activate the STT
                                                  virtual environment and
                                                  run the Uvicorn command
                                                  on port `8001`

  3                       TTS                     Activate the TTS
                                                  virtual environment and
                                                  run the Uvicorn command
                                                  on port `8002`

  4                       Backend                 Run the Node.js backend

  5                       Frontend                Run the React
                                                  development server
  -----------------------------------------------------------------------

Once all required services are running and environment variables are
configured, open the frontend in your browser:

``` text
http://localhost:3000
```

## AI Services and Local Endpoints

The default local endpoints in the example configuration are:

  Service    Endpoint                   Purpose
  ---------- -------------------------- -----------------------------
  Ollama     `http://127.0.0.1:11434`   Local Qwen3 model inference
  STT        `http://127.0.0.1:8001`    Speech recognition
  TTS        `http://127.0.0.1:8002`    Speech synthesis
  Backend    `http://localhost:5000`    Application API
  Frontend   `http://localhost:3000`    React application

The backend AI API routes include:

-   `POST /api/ai/chat` -- conversational AI workflow.
-   `POST /api/ai/transcribe` -- speech transcription workflow.

The exact request payloads and authentication requirements are defined
by the backend implementation.

### CORS Configuration

When running the frontend and AI services locally, configure CORS to
allow the frontend origin used by your browser. The Piper service setup
notes include these development origins:

``` text
http://localhost:3000
http://127.0.0.1:3000
```

If you access the frontend using a different host or port, update the
relevant service CORS configuration accordingly. Do not use permissive
development settings as a substitute for production CORS configuration.

## Supported Voice Languages

The documented Piper voice setup includes:

  Language   Code   Piper voice
  ---------- ------ ------------------------
  English    `en`   `en_US-lessac-medium`
  Hindi      `hi`   `hi_IN-pratham-medium`

The language code passed through the frontend and services must match
the language-routing logic in the application.

## Troubleshooting

### Ollama is not responding

-   Confirm Ollama is installed and running.
-   Run `ollama list` and check that `qwen3:1.7b` is available.
-   Confirm `OLLAMA_URL` points to the correct local endpoint.

### STT service is unavailable

-   Confirm the STT virtual environment is activated.
-   Install the dependencies from `requirements.txt`.
-   Confirm the service is running on port `8001`.
-   Check that `STT_URL` and `REACT_APP_STT_URL` match the actual
    service address.

### TTS service cannot find a voice model

-   Download the required Piper voice model.
-   Confirm both the `.onnx` file and its `.onnx.json` metadata file are
    present.
-   Confirm the paths used by the TTS application match the downloaded
    files.

### Frontend cannot reach the backend

-   Confirm the backend is running.
-   Check `REACT_APP_API_URL`.
-   Check the backend CORS configuration and `FRONTEND_URL`.
-   Make sure the browser is using the same hostname and port configured
    by the application.

### Browser reports a CORS error

-   Add the exact frontend origin to the relevant backend or AI service
    CORS allowlist.
-   Avoid mixing `localhost` and `127.0.0.1` unless both origins are
    explicitly allowed.
-   Do not disable security checks in production.

## Security Notes

-   Never commit real `.env` files or credentials.
-   Never publish MongoDB connection strings, SMTP passwords, JWT
    secrets, Twilio credentials, GitHub tokens, or private API keys.
-   Frontend variables prefixed with `REACT_APP_` are included in the
    browser bundle. Treat them as public; never put secrets in them.
-   Restrict third-party API keys using provider-side restrictions where
    available.
-   Use a strong, unique JWT secret.
-   `DANGEROUSLY_DISABLE_HOST_CHECK=true` is for local development only.
    Do not enable it in production.
-   Review authentication, authorization, input validation, file
    uploads, and API access controls before deploying.
-   If a secret is accidentally committed, revoke or rotate it. Removing
    it from the latest commit alone may not remove it from Git history.

## Future Improvements

Potential areas for continued development include:

-   Automatic silence detection.
-   Improved microphone input handling.
-   Speech segmentation and more responsive audio processing.
-   Clear listening, generating, and speaking interface states.
-   Barge-in and interruption support.
-   Streaming speech recognition and speech synthesis.
-   Pronunciation assessment.
-   Grammar feedback.
-   Conversation and speaking-performance evaluation.

## Contributing

Contributions, bug reports, and suggestions are welcome.

Before submitting a contribution:

1.  Check the existing issues and project discussions.
2.  Describe the change or bug clearly.
3.  Keep changes focused and consistent with the existing project
    structure.
4.  Test the affected functionality.
5.  Submit a pull request with a clear description of the changes.

If you are contributing code or assets created by another person, make
sure you have permission to contribute them and that their applicable
terms allow the contribution.

## License

A formal open-source license has not yet been confirmed for this
repository.

Until a license is added by the project maintainers, do not assume that
the public availability of this repository grants permission to use,
modify, distribute, or commercially exploit its code. A license will be
added after the project maintainers have confirmed the rights and
permissions for all contributed material.
