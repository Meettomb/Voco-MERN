# AI Service & Application Setup

This project requires **Python, Ollama, Node.js, React, and the backend
services** to run together locally.

## Prerequisites

Make sure the following are installed:

-   Python (latest version recommended)
-   Node.js and npm
-   Ollama
-   Git

## 1. Setup Python

Upgrade/install Python to the latest available version.

Verify the installation:

``` bash
python --version
```

## 2. Install Ollama

Download and install Ollama for Windows:

https://ollama.com/download/ollamaSetup.exe

After completing the installation, open a new Command Prompt or terminal
and verify Ollama:

``` bash
ollama
```

If the Ollama help/command output is displayed, the installation is
successful.

## 3. Download the Required Ollama Model

Pull the required model:

``` bash
ollama pull qwen2.5:3b
```

This downloads the `qwen2.5:3b` model required by the AI service.

## 4. Run the Ollama Model

Start the model with:

``` bash
ollama run qwen2.5:3b
```

Keep this terminal running while using the application.

## 5. Run the AI Service

Open a terminal inside the `ai-services` folder.

Start the Python server with:

``` bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

The AI service will run at:

``` text
http://127.0.0.1:8000
```

## 6. Run the Backend

Open a separate terminal inside the `backend` folder and run:

``` bash
npm run dev
```

## 7. Run the React Frontend

Open another terminal in the React/frontend project folder and run:

``` bash
npm start
```

## 8. Run All Services Together

A total of **4 services** need to be running:

  ---------------------------------------------------------------------------------------------------------
  Service                 Command                                                   Location
  ----------------------- --------------------------------------------------------- -----------------------
  React Frontend          `npm start`                                               React/frontend folder

  Node.js Backend         `npm run dev`                                             `backend`

  AI Service              `uvicorn app:app --reload --host 127.0.0.1 --port 8000`   `ai-services`

  Ollama                  `ollama run qwen2.5:3b`                                   Any terminal
  ---------------------------------------------------------------------------------------------------------

Keep all four terminals/processes running while developing and testing
the application.

## Recommended Startup Order

For a clean startup, use this order:

1.  Start Ollama:

    ``` bash
    ollama run qwen2.5:3b
    ```

2.  Start the AI service:

    ``` bash
    cd ai-services
    uvicorn app:app --reload --host 127.0.0.1 --port 8000
    ```

3.  Start the Node.js backend:

    ``` bash
    cd backend
    npm run dev
    ```

4.  Start the React frontend:

    ``` bash
    npm start
    ```

## Troubleshooting

### Ollama command is not recognized

Close and reopen the terminal after installing Ollama. Then run:

``` bash
ollama
```

### Model is not available

Pull the model again:

``` bash
ollama pull qwen2.5:3b
```

Then start it:

``` bash
ollama run qwen2.5:3b
```

### AI service does not start

Make sure you are inside the `ai-services` directory and run:

``` bash
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Also verify that Python and Uvicorn are installed correctly.

### Backend or frontend does not start

Run the following inside the corresponding Node.js project directory:

``` bash
npm install
```

Then retry:

``` bash
npm run dev
```

or:

``` bash
npm start
```

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

The React frontend communicates with the Node.js backend, while
AI-related requests are handled by the Python AI service, which uses
Ollama and the `qwen2.5:3b` model.
