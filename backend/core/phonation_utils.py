import librosa
import numpy as np
from scipy.io import wavfile
import soundfile as sf
import os


def save_audio(file, save_path):
    """Save audio file to disk"""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(file.read())
    return save_path


def extract_duration(file_path):
    """Extract duration from audio file (WAV or similar)"""
    try:
        audio, sr = librosa.load(file_path, sr=None)
        duration = librosa.get_duration(y=audio, sr=sr)
        return round(duration, 2)
    except Exception as e:
        print(f"Duration extraction error: {e}")
        return 0.0


def get_waveform(file_path, max_points=3000):
    """Extract waveform from audio file for visualization"""
    try:
        audio, sr = librosa.load(file_path, sr=None)
        total = len(audio)

        # downsample waveform for frontend plotting
        factor = max(1, total // max_points)
        downsampled = audio[::factor]

        return downsampled.tolist(), sr
    except Exception as e:
        print(f"Waveform extraction error: {e}")
        return [], 16000
