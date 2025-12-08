import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PhonationAssessment.css";

/**
 * PhonationTest.jsx
 * Updated: Integrated backend upload to FastAPI:
 * POST http://localhost:8000/phonation/upload/{vowel}
 */

const API_BASE = "http://localhost:8000";

const ITEMS = [
  { id: "a", label: "/a/" },
  { id: "e", label: "/e/" },
  { id: "i", label: "/i/" },
  { id: "o", label: "/o/" },
  { id: "u", label: "/u/" },
  { id: "uhm", label: "uhm" },
  { id: "s", label: "/s/" },
  { id: "z", label: "/z/" },
];

const PhonationAssessment = () => {
  const navigate = useNavigate();
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [stateMap, setStateMap] = useState(() =>
    ITEMS.reduce((acc, it) => {
      acc[it.id] = {
        recording: false,
        audioUrl: null,
        blob: null,
        duration: 0,
        voicedDuration: 0,
        canvasReady: false,
        rmsTimeline: [],
        isPlaying: false,
        backendDuration: null,
        backendWaveform: [],
      };
      return acc;
    }, {})
  );

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const activeItemRef = useRef(null);
  const timerRef = useRef(null);
  const [timer, setTimer] = useState(0);

  // request mic permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        streamRef.current = s;
        setPermissionGranted(true);
      })
      .catch(() => {
        setPermissionGranted(false);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /** -------------------------------
   *  BACKEND UPLOAD FUNCTION
   * ------------------------------- */
  const uploadToBackend = async (itemId, blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, `${itemId}.webm`);

      const res = await fetch(`${API_BASE}/phonation/upload/${itemId}`, {
        method: "POST",
        body: formData,
      });

      const response = await res.json();

      // save backend results
      setStateMap((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          backendDuration: response.duration,
          backendWaveform: response.waveform,
        },
      }));
    } catch (err) {
      console.error("Backend upload failed:", err);
    }
  };

  // start recording for an item
  const startRecording = async (itemId) => {
    if (!streamRef.current) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = s;
        setPermissionGranted(true);
      } catch (e) {
        setPermissionGranted(false);
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

      // local analysis
      const { duration, voicedDuration, rmsTimeline } = await analyzeAudioBlob(blob);

      // update UI state
      setStateMap((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          recording: false,
          audioUrl: url,
          blob,
          duration,
          voicedDuration,
          rmsTimeline,
          canvasReady: true,
        },
      }));

      // upload to backend 🟢
      uploadToBackend(itemId, blob);

      setTimer(0);
      clearInterval(timerRef.current);
      activeItemRef.current = null;
    };

    mediaRecorderRef.current.start();
    setStateMap((prev) => ({ ...prev, [itemId]: { ...prev[itemId], recording: true } }));
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 0.1), 100);
  };

  // stop recording
  const stopRecording = (itemId) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleRecording = (id) => {
    const cur = stateMap[id]?.recording;
    if (cur) stopRecording(id);
    else startRecording(id);
  };

  async function analyzeAudioBlob(blob) {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await ac.decodeAudioData(arrayBuffer);
      const sampleRate = decoded.sampleRate;
      const data = decoded.getChannelData(0);
      const duration = decoded.duration;

      const frameMs = 30;
      const frameSize = Math.floor((frameMs / 1000) * sampleRate) || 512;
      const hop = frameSize;

      const rmsTimeline = [];
      let voicedFrames = [];
      for (let i = 0; i < data.length; i += hop) {
        const frame = data.subarray(i, Math.min(i + frameSize, data.length));
        let sum = 0;
        for (let j = 0; j < frame.length; j++) sum += frame[j] * frame[j];
        const rms = Math.sqrt(sum / (frame.length || 1));
        rmsTimeline.push(rms);
      }

      const sorted = [...rmsTimeline].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] || 0;
      const threshold = Math.max(median * 2.2, 0.0025);

      let voicedDuration = 0;
      for (let k = 0; k < rmsTimeline.length; k++) {
        if (rmsTimeline[k] >= threshold) voicedDuration += frameMs / 1000;
      }

      if (voicedDuration > duration) voicedDuration = duration;

      return {
        duration: parseFloat(duration.toFixed(2)),
        voicedDuration: parseFloat(voicedDuration.toFixed(2)),
        rmsTimeline,
      };
    } catch (e) {
      console.error("analyzeAudioBlob error", e);
      return { duration: 0, voicedDuration: 0, rmsTimeline: [] };
    }
  }

  async function drawWaveform(canvas, blob) {
    if (!canvas || !blob) return;
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await ac.decodeAudioData(arrayBuffer);
      const data = decoded.getChannelData(0);
      const width = canvas.width;
      const height = canvas.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "#1d3c6a";
      ctx.beginPath();

      const step = Math.ceil(data.length / width);
      for (let i = 0; i < width; i++) {
        const start = i * step;
        let sum = 0, count = 0;
        for (let j = 0; j < step && start + j < data.length; j++) {
          sum += Math.abs(data[start + j]);
          count++;
        }
        const v = count ? sum / count : 0;
        const y = (1 - Math.min(1, v * 10)) * height;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(20,30,50,0.06)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } catch (e) {
      console.error("drawWaveform error", e);
    }
  }

  useEffect(() => {
    ITEMS.forEach((it) => {
      const meta = stateMap[it.id];
      if (meta && meta.blob && meta.canvasReady) {
        const canvas = document.getElementById(`canvas-${it.id}`);
        if (canvas) {
          drawWaveform(canvas, meta.blob);
        }
      }
    });
  }, [stateMap]);

  const handlePlay = async (id) => {
    const meta = stateMap[id];
    if (!meta?.audioUrl) return;
    const audio = new Audio(meta.audioUrl);
    setStateMap((prev) => ({ ...prev, [id]: { ...prev[id], isPlaying: true } }));
    audio.onended = () => {
      setStateMap((prev) => ({ ...prev, [id]: { ...prev[id], isPlaying: false } }));
    };
    audio.play();
  };

  const getSZRatio = () => {
    const s = stateMap["s"]?.voicedDuration || stateMap["s"]?.duration || 0;
    const z = stateMap["z"]?.voicedDuration || stateMap["z"]?.duration || 0;
    if (s === 0 || z === 0) return null;
    return parseFloat((s / z).toFixed(2));
  };

  const handleFinish = () => {
    navigate("/assessmenthome");
  };

  return (
    <div className="assess-page">
      <header className="assess-header">
        <h1 className="assess-title">Phonation Test</h1>
        <p className="assess-sub">
          Record vowels and s/z to compute MPD and S/Z ratio. Each card is 1 recording item.
        </p>
      </header>

      <div className="assess-grid phonation-grid">
        {ITEMS.map((it, idx) => {
          const meta = stateMap[it.id] || {};
          return (
            <div key={it.id} className="assess-card phonation-card" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="assess-card-body">
                <div className="card-head">
                  <h3 className="assess-card-title">{it.label}</h3>
                  <div className="rec-indicators">
                    {meta.recording && <div className="rec-dot" aria-hidden="true" />}
                    <div className="rec-timer">
                      {meta.recording ? `${timer.toFixed(1)}s` : meta.duration ? `${meta.duration}s` : "—"}
                    </div>
                  </div>
                </div>

                <div className="wave-row">
                  <canvas id={`canvas-${it.id}`} className="wave-canvas" width="600" height="80" />
                </div>

                <div className="controls-row">
                  <button
                    className={`rec-btn ${meta.recording ? "rec-active" : ""}`}
                    onClick={() => toggleRecording(it.id)}
                  >
                    {meta.recording ? "Stop" : "Record"}
                  </button>

                  <button className="play-btn" disabled={!meta.audioUrl} onClick={() => handlePlay(it.id)}>
                    Play
                  </button>

                  <div className="result-block">
                    <div className="result-line"><strong>File:</strong> {meta.blob ? <span className="good">Ready</span> : "—"}</div>
                    <div className="result-line"><strong>Duration:</strong> {meta.duration ? `${meta.duration}s` : "—"}</div>
                    <div className="result-line"><strong>Voiced (MPD):</strong> {meta.voicedDuration ? `${meta.voicedDuration}s` : "—"}</div>
                    <div className="result-line"><strong>Backend MPD:</strong> {meta.backendDuration ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="phonation-summary">
        <div className="sz-block">
          <h4>S / Z Summary</h4>
          <div className="sz-row">
            <div><strong>/s/:</strong> {stateMap["s"]?.voicedDuration ?? "—"}s</div>
            <div><strong>/z/:</strong> {stateMap["z"]?.voicedDuration ?? "—"}s</div>
            <div><strong>Ratio (S/Z):</strong> {getSZRatio() ?? "—"}</div>
          </div>
        </div>

        <div className="actions-row">
          <button className="primary-button" onClick={handleFinish}>
            Save & Return to Assessment Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhonationAssessment;
