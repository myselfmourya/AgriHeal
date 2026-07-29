import asyncio
import logging
from dotenv import load_dotenv

from livekit.agents import AutoSubscribe, JobContext, JobProcess, WorkerOptions, cli, llm
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import anthropic, gladia, cartesia, silero

load_dotenv()
logger = logging.getLogger("agriheal-agent")

def prewarm(proc: JobProcess):
    """Preload VAD models for faster wake time."""
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    # Connect to the room
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are Vani, a helpful, empathetic, and knowledgeable AI agriculture and healthcare assistant for rural farmers in India. "
            "You are speaking to the user in a voice call. Keep your answers concise, conversational, and easy to understand. "
            "Never use markdown, lists, or complex formatting in your speech. Speak naturally. "
            "You can help them with crop diseases, livestock health, market prices, government schemes, and personal health."
        )
    )

    # Initialize the Voice Agent
    # For no-lag, human-like voice, we use Cartesia TTS (female voice).
    # Gladia provides STT and Anthropic provides LLM.
    
    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=gladia.STT(),
        llm=anthropic.LLM(model="claude-3-5-sonnet-20240620"),
        tts=cartesia.TTS(voice="79a125e8-cd45-4c13-8a67-188112f4dd22"), # Cartesia's standard conversational female voice
        chat_ctx=initial_ctx,
    )

    logger.info("Connecting to LiveKit room...")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    logger.info("Agent starting...")
    agent.start(ctx.room)
    
    await asyncio.sleep(1)
    await agent.say("Namaste! I'm Vani. How can I help your farm today?", allow_interruptions=True)

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm
        )
    )
