import os
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://your-livekit-url")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "your-api-key")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "your-api-secret")

@app.get("/get_token")
async def get_token(participant_name: str = "User"):
    if LIVEKIT_API_KEY == "your-api-key":
         raise HTTPException(status_code=500, detail="LiveKit credentials are not configured in backend")
    
    room_name = f"agriheal-room-{uuid.uuid4().hex[:8]}"
    participant_identity = f"user-{uuid.uuid4().hex[:8]}"
    
    token = api.AccessToken(
        api_key=LIVEKIT_API_KEY,
        api_secret=LIVEKIT_API_SECRET
    )
    
    token.with_identity(participant_identity)
    token.with_name(participant_name)
    token.with_grants(api.VideoGrants(
        room_join=True,
        room=room_name
    ))
    
    return {
        "url": LIVEKIT_URL,
        "token": token.to_jwt()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
