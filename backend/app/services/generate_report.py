from google import genai
from app.config import GOOGLE_API_KEY

def generate_report(annotations: dict) -> str:
    try:
        client = genai.Client(api_key=GOOGLE_API_KEY)

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

        if not response.text:
            raise ValueError("Empty response from Gemini API")

        return response.text

    except Exception as e:
        return f"Report generation failed: {str(e)}"