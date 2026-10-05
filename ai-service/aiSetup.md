# Project Setup & Development Guide

This repository contains a multi-service application consisting of a React frontend, Node.js backend, Python AI service, and a local Ollama LLM instance.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Python**: Upgrade Python to the latest version.
2. **Node.js & npm**: Installed for the frontend and backend environments.
3. **Ollama**:
   - Download installer: [OllamaSetup.exe](https://ollama.com/download/OllamaSetup.exe)
   - Complete the default installation process.
   - Verify installation by running `ollama` in your terminal/Command Prompt.

---

## 🛠️ Step-by-Step Setup

### 1. Download & Prepare the AI Model
Pull and run the `qwen2.5:3b` model using Ollama:

```bash
# Pull the required model
ollama pull qwen2.5:3b

# Run the model instance
ollama run qwen2.5:3b
```

---

## 🚀 Running the Application

To run the full stack locally, you need to start **4 separate server instances** across different terminal windows/tabs:

### 1️⃣ Ollama LLM Service
```bash
ollama run qwen2.5:3b
```

### 2️⃣ Python AI Service
Navigate to the `ai-service` directory and start the Uvicorn server:
```bash
cd ai-service
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### 3️⃣ Node.js Backend
Navigate to the `backend` directory and start the server:
```bash
cd backend
npm run dev
```

### 4️⃣ React Frontend
Navigate to the root or frontend project directory and start the development server:
```bash
npm start
```

---

## 🌐 Summary of Running Services

| Service | Technology | Command | Host / Port | Location |
| :--- | :--- | :--- | :--- | :--- |
| **LLM Model** | Ollama | `ollama run qwen2.5:3b` | Default Ollama Port | Terminal |
| **AI Service** | FastAPI / Uvicorn | `uvicorn app:app --reload --host 127.0.0.1 --port 8000` | `http://127.0.0.1:8000` | `./ai-service` |
| **Backend** | Node.js | `npm run dev` | Configured local port | `./backend` |
| **Frontend** | React | `npm start` | `http://localhost:3000` | Root / Frontend folder |