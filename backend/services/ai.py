import google.generativeai as genai
from backend.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

async def generate_insight(activities: list, total_emissions: float) -> str:
    """Generate personalized insights based on recent activities using Gemini."""
    if not model:
        logger.warning("Gemini API key not configured. Triggering fallback.")
        raise ValueError("AI Engine not configured")
        
    try:
        prompt = f"""
        You are EcoTrack's AI Carbon Assistant. The user has generated {total_emissions} kg of CO2 recently.
        Their recent activities are:
        {activities}
        
        Provide a short (max 2 sentences), actionable, and highly personalized insight on how they can reduce their emissions. 
        Focus on their specific activity types. Use a supportive, gamified tone. Do not use markdown headers.
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini generation failed: {str(e)}")
        raise e
