import React, { useState, useEffect } from "react";
import "./Patient.css";

/* Assessment page (keeps its sticky header but now shows reference number) */
const AssessmentPage = ({ name, age, gender, reference }) => {
  return (
    <div className="assessment-container">
      <div className="patient-header">
        <div className="patient-header-left">
          <h3 className="ph-name">{name || "—"}</h3>
          <p className="ph-meta">Age: <strong>{age || "-"}</strong></p>
          <p className="ph-meta">Gender: <strong>{gender || "-"}</strong></p>
        </div>

        <div className="patient-header-right">
          <p className="ph-ref">Ref: <strong>{reference}</strong></p>
          <p className="ph-time">Session: <strong>{new Date().toLocaleDateString()}</strong></p>
        </div>
      </div>

      <div className="test-content glass-panel">
        <h2>Dysarthria Assessment Protocol</h2>

        <div className="assessment-section">
          <h3>1. Respiration Assessment</h3>
          <label className="inline-label">Maximum Phonation Time (MPT) on /a/ (seconds):
            <input type="number" placeholder="Seconds" />
          </label>
        </div>

        <div className="assessment-section">
          <h3>2. Phonation Assessment</h3>
          <label className="inline-label">Voice Quality:
            <select>
              <option>Normal</option>
              <option>Breathy</option>
              <option>Strained</option>
              <option>Hoarse</option>
            </select>
          </label>
        </div>

        <div className="assessment-section">
          <h3>3. Articulation Assessment (DDK Rates)</h3>
          <label className="inline-label">Rapid /pʌtʌkʌ/ Repetition (syll/sec):
            <input type="number" placeholder="Syllables/sec" />
          </label>
        </div>

        <div className="assessment-actions">
          <button className="btn btn-primary save-test-button">Save Assessment</button>
          <button className="btn btn-outline">Export Report</button>
        </div>
      </div>
    </div>
  );
};

/* Utility: generate reference like PT-20251205-0246 */
const generateRef = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `PT-${y}${m}${d}-${rand}`;
};

const Patient = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [impression, setImpression] = useState("");
  const [history, setHistory] = useState("");
  const [prevHistory, setPrevHistory] = useState("");
  const [reference, setReference] = useState("");

  // keep a small animation trigger for summary entrance
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      setShowSummary(true);
    }
  }, [isSubmitted]);

  const handleAddPatient = () => {
    if (name && age && gender) {
      if (!reference) setReference(generateRef());
      setIsSubmitted(true);
      setShowSummary(true);
    } else {
      alert("Please fill Name, Age and Gender.");
    }
  };

  const handleStartAssessment = () => {
    setIsTesting(true);
    // ensure reference exists
    if (!reference) setReference(generateRef());
  };

  const renderForm = () => (
    <div className="form-wrapper glass-panel slide-up">
      <h2 className="form-title">Patient Information</h2>

      <div className="form-grid">
        <div className="column-left">
          <div className="patient-detail">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="detail-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="patient-detail">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              className="detail-input"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
            />
          </div>

          <div className="patient-detail">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="detail-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="column-right">
          <div className="patient-detail full-width">
            <label htmlFor="impression">Clinical Impression</label>
            <textarea
              id="impression"
              className="detail-textarea"
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows="3"
            />
          </div>

          <div className="patient-detail full-width">
            <label htmlFor="history">Brief History</label>
            <textarea
              id="history"
              className="detail-textarea"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              rows="3"
            />
          </div>

          <div className="patient-detail full-width">
            <label htmlFor="prevHistory">Previous Medical History</label>
            <textarea
              id="prevHistory"
              className="detail-textarea"
              value={prevHistory}
              onChange={(e) => setPrevHistory(e.target.value)}
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="add-patient-button btn-primary" onClick={handleAddPatient}>
          Add Patient
        </button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="summary-panel glass-panel slide-up-delayed">
      <div className="summary-header">
        <div>
          <h2>Patient Details Saved</h2>
          <p className="ref-line">Reference Number: <strong>{reference}</strong></p>
        </div>
        <div className="summary-meta">
          <p><strong>{name}</strong></p>
          <p>Age: {age} • {gender}</p>
        </div>
      </div>

      <div className="summary-body">
        <div className="summary-block">
          <h4>Clinical Impression</h4>
          <p>{impression || "None recorded"}</p>
        </div>

        <div className="summary-block">
          <h4>Brief History</h4>
          <p>{history || "None recorded"}</p>
        </div>

        <div className="summary-block">
          <h4>Previous Medical History</h4>
          <p>{prevHistory || "None recorded"}</p>
        </div>
      </div>

      <div className="summary-actions">
        <button className="add-patient-button start-test-button btn-primary" onClick={handleStartAssessment}>
          Start Dysarthria Assessment ➜
        </button>

        <button className="add-patient-button back-button btn-outline" onClick={() => setIsSubmitted(false)}>
          Edit Patient Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="patient-page">
      {!isTesting ? (
        <>
          {!isSubmitted ? renderForm() : renderSummary()}
        </>
      ) : (
        <AssessmentPage name={name} age={age} gender={gender} reference={reference} />
      )}
    </div>
  );
};

export default Patient;
