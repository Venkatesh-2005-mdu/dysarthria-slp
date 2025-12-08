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
    <div className="assess-page">
      <header className="assess-header">
        <h1 className="assess-title">Assessment Tasks</h1>
        <p className="assess-sub">
          Select an assessment to begin your evaluation.
        </p>
      </header>

      <div className="assess-grid">
        {tests.map((t, i) => (
          <div
            key={t.id}
            className="assess-card"
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
