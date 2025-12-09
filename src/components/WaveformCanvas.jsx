import React, { useEffect, useRef } from "react";
import "./WaveformCanvas.css";

/**
 * WaveformCanvas Component
 * Displays waveform with frequency spectrum overlay
 * Real-time updates during recording
 */
const WaveformCanvas = ({ blob, waveform = [], samplingRate = 16000, isRecording = false }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Draw waveform with frequency spectrum overlay
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = "rgba(15, 50, 88, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = "rgba(20, 30, 50, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (waveform.length === 0) {
      // Draw placeholder text
      ctx.fillStyle = "#9ca3af";
      ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Waiting for audio...", width / 2, height / 2);
      return;
    }

    // Draw waveform (main visualization)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1d3c6a";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    const step = Math.ceil(waveform.length / width);
    let isFirstPoint = true;

    for (let i = 0; i < width; i++) {
      const startIdx = i * step;
      let sum = 0;
      let count = 0;

      for (let j = 0; j < step && startIdx + j < waveform.length; j++) {
        sum += Math.abs(waveform[startIdx + j] || 0);
        count++;
      }

      const avgAmplitude = count ? sum / count : 0;
      const clampedAmplitude = Math.min(1, avgAmplitude * 4); // Scale for visibility
      const y = (1 - clampedAmplitude) * height;

      if (isFirstPoint) {
        ctx.moveTo(i, y);
        isFirstPoint = false;
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();

    // Draw frequency spectrum overlay (simplified visualization)
    drawFrequencySpectrum(ctx, waveform, width, height);
  }, [waveform, isRecording]);

  const drawFrequencySpectrum = (ctx, waveform, width, height) => {
    if (waveform.length < 512) return;

    // Compute FFT buckets (simplified - using simple frequency band visualization)
    const bandCount = 32;
    const buckets = new Array(bandCount).fill(0);

    // Divide waveform into frequency-like bands (simplified)
    for (let i = 0; i < waveform.length; i++) {
      const bandIdx = Math.floor((i / waveform.length) * bandCount);
      buckets[bandIdx] += Math.abs(waveform[i] || 0);
    }

    // Normalize buckets
    const maxBucket = Math.max(...buckets);
    for (let i = 0; i < buckets.length; i++) {
      buckets[i] = maxBucket > 0 ? buckets[i] / maxBucket : 0;
    }

    // Draw frequency spectrum bars (faded, under waveform)
    const barWidth = width / bandCount;
    ctx.fillStyle = "rgba(29, 60, 106, 0.08)";

    for (let i = 0; i < bandCount; i++) {
      const barHeight = buckets[i] * (height / 2);
      const x = i * barWidth;
      const y = height / 2 - barHeight / 2;

      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  };

  return (
    <div className="waveform-canvas-container">
      <canvas
        ref={canvasRef}
        className="waveform-canvas"
        width={600}
        height={100}
      />
      {isRecording && (
        <div className="waveform-recording-indicator">
          Recording...
        </div>
      )}
    </div>
  );
};

export default WaveformCanvas;
