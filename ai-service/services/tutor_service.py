import requests
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv(
    "OLLAMA_URL"
)

MODEL_NAME = os.getenv(
    "MODEL_NAME"
)


SYSTEM_PROMPT = """
You are VOCO, a friendly AI language tutor.

Your job is to have a natural one-to-one conversation with the learner.

Rules:
1. Keep the conversation natural and interactive.
2. Ask only one question at a time.
3. Keep responses short, usually 1-3 sentences.
4. If the learner makes a grammar mistake, politely correct it.
5. Do not interrupt the conversation with long explanations.
6. Continue the conversation based on what the learner actually said.
7. If the learner says something unclear, ask for clarification naturally.
8. Be encouraging and friendly.
9. At the beginning, ask which language the learner wants to practice.
10. After the language is selected, continue with normal conversation.
11. Never repeat the same question unnecessarily.

Return ONLY valid JSON in this format:

{
  "reply": "What the AI should say to the learner",
  "correction_needed": false,
  "correction": "",
  "next_question": "The question being asked"
}
"""


def generate_response(
    user_message: str,
    language: str = "English",
    history: list = None
):
    if history is None:
        history = []

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    # Add previous conversation
    messages.extend(history)

    # Add current user message
    messages.append({
        "role": "user",
        "content": (
            f"The learner is practicing {language}.\n"
            f"Learner said: {user_message}"
        )
    })

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "messages": messages,
            "stream": False,
            "format": "json"
        },
        timeout=120
    )

    response.raise_for_status()

    data = response.json()

    return data["message"]["content"]