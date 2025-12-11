"""
Rate of Speech Analysis Endpoint
Analyzes speech rate (words per minute) from recorded audio.
Supports two assessment types: Rainbow Passage (standardized text) and Conversational speech.
"""

from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

router = APIRouter()


class AudioData(BaseModel):
    """Audio data transferred as JSON from frontend"""
    audio_data: List[float]
    sample_rate: int


class RateOfSpeechRequest(BaseModel):
    """Request model for rate of speech analysis"""
    type: str  # "rainbow" or "conversational"
    audio_data: List[float]
    sample_rate: int
    word_count: Optional[int] = None  # Exact word count for rainbow passage, None for conversational


class RateOfSpeechResponse(BaseModel):
    """Response model for rate of speech analysis"""
    type: str
    duration_sec: float
    words_per_minute: float
    speaking_rate: str  # "SLOW", "NORMAL", "FAST"
    estimated_words: Optional[int] = None  # For conversational when word_count not provided
    sampling_rate: int
    waveform: List[float]
    pause_count: int = 0
    pause_duration_sec: float = 0.0


def estimate_wpm_from_duration(duration_sec: float, audio_array: np.ndarray = None, sample_rate: int = None) -> tuple[float, int]:
    """
    Estimate words per minute and word count for conversational speech
    Uses improved estimation based on speech activity (excluding pauses)
    
    Args:
        duration_sec: Duration of speech in seconds
        audio_array: Audio waveform (optional, for more accurate pause-aware estimation)
        sample_rate: Sample rate (optional, required if audio_array provided)
    
    Returns:
        Tuple of (estimated_wpm, estimated_word_count)
    """
    # Clinical reference: Average conversational speech is 120-150 WPM
    # With pauses, active speech time is typically 60-70% of total time
    
    active_speech_duration = duration_sec
    
    # If audio data provided, calculate actual speaking time (excluding pauses)
    if audio_array is not None and sample_rate is not None:
        pause_count, pause_duration_sec = detect_pauses(audio_array, sample_rate)
        active_speech_duration = max(duration_sec - pause_duration_sec, duration_sec * 0.5)  # Min 50% speech
    
    # Use adaptive word rate based on speech characteristics
    # Base rate: 2.0 words per second of active speech
    # This yields ~120 WPM for normal speech (120 / 60 = 2 words/sec)
    CONVERSATIONAL_WORDS_PER_SECOND = 2.0
    estimated_words = int(active_speech_duration * CONVERSATIONAL_WORDS_PER_SECOND)
    
    # Calculate WPM based on total duration (not active duration)
    # This gives a more realistic "overall" speaking rate
    wpm = (estimated_words / duration_sec) * 60 if duration_sec > 0 else 0
    
    return wpm, estimated_words


def calculate_wpm(word_count: int, duration_sec: float) -> float:
    """
    Calculate words per minute
    
    Args:
        word_count: Total number of words
        duration_sec: Duration in seconds
    
    Returns:
        Words per minute (WPM)
    """
    if duration_sec == 0:
        return 0.0
    return (word_count / duration_sec) * 60


def classify_speaking_rate(wpm: float) -> str:
    """
    Classify speaking rate based on WPM
    Clinical reference ranges:
    - Slow: < 100 WPM
    - Normal: 100-150 WPM
    - Fast: > 150 WPM
    
    Args:
        wpm: Words per minute
    
    Returns:
        Rate classification string
    """
    if wpm < 100:
        return "SLOW"
    elif wpm <= 150:
        return "NORMAL"
    else:
        return "FAST"


