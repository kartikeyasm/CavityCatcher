from google import genai
from app.config import GOOGLE_API_KEY

def generate_report(annotations: dict) -> str:
    try:
        # Configure Gemini (do this once globally, not per request)
        client = genai.Client(api_key=GOOGLE_API_KEY)

        # Structured prompt for better results
        prompt = f"""Act as a dental radiologist. Analyze these X-ray findings:
                    {annotations}

                    Write a professional diagnostic report including:
                    1. Detected pathologies with locations
                    2. Clinical significance
                    3. Recommended next steps

                    Use medical terminology but keep it concise. Avoid markdown formatting."""

        response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
        )

        print(response.text)

        # Handle potential empty responses
        if not response.text:
            raise ValueError("Empty response from Gemini API")

        return response.text

    except Exception as e:
        # Handle API errors gracefully
        return f"Report generation failed: {str(e)}"