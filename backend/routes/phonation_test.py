from fastapi import APIRouter, UploadFile, File
from core.phonation_utils import extract_duration, get_waveform, save_audio
import os

router = APIRouter()

UPLOAD_DIR = "uploads/phonation"


@router.post("/phonation/analyze")
async def analyze_phonation(vowel: str, audio: UploadFile = File(...)):
    """
    vowel = 'a' | 'e' | 'o' | 'u' | 'uhm'
    """
    filename = f"{vowel}_{audio.filename}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    # save audio
    save_audio(audio.file, save_path)

    # duration
    duration = extract_duration(save_path)

    # waveform samples
    waveform, sr = get_waveform(save_path)

    return {
        "vowel": vowel,
        "duration_sec": duration,
        "sampling_rate": sr,
        "waveform": waveform,
    }
