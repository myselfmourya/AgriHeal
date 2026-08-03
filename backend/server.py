"""
AgriHeal — FastAPI token server (local dev only)
In production the livekit-token Supabase Edge Function handles token minting.
This server is ONLY used when running the LiveKit agent locally.
"""

import os
import uuid
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AgriHeal Local Dev Server")

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

LIVEKIT_URL        = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY    = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")


def _check_config():
    missing = [k for k, v in {
        "LIVEKIT_URL": LIVEKIT_URL,
        "LIVEKIT_API_KEY": LIVEKIT_API_KEY,
        "LIVEKIT_API_SECRET": LIVEKIT_API_SECRET,
    }.items() if not v or "REDACTED" in (v or "")]
    if missing:
        raise HTTPException(
            status_code=500,
            detail=f"Missing or placeholder LiveKit config: {', '.join(missing)}. "
                   "Check backend/.env"
        )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "agriheal-dev-server"}


@app.get("/get_token")
async def get_token(participant_name: str = "Farmer", room_name: str | None = None):
    """
    Mint a LiveKit JWT for the requesting participant.
    In production this is handled by the Supabase livekit-token Edge Function
    which also enforces Supabase Auth.
    """
    _check_config()

    room = room_name or f"vani-room-{uuid.uuid4().hex[:8]}"
    identity = f"user-{uuid.uuid4().hex[:8]}"

    token = (
        api.AccessToken(api_key=LIVEKIT_API_KEY, api_secret=LIVEKIT_API_SECRET)
        .with_identity(identity)
        .with_name(participant_name)
        .with_grants(api.VideoGrants(room_join=True, room=room, can_publish=True, can_subscribe=True))
    )

    return {"url": LIVEKIT_URL, "token": token.to_jwt(), "room": room}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
