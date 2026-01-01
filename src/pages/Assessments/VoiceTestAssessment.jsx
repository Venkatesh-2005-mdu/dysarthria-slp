import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnnotatedWaveformCanvas from "../../components/AnnotatedWaveformCanvas";
import "./VoiceTestAssessment.css";

/**
 * VoiceTestAssessment.jsx
 * Comprehensive voice quality assessment
 * Measures: MPFR, DSI, jitter, shimmer, and overall voice quality
 */

const API_BASE = "http://localhost:8000";

const VOICE_TEST_ITEMS = [
  { id: "a_phonation", label: "A-Phonation", description: "Sustain /A/ at comfortable pitch and loudness" },
  { id: "loud_a", label: "Loud 'A' Phonation", description: "Sustain /A/ at as loud a level as comfortable" },
  { id: "soft_a", label: "Soft A Phonation", description: "Sustain /A/ at as soft a level as possible" },
  { id: "interrupted_a", label: "Interrupted A Phonation", description: "Say /A/ repeatedly with natural breaks" },
  { id: "glide", label: "Glide", description: "Glide from lowest to highest pitch on /A/" },
  { id: "conversation", label: "Conversation", description: "Record a few sentences of natural speech" },
];

const VoiceTestAssessment = () => {
  const navigate = useNavigate();

  // Voice recording state
  const [voiceStateMap, setVoiceStateMap] = useState(() =>
    VOICE_TEST_ITEMS.reduce((acc, item) => {
      acc[item.id] = {
        recording: false,
        audioUrl: null,
        blob: null,
        duration: 0,
        waveform: [],
        samplingRate: 16000,
        isPlaying: false,
        isPaused: false,
      };
      return acc;
    }, {})
  );

  const [clinicalNotes, setClinicalNotes] = useState("");
  const [voiceQualityImpression, setVoiceQualityImpression] = useState("");

  // Refs and timers
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const activeItemRef = useRef(null);
  const timerRef = useRef(null);
  const audioInstancesRef = useRef({});
  const [timer, setTimer] = useState(0);
  const waveformCanvasRefsRef = useRef({});

  // Request microphone permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        streamRef.current = s;
      })
      .catch((err) => {
        console.error("Microphone permission denied", err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /**
   * Analyze audio blob for voice metrics
   */
  const analyzeAudioBlob = async (blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await ac.decodeAudioData(arrayBuffer);
      const data = decoded.getChannelData(0);
      const duration = decoded.duration;
      const sr = decoded.sampleRate;

      // Calculate simple voice metrics
      const rms = Math.sqrt(
        data.reduce((sum, val) => sum + val * val, 0) / data.length
      );

      const minVal = Math.min(...data);
      const maxVal = Math.max(...data);

      // Downsample for display (max 2000 points)
      const maxPoints = 2000;
      const factor = Math.ceil(data.length / maxPoints);
      const downsampled = [];

      for (let i = 0; i < data.length; i += factor) {
        downsampled.push(data[i]);
      }

      return {
        duration: parseFloat(duration.toFixed(2)),
        waveform: downsampled,
        samplingRate: sr,
        metrics: {
          rms: parseFloat(rms.toFixed(4)),
          peakAmplitude: parseFloat(Math.max(Math.abs(minVal), Math.abs(maxVal)).toFixed(4)),
          dynamicRange: parseFloat((maxVal - minVal).toFixed(4)),
        },
      };
    } catch (e) {
      console.error("analyzeAudioBlob error", e);
      return { duration: 0, waveform: [], samplingRate: 16000, metrics: null };
    }
  };

  /**
   * Upload audio to backend for voice analysis
   */
  const uploadToBackend = async (itemId, blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await ac.decodeAudioData(arrayBuffer);
      const audioData = Array.from(decoded.getChannelData(0));
      const sampleRate = decoded.sampleRate;

      const res = await fetch(`${API_BASE}/voice/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_type: itemId,
          audio_data: audioData,
          sample_rate: sampleRate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Voice analysis response:", data);
        // Store backend metrics if available
        setVoiceStateMap((prev) => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            metrics: { ...prev[itemId].metrics, ...data },
          },
        }));
      }
    } catch (err) {
      console.error("Backend upload error:", err);
    }
  };

  /**
   * Start recording for a voice test
   */
  const startRecording = async (itemId) => {
    if (!streamRef.current) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = s;
      } catch (e) {
        console.error("Mic permission denied", e);
        return;
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    chunksRef.current = [];
    activeItemRef.current = itemId;

    const options = { mimeType: "audio/webm" };
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    } catch (e) {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    }

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      const { duration, waveform, samplingRate, metrics } = await analyzeAudioBlob(blob);

      setVoiceStateMap((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          recording: false,
          audioUrl: url,
          blob,
          duration,
          waveform,
          samplingRate,
          metrics,
        },
      }));

      // Reset waveform canvas
      if (waveformCanvasRefsRef.current[itemId]) {
        waveformCanvasRefsRef.current[itemId].resetLiveWaveform();
      }

      // Upload to backend
      uploadToBackend(itemId, blob);

      setTimer(0);
      clearInterval(timerRef.current);
      activeItemRef.current = null;
    };

    mediaRecorderRef.current.start();

    setVoiceStateMap((prev) => ({ ...prev, [itemId]: { ...prev[itemId], recording: true } }));
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 0.1), 100);
  };

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  /**
   * Toggle recording for a voice test
   */
  const toggleRecording = (id) => {
    const cur = voiceStateMap[id]?.recording;
    if (cur) {
      stopRecording();
    } else {
      // If a different test is being recorded, stop it first
      if (activeItemRef.current && activeItemRef.current !== id) {
        stopRecording();
        setTimeout(() => {
          startRecording(id);
        }, 100);
        return;
      }
      startRecording(id);
    }
  };

  /**
   * Handle audio playback with pause/resume functionality
   */
  const handlePlayPause = (itemId) => {
    const meta = voiceStateMap[itemId];
    if (!meta?.audioUrl) return;

    const existingAudio = audioInstancesRef.current[itemId];

    // If audio is already playing or paused
    if (existingAudio) {
      if (meta.isPaused) {
        // Resume from pause
        existingAudio.play();
        setVoiceStateMap((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], isPlaying: true, isPaused: false },
        }));
      } else if (meta.isPlaying) {
        // Pause the audio
        existingAudio.pause();
        setVoiceStateMap((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], isPlaying: false, isPaused: true },
        }));
      }
      return;
    }

    // Create new audio instance
    const audio = new Audio(meta.audioUrl);
    audioInstancesRef.current[itemId] = audio;

    audio.onended = () => {
      setVoiceStateMap((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], isPlaying: false, isPaused: false },
      }));
    };

    audio.play();
    setVoiceStateMap((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], isPlaying: true, isPaused: false },
    }));
  };

  /**
   * Clear recording
   */
  const clearRecording = (itemId) => {
    const audioUrl = voiceStateMap[itemId]?.audioUrl;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setVoiceStateMap((prev) => ({
      ...prev,
      [itemId]: {
        recording: false,
        audioUrl: null,
        blob: null,
        duration: 0,
        waveform: [],
        samplingRate: 16000,
        isPlaying: false,
        isPaused: false,
      },
    }));
  };

  /**
   * Navigation handlers
   */
  const handleFinish = () => {
    navigate("/assessmenthome");
  };

  return (
    <div className="voice-wrapper">
      {/* Premium Navbar */}
      <nav className="voice-navbar">
        <div className="voice-navbar-content">
          <div className="navbar-left">
            <button className="nav-back-btn" onClick={() => navigate("/assessmenthome")}>← Back</button>
            <h2 className="navbar-title">Voice Test</h2>
          </div>
          <div className="navbar-right">
            <div className="nav-progress">
              <span className="progress-label">Step 6 of 6</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="voice-breadcrumb">
        <span onClick={() => navigate("/assessmenthome")} style={{ cursor: "pointer", color: "#3b82f6" }}>Dashboard</span>
        <span className="breadcrumb-sep">›</span>
        <span>Assessments</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Voice Test</span>
      </div>

      {/* Instructions Card */}
      <div className="voice-instructions glass-card">
        <h2 className="instruction-title">Voice Quality Assessment</h2>
        <p className="instruction-text">
          Evaluate voice quality characteristics through sustained phonation and pitch variation tasks. 
          This assessment measures voice parameters including MPFR, DSI (Dysphonia Severity Index), jitter, shimmer, and overall voice quality.
        </p>
        <div className="instruction-tips">
          <div className="tip-item">
            <span className="tip-icon">🎤</span>
            <span>Record resonance sounds naturally without straining</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⚡</span>
            <span>Perform each task at comfortable speed, maintain steady rhythm</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📝</span>
            <span>Add clinical observations as you progress through tests</span>
          </div>
        </div>
      </div>

      {/* VOICE TESTS SECTION */}
      <section className="voice-section">
        <div className="section-header">
          <h2 className="section-title">Voice Quality Recording</h2>
          <p className="section-subtitle">Perform all voice tests for comprehensive analysis</p>
        </div>

        <div className="voice-tests-grid">
          {VOICE_TEST_ITEMS.map((item, idx) => {
            const meta = voiceStateMap[item.id] || {};
            return (
              <div
                key={item.id}
                className="voice-card glass-card"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="card-header">
                  <h3 className="card-title">{item.label}</h3>
                  <div className="card-timer">
                    {meta.recording ? (
                      <>
                        <div className="rec-dot" />
                        {timer.toFixed(1)}s
                      </>
                    ) : meta.duration ? (
                      `${meta.duration}s`
                    ) : (
                      "—"
                    )}
                  </div>
                </div>

                <div className="card-description">{item.description}</div>

                {/* Waveform Display */}
                <div className="card-waveform">
                  <AnnotatedWaveformCanvas
                    ref={(ref) => {
                      if (ref) waveformCanvasRefsRef.current[item.id] = ref;
                    }}
                    waveform={meta.waveform || []}
                    samplingRate={meta.samplingRate || 16000}
                    isRecording={meta.recording}
                  />
                </div>

                {/* Controls */}
                <div className="card-controls">
                  <button
                    className={`btn-record ${meta.recording ? "recording" : ""} ${meta.duration > 0 ? "completed" : ""}`}
                    onClick={() => toggleRecording(item.id)}
                  >
                    {meta.recording ? "🛑 Stop" : meta.duration > 0 ? "🔄 Re-record" : "🎤 Record"}
                  </button>
                  <button
                    className={`btn-play ${meta.audioUrl ? "active" : "disabled"}`}
                    disabled={!meta.audioUrl}
                    onClick={() => handlePlayPause(item.id)}
                  >
                    {meta.isPaused ? "▶️ Resume" : meta.isPlaying ? "⏸️ Pause" : "▶️ Play"}
                  </button>
                  <button
                    className="btn-clear"
                    disabled={!meta.audioUrl}
                    onClick={() => clearRecording(item.id)}
                    title="Clear recording"
                  >
                    🗑 Clear
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CLINICAL OBSERVATIONS SECTION */}
      <section className="voice-section">
        <div className="section-header">
          <h2 className="section-title">Clinical Observations</h2>
          <p className="section-subtitle">Document voice quality findings and impressions</p>
        </div>

        <div className="observations-container">
          <div className="observation-card glass-card">
            <h3 className="card-title">Voice Quality Notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="Document voice quality observations (pitch, quality, breathiness, strain, hoarseness, etc.)"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows="6"
            />
          </div>

          <div className="observation-card glass-card">
            <h3 className="card-title">Overall Impression</h3>
            <textarea
              className="notes-textarea"
              placeholder="Overall voice quality impression and recommendations"
              value={voiceQualityImpression}
              onChange={(e) => setVoiceQualityImpression(e.target.value)}
              rows="6"
            />
          </div>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <section className="voice-section">
        <div className="action-buttons">
          <button className="btn-primary glass-btn" onClick={handleFinish}>
            Save & Return Home
          </button>
        </div>
      </section>
    </div>
  );
};

export default VoiceTestAssessment;
