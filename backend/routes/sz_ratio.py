from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()


class AudioData(BaseModel):
    type: str
    audio_data: list
    sample_rate: int


@router.post("/analyze")
async def analyze_sz(data: AudioData):
    """
    Analyze S/Z audio from decoded PCM data
    Expects: {type: 's' or 'z', audio_data: float[], sample_rate: int}
    """
    try:
        # Convert audio data to numpy array
        audio_array = np.array(data.audio_data, dtype=np.float32)
        sr = data.sample_rate
        sound_type = data.type

        # Calculate duration
        duration = len(audio_array) / sr
        duration = round(duration, 2)

        # Downsample for waveform display
        max_points = 3000
        factor = max(1, len(audio_array) // max_points)
        waveform = audio_array[::factor].tolist()

        return {
            "type": sound_type,
            "duration_sec": duration,
            "sampling_rate": sr,
            "waveform": waveform
        }
    except Exception as e:
        print(f"analyze_sz error: {e}")
        return {
            "type": "error",
            "duration_sec": 0,
            "sampling_rate": 16000,
            "waveform": [],
            "error": str(e)
        }