def detect_pauses(audio_array: np.ndarray, sample_rate: int, threshold: float = 0.02) -> tuple[int, float]:
    """
    Detect pauses in speech (silence periods)
    
    Args:
        audio_array: Audio waveform as numpy array
        sample_rate: Sample rate in Hz
        threshold: Silence threshold (amplitude below this is considered silence)
    
    Returns:
        Tuple of (pause_count, total_pause_duration_sec)
    """
    # Calculate RMS energy per frame (1024 samples ~23ms @ 44.1kHz)
    frame_size = 1024
    
    # Pad audio to make it divisible by frame_size
    padded_length = ((len(audio_array) + frame_size - 1) // frame_size) * frame_size
    padded_audio = np.pad(audio_array, (0, padded_length - len(audio_array)), mode='constant')
    
    # Calculate energy per frame
    frames = padded_audio.reshape(-1, frame_size)
    energies = np.sqrt(np.mean(frames ** 2, axis=1))
    
    # Normalize energy
    max_energy = np.max(energies) if np.max(energies) > 0 else 1.0
    normalized_energies = energies / max_energy
    
    # Find silence regions
    is_silence = normalized_energies < threshold
    
    # Count pause transitions (silence to speech)
    pause_starts = np.diff(is_silence.astype(int)) == 1
    pause_count = np.sum(pause_starts)
    
    # Calculate pause duration
    pause_duration_sec = np.sum(is_silence) * (frame_size / sample_rate)
    
    return int(pause_count), float(pause_duration_sec)


def downsample_waveform(audio_array: np.ndarray, target_points: int = 3000) -> List[float]:
    """
    Downsample waveform for visualization
    
    Args:
        audio_array: Original audio waveform
        target_points: Target number of points for visualization
    
    Returns:
        Downsampled waveform as list of floats
    """
    if len(audio_array) <= target_points:
        return audio_array.tolist()
    
    factor = max(1, len(audio_array) // target_points)
    return audio_array[::factor].tolist()


@router.post("/rate-of-speech", response_model=RateOfSpeechResponse)
async def analyze_rate_of_speech(request: RateOfSpeechRequest = Body(...)) -> RateOfSpeechResponse:
    """
    Analyze speech rate from audio recording
    
    Supports two assessment types:
    - Rainbow Passage: Standardized 327-word passage, exact WPM calculation
    - Conversational: Spontaneous speech, estimated WPM based on typical rate
    
    Args:
        request: RateOfSpeechRequest containing:
            - type: "rainbow" or "conversational"
            - audio_data: PCM audio samples as list of floats
            - sample_rate: Sample rate in Hz (typically 44100)
            - word_count: Exact word count (for rainbow) or None (for conversational)
    
    Returns:
        RateOfSpeechResponse with:
        - duration_sec: Duration of speech in seconds
        - words_per_minute: Calculated WPM
        - speaking_rate: Classification (SLOW/NORMAL/FAST)
        - estimated_words: Only for conversational mode
        - waveform: Downsampled audio for visualization
        - pause_count: Number of pauses detected
        - pause_duration_sec: Total pause duration
    """
    try:
        # Convert audio data to numpy array
        audio_array = np.array(request.audio_data, dtype=np.float32)
        
        # Calculate duration
        duration_sec = len(audio_array) / request.sample_rate
        
        # Calculate WPM based on assessment type
        if request.type in ["rainbow", "rainbow_passage"]:
            # Rainbow Passage: Use exact word count (327)
            if request.word_count is None:
                request.word_count = 327  # Default to standard passage
            
            wpm = calculate_wpm(request.word_count, duration_sec)
            estimated_words = None
        
        elif request.type == "conversational":
            # Conversational: Estimate based on actual speech activity (excluding pauses)
            wpm, estimated_words = estimate_wpm_from_duration(duration_sec, audio_array, request.sample_rate)
        
        else:
            raise ValueError(f"Invalid assessment type: {request.type}")
        
        # Classify speaking rate
        speaking_rate = classify_speaking_rate(wpm)
        
        # Detect pauses
        pause_count, pause_duration_sec = detect_pauses(audio_array, request.sample_rate)
        
        # Downsample for visualization
        waveform = downsample_waveform(audio_array, target_points=3000)
        
        return RateOfSpeechResponse(
            type=request.type,
            duration_sec=round(duration_sec, 2),
            words_per_minute=round(wpm, 1),
            speaking_rate=speaking_rate,
            estimated_words=estimated_words,
            sampling_rate=request.sample_rate,
            waveform=waveform,
            pause_count=pause_count,
            pause_duration_sec=round(pause_duration_sec, 2)
        )
    
    except Exception as e:
        raise ValueError(f"Error analyzing rate of speech: {str(e)}")