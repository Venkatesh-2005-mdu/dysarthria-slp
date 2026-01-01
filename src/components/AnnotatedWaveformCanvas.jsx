import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import "./AnnotatedWaveformCanvas.css";

/**
 * AnnotatedWaveformCanvas Component
 * Displays raw bipolar waveform with optional syllable annotations
 * Supports Base64 PNG export functionality
 * Supports real-time waveform display during recording
 */
const AnnotatedWaveformCanvas = forwardRef(({
  waveform = [],
  samplingRate = 16000,
  syllablesData = [],
  timestampsData = [],
  showExportButtons = false,
  isRecording = false,
}, ref) => {
  const canvasRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const liveWaveformRef = useRef([]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    updateLiveWaveform,
    resetLiveWaveform,
    getLiveWaveform: () => liveWaveformRef.current,
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use live waveform during recording, otherwise use provided waveform
    const displayWaveform = isRecording ? liveWaveformRef.current : waveform;
    makeWaveform(displayWaveform, samplingRate, syllablesData, timestampsData, ctx, canvas);
  }, [waveform, samplingRate, syllablesData, timestampsData, isRecording]);

  const makeWaveform = (audio, sr, syllables, timestamps, ctx, canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw grid background
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    if (audio.length === 0) {
      // Show placeholder text
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No audio data", width / 2, centerY);
      return;
    }

    // Draw waveform with bipolar display
    const pixelsPerSample = width / audio.length;
    const maxAmplitude = Math.max(...audio.map(Math.abs)) || 1;

    ctx.strokeStyle = "#30a5d7ff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < audio.length; i++) {
      const x = i * pixelsPerSample;
      const normalizedAmplitude = audio[i] / maxAmplitude;
      const clampedAmplitude = Math.max(-0.95, Math.min(0.95, normalizedAmplitude * 3));
      const y = centerY - clampedAmplitude * (centerY * 0.9);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Use solid black color for waveform
    ctx.strokeStyle = "#2178dcff";
    ctx.stroke();

    // Draw syllable annotations if provided
    if (syllables.length > 0 && timestamps.length > 0) {
      const totalDuration = audio.length / sr;
      const pixelsPerSecond = width / totalDuration;

      timestamps.forEach((timestamp, idx) => {
        const x = timestamp * pixelsPerSecond;

        // Draw vertical line
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Draw syllable label
        const syllable = syllables[idx] || "";
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(syllable, x, 5);
      });
    }

    // Draw time axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const duration = audio.length / sr;
    const step = duration <= 2 ? 0.5 : duration <= 5 ? 1 : 2;

    for (let t = 0; t <= duration; t += step) {
      const x = (t / duration) * width;
      ctx.fillText(`${t.toFixed(1)}s`, x, height - 15);
    }
  };

  const exportToBase64 = () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];

      // Copy to clipboard
      navigator.clipboard.writeText(base64).then(() => {
        alert("Base64 PNG copied to clipboard!");
        setIsExporting(false);
      });
    } catch (err) {
      console.error("Error exporting waveform:", err);
      setIsExporting(false);
    }
  };

  const downloadAsPNG = () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png");
      link.download = `waveform-${Date.now()}.png`;
      link.click();
      setIsExporting(false);
    } catch (err) {
      console.error("Error downloading waveform:", err);
      setIsExporting(false);
    }
  };

  /**
   * Update live waveform data during recording
   * Call this method from parent component as audio chunks arrive
   * Waveform scrolls horizontally from left to right slowly
   */
  const updateLiveWaveform = (audioChunk) => {
    if (Array.isArray(audioChunk) && audioChunk.length > 0) {
      // Downsample the incoming chunk to slow down the scrolling
      // Take every 3rd sample to reduce the rate of waveform movement
      const downsampledChunk = [];
      for (let i = 0; i < audioChunk.length; i += 3) {
        downsampledChunk.push(audioChunk[i]);
      }

      // Add downsampled samples to the buffer
      liveWaveformRef.current.push(...downsampledChunk);

      // Keep more samples to show longer recording duration on screen
      // This creates a slower scrolling effect
      const maxSamples = 12000;  // Shows ~0.75 seconds of audio at a time
      if (liveWaveformRef.current.length > maxSamples) {
        // Remove oldest samples, keep newest ones
        liveWaveformRef.current = liveWaveformRef.current.slice(-maxSamples);
      }

      // Immediately redraw the canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          drawLiveWaveform(liveWaveformRef.current, samplingRate, ctx, canvas);
        }
      }
    }
  };

  /**
   * Optimized drawing for live waveform (scrolling effect)
   */
  const drawLiveWaveform = (audio, sr, ctx, canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw grid background
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    if (audio.length === 0) {
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No audio data", width / 2, centerY);
      return;
    }

    // Draw waveform - map samples across full canvas width
    const pixelsPerSample = width / audio.length;
    const maxAmplitude = Math.max(...audio.map(Math.abs)) || 1;

    ctx.strokeStyle = "#2178dcff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < audio.length; i++) {
      const x = i * pixelsPerSample;
      const normalizedAmplitude = audio[i] / maxAmplitude;
      const clampedAmplitude = Math.max(-0.95, Math.min(0.95, normalizedAmplitude * 3));
      const y = centerY - clampedAmplitude * (centerY * 0.9);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw recording indicator with elapsed time
    if (audio.length > 0) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      // Calculate actual elapsed time from sample count
      const estimatedDuration = (audio.length / sr).toFixed(1);
      ctx.fillText(`● Recording ${estimatedDuration}s`, width - 10, 10);
    }
  };

  /**
   * Reset live waveform (call when recording stops)
   */
  const resetLiveWaveform = () => {
    liveWaveformRef.current = [];
  };

  return (
    <div className="annotated-waveform-container">
      <div className="waveform-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        />
      </div>

      {showExportButtons && (
        <div className="waveform-controls">
          <button
            className="btn-export"
            onClick={exportToBase64}
            disabled={isExporting || waveform.length === 0}
          >
            {isExporting ? "Exporting..." : "📋 Copy Base64"}
          </button>
          <button
            className="btn-export"
            onClick={downloadAsPNG}
            disabled={isExporting || waveform.length === 0}
          >
            {isExporting ? "Downloading..." : "💾 Download PNG"}
          </button>
        </div>
      )}
    </div>
  );
});

AnnotatedWaveformCanvas.displayName = "AnnotatedWaveformCanvas";

export default AnnotatedWaveformCanvas;

// Export methods for external use
AnnotatedWaveformCanvas.updateLiveWaveform = null;
AnnotatedWaveformCanvas.resetLiveWaveform = null;
