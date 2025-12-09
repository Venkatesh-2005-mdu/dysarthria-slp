import React from "react";
import { useNavigate } from "react-router-dom";
import "./AssessmentHome.css";

export default function AssessmentHome() {
  const navigate = useNavigate();

  const tests = [
    {
      id: "respiratory",
      title: "Respiratory System Test",
      desc: "Breathing pattern, non-speech tasks & blowing speed."
    },
    {
      id: "phonation",
      title: "Phonation Test",
      desc: "Maximum phonation duration & S/Z ratio evaluation."
    },
    {
      id: "resonance",
      title: "Resonance & Articulation Test",
      desc: "Resonance, DDK (AMR/SMR) and articulation evaluation."
    },
    {
      id: "rateofspeech",
      title: "Rate of Speech Test",
      desc: "Reading speed & speaking rate per minute."
    },
    {
      id: "articulation",
      title: "Articulation Screener (TAT)",
      desc: "Target articulation test for speech clarity."
    },
    {
      id: "voice",
      title: "Voice Test",
      desc: "MPFR, DSI, jitter, shimmer & voice quality measures."
    }
  ];

  return (
    <div className="assess-wrapper">
      {/* Premium Navbar */}
      <nav className="assess-navbar">
        <div className="navbar-left">
          <button className="nav-back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h2 className="navbar-title">Assessment Tasks</h2>
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      <div className="assess-breadcrumb">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Assessments</span>
      </div>

      {/* Instructions Card */}
      <div className="assess-instructions glass-card">
        <div className="instructions-header">
          <h3 className="instructions-title">Select Your Assessment</h3>
        </div>
        <p className="instructions-subtitle">
          Choose from our comprehensive suite of speech-language pathology assessments. Each test provides detailed metrics for clinical evaluation.
        </p>
      </div>

      <div className="assess-grid">
        {tests.map((t, i) => (
          <div
            key={t.id}
            className="assess-card glass-card"
            style={{ animationDelay: `${i * 120}ms` }}
            onClick={() => navigate(`/assess/${t.id}`)}
          >
            <h3 className="assess-card-title">{t.title}</h3>
            <p className="assess-card-desc">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
