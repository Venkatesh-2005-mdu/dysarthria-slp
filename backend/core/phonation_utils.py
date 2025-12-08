import librosa
import numpy as np
from scipy.io import wavfile
import soundfile as sf
import os

def save_audio(file, save_path):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(file.read())
    return save_path


def extract_duration(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    duration = librosa.get_duration(y=audio, sr=sr)
    return round(duration, 2)


def get_waveform(file_path, max_points=3000):
    audio, sr = librosa.load(file_path, sr=None)
    total = len(audio)

    # downsample waveform for frontend plotting
    factor = max(1, total // max_points)
    downsampled = audio[::factor]

    return downsampled.tolist(), sr
