from fastapi import APIRouter, File, UploadFile, HTTPException
import tempfile
import os
from app.services.roboflow_service import model
from app.services.generate_report import generate_report

router = APIRouter()

@router.post("/predict/")
async def predict(image: UploadFile = File(..., description="JPEG image for prediction")):
    try:
        # Validate file type
        if not image.content_type.startswith('image/jpeg'):
            raise HTTPException(400, detail="Only JPEG images are accepted")

        # Read uploaded image bytes
        image_bytes = await image.read()
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp:
            temp.write(image_bytes)
            temp_path = temp.name

        # Run prediction
        prediction = model.predict(temp_path).json()
        #print("Roboflow response:", prediction)
        os.remove(temp_path)  # Clean up temp file

        # Process results
        processed = []
        for p in prediction['predictions']:
            processed.append({
                "class": p['class'],
                "confidence": p['confidence'],
                "bbox": {
                    "x": p['x'],
                    "y": p['y'],
                    "width": p['width'],
                    "height": p['height']
                }
            })
        report = generate_report(processed)
        
        return {"predictions": processed, "diagnostic_report": report}

    except Exception as e:
        # Ensure temp file is deleted even if error occurs
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(500, detail=f"Prediction failed: {str(e)}")
