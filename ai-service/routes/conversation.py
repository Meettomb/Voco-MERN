from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.tutor_service import generate_response


router = APIRouter()


class ConversationRequest(BaseModel):
    message: str
    language: str = "English"
    history: list = []


@router.post("/conversation")
async def conversation(request: ConversationRequest):

    try:
        response = generate_response(
            user_message=request.message,
            language=request.language,
            history=request.history
        )

        return {
            "success": True,
            "response": response
        }

    except Exception as e:
        print("LLM error:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )