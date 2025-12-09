"""
Articulation Screener Backend Endpoint
Analyzes articulation test recordings from Tamil words (TAT - Test of Articulation in Tamil)
"""

from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np

router = APIRouter()


class AudioData(BaseModel):
    """Audio data transferred as JSON from frontend"""
    audio_data: List[float]
    sample_rate: int


class WordScore(BaseModel):
    """Scoring for individual word"""
    word_id: int
    english: str
    tamil: str
    ipa: str
    cr: str
    recorded_text: str
    scores: Dict[str, bool]  # S, O, D, A keys
    notes: str
    audio_data: List[float]
    sampling_rate: int


class ArticulationScreenerRequest(BaseModel):
    """Request model for articulation screening"""
    words: List[WordScore]
    patient_age: Optional[int] = None
    patient_type: Optional[str] = None  # child, adult, elderly


class ArticulationScreenerResponse(BaseModel):
    """Response model for articulation screening analysis"""
    total_words: int
    words_recorded: int
    words_with_errors: int
    error_summary: Dict[str, int]  # S, O, D, A counts
    accuracy_percentage: float
    severity_level: str  # mild, moderate, severe
    detailed_analysis: List[Dict]


def analyze_audio_for_distortion(audio_array: np.ndarray, sample_rate: int) -> Dict:
    """
    Analyze audio for voice quality issues (distortion, nasality, etc.)
    Uses spectral analysis to detect potential articulation issues
    
    Args:
        audio_array: Audio waveform
        sample_rate: Sample rate in Hz
    
    Returns:
        Dictionary with analysis results
    """
    # Calculate RMS energy
    rms_energy = np.sqrt(np.mean(audio_array ** 2))
    
    # Calculate spectral centroid (rough measure of brightness)
    fft = np.fft.fft(audio_array)
    frequencies = np.fft.fftfreq(len(audio_array), 1/sample_rate)
    magnitude = np.abs(fft)
    
    # Only positive frequencies
    positive_freq_idx = frequencies > 0
    frequencies = frequencies[positive_freq_idx]
    magnitude = magnitude[positive_freq_idx]
    
    # Spectral centroid
    spectral_centroid = np.sum(frequencies * magnitude) / np.sum(magnitude) if np.sum(magnitude) > 0 else 0
    
    # Spectral bandwidth
    variance = np.sum(((frequencies - spectral_centroid) ** 2) * magnitude) / np.sum(magnitude) if np.sum(magnitude) > 0 else 0
    spectral_bandwidth = np.sqrt(variance)
    
    return {
        "rms_energy": float(rms_energy),
        "spectral_centroid": float(spectral_centroid),
        "spectral_bandwidth": float(spectral_bandwidth),
    }


def calculate_articulation_errors(word_data: WordScore) -> Dict:
    """
    Calculate articulation error types (S/O/D/A)
    
    S = Substitution (wrong sound)
    O = Omission (sound left out)
    D = Distortion (sound malformed)
    A = Addition (extra sound added)
    
    Args:
        word_data: Individual word scoring data
    
    Returns:
        Dictionary with error counts and classifications
    """
    errors = {
        "S": word_data.scores.get("S", False),
        "O": word_data.scores.get("O", False),
        "D": word_data.scores.get("D", False),
        "A": word_data.scores.get("A", False),
    }
    
    total_errors = sum(1 for v in errors.values() if v)
    has_errors = total_errors > 0
    
    return {
        "errors": errors,
        "total_error_count": total_errors,
        "has_errors": has_errors,
    }


def classify_severity(error_count: int, total_words: int) -> str:
    """
    Classify severity level based on error percentage
    
    Args:
        error_count: Total number of words with errors
        total_words: Total number of words tested
    
    Returns:
        Severity classification
    """
    if total_words == 0:
        return "NOT_TESTED"
    
    error_percentage = (error_count / total_words) * 100
    
    if error_percentage <= 10:
        return "MILD"
    elif error_percentage <= 25:
        return "MODERATE"
    else:
        return "SEVERE"


@router.post("/articulation-screener", response_model=ArticulationScreenerResponse)
async def analyze_articulation_screener(
    request: ArticulationScreenerRequest = Body(...)
) -> ArticulationScreenerResponse:
    """
    Comprehensive articulation screening analysis
    
    Analyzes recorded Tamil words (TAT) for articulation errors:
    - Substitutions (S): Sound produced is different from target
    - Omissions (O): Sound is left out completely
    - Distortions (D): Sound is malformed/unclear
    - Additions (A): Extra sound added
    
    Args:
        request: ArticulationScreenerRequest containing word recordings and scores
    
    Returns:
        ArticulationScreenerResponse with error analysis and severity classification
    """
    try:
        total_words = len(request.words)
        words_recorded = sum(1 for w in request.words if len(w.audio_data) > 0)
        
        # Initialize error tracking
        error_summary = {"S": 0, "O": 0, "D": 0, "A": 0}
        detailed_analysis = []
        words_with_errors = 0
        
        # Analyze each word
        for word in request.words:
            word_analysis = {
                "word_id": word.word_id,
                "english": word.english,
                "tamil": word.tamil,
                "ipa": word.ipa,
                "recorded_text": word.recorded_text,
                "notes": word.notes,
                "errors": {},
            }
            
            # Calculate articulation errors
            error_result = calculate_articulation_errors(word)
            word_analysis["errors"] = error_result["errors"]
            
            # Update error summary
            for error_type, has_error in error_result["errors"].items():
                if has_error:
                    error_summary[error_type] += 1
            
            if error_result["has_errors"]:
                words_with_errors += 1
            
            # Analyze audio quality if recording exists
            if len(word.audio_data) > 0 and word.sampling_rate > 0:
                try:
                    audio_array = np.array(word.audio_data, dtype=np.float32)
                    audio_analysis = analyze_audio_for_distortion(audio_array, word.sampling_rate)
                    word_analysis["audio_analysis"] = audio_analysis
                    
                    # If distortion is high, might indicate D (Distortion)
                    if audio_analysis["spectral_bandwidth"] > 2000:  # Threshold
                        word_analysis["audio_quality"] = "DEGRADED"
                    else:
                        word_analysis["audio_quality"] = "CLEAR"
                except Exception as e:
                    word_analysis["audio_analysis"] = {"error": str(e)}
                    word_analysis["audio_quality"] = "UNKNOWN"
            
            detailed_analysis.append(word_analysis)
        
        # Calculate overall metrics
        accuracy_percentage = (
            ((total_words - words_with_errors) / total_words * 100)
            if total_words > 0
            else 0
        )
        
        severity_level = classify_severity(words_with_errors, total_words)
        
        return ArticulationScreenerResponse(
            total_words=total_words,
            words_recorded=words_recorded,
            words_with_errors=words_with_errors,
            error_summary=error_summary,
            accuracy_percentage=round(accuracy_percentage, 1),
            severity_level=severity_level,
            detailed_analysis=detailed_analysis,
        )
    
    except Exception as e:
        raise ValueError(f"Error analyzing articulation screener: {str(e)}")
