from fastapi import APIRouter, UploadFile, File
from core.phonation_utils import extract_duration, save_audio
import os

router = APIRouter()

UPLOAD_DIR = "uploads/sz_test"


@router.post("/sz/analyze")
async def analyze_sz(type: str, audio: UploadFile = File(...)):
    """
    type = 's' or 'z'
    """
    filename = f"{type}_{audio.filename}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    save_audio(audio.file, save_path)

    duration = extract_duration(save_path)

    return {
        "type": type,
        "duration_sec": duration
    }
