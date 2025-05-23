from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from app.services.dicom_converter import dicom_to_jpg

router = APIRouter()

@router.post("/convert-dicom-to-jpg/")
async def convert_dicom_to_jpg(file: UploadFile = File(...)):
    try:
        jpg_bytes = await dicom_to_jpg(file)
        return StreamingResponse(jpg_bytes, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(500, detail=f"Conversion failed: {str(e)}")
