from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()


class AudioData(BaseModel):
    vowel: str
    audio_data: list
    sample_rate: int


@router.post("/phonation/analyze")
async def analyze_phonation(data: AudioData):
    """
    Analyze phonation vowel from decoded PCM data
    Expects: {vowel: 'a'|'ii'|'u'|'uhm', audio_data: float[], sample_rate: int}
    """
    try:
        # Convert audio data to numpy array
        audio_array = np.array(data.audio_data, dtype=np.float32)
        sr = data.sample_rate
        vowel = data.vowel

        # Calculate duration
        duration = len(audio_array) / sr
        duration = round(duration, 2)

        # Downsample for waveform display
        max_points = 3000
        factor = max(1, len(audio_array) // max_points)
        waveform = audio_array[::factor].tolist()

        return {
            "vowel": vowel,
            "duration_sec": duration,
            "sampling_rate": sr,
            "waveform": waveform,
        }
    except Exception as e:
        print(f"analyze_phonation error: {e}")
        return {
            "vowel": "error",
            "duration_sec": 0,
            "sampling_rate": 16000,
            "waveform": [],
            "error": str(e)
        }


@router.post("/upload/{vowel}")
async def upload_phonation(vowel: str, data: AudioData):
    """
    Alternative endpoint for vowel upload
    """
    return await analyze_phonation(data)
