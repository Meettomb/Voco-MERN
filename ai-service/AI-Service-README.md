# AI Service & Application Setup

This project requires **Python, Ollama, Node.js, React, and the backend
services** to run together locally.

## Prerequisites

-   Python (latest version recommended)
-   Node.js and npm
-   Ollama
-   Git

------------------------------------------------------------------------

## 1. Python Environment Setup

Before starting the AI service, open a terminal inside the `ai-services`
folder and run:

``` bash
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Verify Python:

``` bash
python --version
```

The virtual environment must be activated before starting the AI
service. You should see `(venv)` in the terminal prompt.

> The virtual environment and dependencies only need to be
> created/installed the first time, unless the environment is deleted or
> `requirements.txt` changes.

------------------------------------------------------------------------

## 2. Install Ollama

Download and install Ollama for Windows:

https://ollama.com/download/ollamaSetup.exe

After installation, open a new terminal and verify:

``` bash
ollama
```

------------------------------------------------------------------------

## 3. Download the Required Ollama Model

``` bash
ollama pull qwen2.5:3b
```

This downloads the `qwen2.5:3b` model required by the AI service.

------------------------------------------------------------------------

## 4. Run Ollama

Start the model:

``` bash
ollama run qwen2.5:3b
```

Keep this terminal running while using the application.

------------------------------------------------------------------------

## 5. Run the AI Service

Open another terminal inside the `ai-services` folder.

Activate the virtual environment:

``` bash
venv\Scripts\activate
```

Then start the Python/FastAPI server:

``` bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

The AI service will run at:

``` text
http://127.0.0.1:8000
```

------------------------------------------------------------------------

## 6. Run the Node.js Backend

Open a separate terminal inside the `backend` folder.

For the first-time setup:

``` bash
npm install
```

Then run:

``` bash
npm run dev
```

------------------------------------------------------------------------

## 7. Run the React Frontend

Open another terminal in the React/frontend project folder.

For the first-time setup:

``` bash
npm install
```

Then run:

``` bash
npm start
```

------------------------------------------------------------------------

## 8. Run All Services Together

A total of **4 processes** need to be running:

  ---------------------------------------------------------------------------------------------------------
  Service                 Command                                                   Location
  ----------------------- --------------------------------------------------------- -----------------------
  React Frontend          `npm start`                                               React/frontend folder

  Node.js Backend         `npm run dev`                                             `backend`

  AI Service              `uvicorn app:app --reload --host 127.0.0.1 --port 8000`   `ai-services`

  Ollama                  `ollama run qwen2.5:3b`                                   Any terminal
  ---------------------------------------------------------------------------------------------------------

Keep all four processes running while developing and testing.

------------------------------------------------------------------------

## Recommended Startup Order

### Terminal 1 --- Ollama

``` bash
ollama run qwen2.5:3b
```

### Terminal 2 --- AI Service

``` bash
cd ai-services
venv\Scripts\activate
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 3 --- Node.js Backend

``` bash
cd backend
npm run dev
```

### Terminal 4 --- React Frontend

``` bash
npm start
```

------------------------------------------------------------------------

## First-Time Setup Summary

### AI Service

``` bash
cd ai-services
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Ollama

``` bash
ollama pull qwen2.5:3b
```

### Backend

``` bash
cd backend
npm install
```

### Frontend

``` bash
npm install
```

After completing the first-time setup, use the **Recommended Startup
Order** for subsequent runs.

------------------------------------------------------------------------

## Troubleshooting

### Ollama command is not recognized

Close and reopen the terminal after installing Ollama, then run:

``` bash
ollama
```

### Model is not available

``` bash
ollama pull qwen2.5:3b
ollama run qwen2.5:3b
```

### Virtual environment is not activated

Inside `ai-services`, run:

``` bash
venv\Scripts\activate
```

You should see `(venv)` at the beginning of the terminal prompt.

### AI service does not start

Make sure you are inside `ai-services`, the virtual environment is
activated, and dependencies are installed:

``` bash
venv\Scripts\activate
pip install -r requirements.txt
```

Then:

``` bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### Backend does not start

Inside `backend`:

``` bash
npm install
npm run dev
```

### React frontend does not start

Inside the React/frontend folder:

``` bash
npm install
npm start
```

------------------------------------------------------------------------

## Development Architecture

``` text
React Frontend
      │
      ▼
Node.js Backend
      │
      ▼
AI Service (FastAPI/Uvicorn)
      │
      ▼
Ollama
      │
      ▼
Qwen 2.5 3B Model
```

The React frontend communicates with the Node.js backend. AI-related
requests are handled by the Python AI service, which communicates with
Ollama and uses the `qwen2.5:3b` model.
