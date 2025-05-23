# 2. Modified code with decompression handling
import pydicom
from pydicom import dcmread
from PIL import Image
import io
import numpy as np

async def dicom_to_jpg(file):
    contents = await file.read()
    dicom_file = io.BytesIO(contents)
    
    # Read DICOM with forced decompression
    ds = dcmread(dicom_file)
    
    # Handle compressed DICOM files
    if ds.file_meta.TransferSyntaxUID.is_compressed:
        ds.decompress()  # Uses installed plugins (pylibjpeg-libjpeg)
    
    pixel_array = ds.pixel_array
    
    # Improved normalization for different bit depths
    if np.issubdtype(pixel_array.dtype, np.floating):
        normalized = (pixel_array - np.min(pixel_array)) / (np.max(pixel_array) - np.min(pixel_array))
    else:
        normalized = (pixel_array.astype(float) - np.min(pixel_array)) / (np.max(pixel_array) - np.min(pixel_array))
    
    img = Image.fromarray((normalized * 255).astype(np.uint8))
    
    # Handle color images
    if len(pixel_array.shape) == 3:  # RGB
        img = img.convert("RGB")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG', quality=90)
    img_byte_arr.seek(0)
    
    return img_byte_arr
