from fastapi import APIRouter, Query
from pydantic import BaseModel
import numpy as np

router = APIRouter()


class AudioData(BaseModel):
    audio_data: list
    sample_rate: int


class AmrData(BaseModel):
    sound: str
    audio_data: list
    sample_rate: int


@router.post("/amr")
async def analyze_amr(sound: str = Query(...), data: AudioData = None):
    """
    Analyze Alternating Motion Rate (AMR) test sound
    sound = 'pa' | 'ta' | 'ka'
    Accepts: {audio_data: float[], sample_rate: int}
    """
    # Handle both query param and JSON body
    if data is None:
        from fastapi import Body
        data = Body(...)
    
    try:
        # Convert audio data to numpy array
        audio_array = np.array(data.audio_data, dtype=np.float32)
        sr = data.sample_rate

        # Calculate duration
        duration = len(audio_array) / sr
        duration = round(duration, 2)

        # Downsample for waveform display
        max_points = 3000
        factor = max(1, len(audio_array) // max_points)
        waveform = audio_array[::factor].tolist()

        return {
            "sound": sound,
            "test_type": "amr",
            "duration_sec": duration,
            "sampling_rate": sr,
            "waveform": waveform,
            "repetition_count": calculate_repetition_count(duration)
        }
    except Exception as e:
        print(f"analyze_amr error: {e}")
        return {
            "sound": sound,
            "test_type": "amr",
            "duration_sec": 0,
            "sampling_rate": 16000,
            "waveform": [],
            "error": str(e)
        }


@router.post("/smr")
async def analyze_smr(data: AudioData):
    """
    Analyze Sequential Motion Rate (SMR) test - PATAKA sequence
    Expects: {audio_data: float[], sample_rate: int}
    """
    try:
        # Convert audio data to numpy array
        audio_array = np.array(data.audio_data, dtype=np.float32)
        sr = data.sample_rate

        # Calculate duration
        duration = len(audio_array) / sr
        duration = round(duration, 2)

        # Downsample for waveform display
        max_points = 3000
        factor = max(1, len(audio_array) // max_points)
        waveform = audio_array[::factor].tolist()

        return {
            "test_type": "smr",
            "duration_sec": duration,
            "sampling_rate": sr,
            "waveform": waveform,
            "repetition_count": calculate_repetition_count(duration),
            "transition_quality": "normal"
        }
    except Exception as e:
        print(f"analyze_smr error: {e}")
        return {
            "test_type": "smr",
            "duration_sec": 0,
            "sampling_rate": 16000,
            "waveform": [],
            "error": str(e)
        }


def calculate_repetition_count(duration):
    """
    Estimate repetition count based on duration
    Typical rate: 5-7 repetitions per second for adults
    """
    if duration == 0:
        return 0
    estimated_rate = 6  # repetitions per second
    return round(duration * estimated_rate)
