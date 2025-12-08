import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPatient.css";

// -------------------- HEADER --------------------
const ResponsiveHeader = ({ name, age, gender }) => {
  return (
    <div className="patient-header">
      <h3>Patient: {name}</h3>
      <h3>Age: {age}</h3>
      <h3>Gender: {gender}</h3>
    </div>
  );
};

// -------------------- STATUS PAGE --------------------
const StatusPage = ({ name, age, gender, onNext }) => {
  const [mentalStatus, setMentalStatus] = useState("");
  const [physicalStatus, setPhysicalStatus] = useState("");
  const [emotionalStatus, setEmotionalStatus] = useState("");
  const [cognitiveStatus, setCognitiveStatus] = useState("");
  const [memory, setMemory] = useState("");

  return (
    <div className="status-container">
      <ResponsiveHeader name={name} age={age} gender={gender} />

      <div className="content-area">
        <h2 className="title">Clinical Status Assessment</h2>

        <div className="assessment-section">
          <h3 className="section-title">Mental Status</h3>
          <textarea
            rows="4"
            value={mentalStatus}
            onChange={(e) => setMentalStatus(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <div className="assessment-section">
          <h3 className="section-title">Physical Status</h3>
          <textarea
            rows="4"
            value={physicalStatus}
            onChange={(e) => setPhysicalStatus(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <div className="assessment-section">
          <h3 className="section-title">Emotional Status</h3>
          <textarea
            rows="4"
            value={emotionalStatus}
            onChange={(e) => setEmotionalStatus(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <div className="assessment-section">
          <h3 className="section-title">Cognitive Status</h3>
          <textarea
            rows="4"
            value={cognitiveStatus}
            onChange={(e) => setCognitiveStatus(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <div className="assessment-section">
          <h3 className="section-title">Memory</h3>
          <textarea
            rows="4"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <button className="primary-button" onClick={onNext}>
          Next: Sensory Assessment ➡
        </button>
      </div>
    </div>
  );
};

// -------------------- SENSORY ASSESSMENT --------------------
const AssessmentPage = ({ name, age, gender }) => {
  const navigate = useNavigate();
  const [hearingInput, setHearingInput] = useState("");
  const [visionInput, setVisionInput] = useState("");

  const handleSave = () => {
    // navigate to YOUR route (explicitly use the path you provided)
    navigate("/assessmenthome");
  };

  return (
    <div className="assessment-container">
      <ResponsiveHeader name={name} age={age} gender={gender} />

      <div className="content-area">
        <h2 className="title">Sensory Assessment</h2>

        <div className="assessment-section">
          <h3 className="section-title">Hearing Status</h3>
          <textarea
            rows="4"
            value={hearingInput}
            onChange={(e) => setHearingInput(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <div className="assessment-section">
          <h3 className="section-title">Vision Status</h3>
          <textarea
            rows="4"
            value={visionInput}
            onChange={(e) => setVisionInput(e.target.value)}
            className="detail-textarea"
          />
        </div>

        <button className="primary-button save-test-button" onClick={handleSave}>
          Save Assessment ✔
        </button>
      </div>
    </div>
  );
};

// -------------------- MAIN ADD PATIENT --------------------
const AddPatient = () => {
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStatusScreen, setIsStatusScreen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [impression, setImpression] = useState("");
  const [history, setHistory] = useState("");
  const [prevHistory, setPrevHistory] = useState("");

  const startSensoryAssessment = () => {
    setIsTesting(true);
  };

  const handleAddPatient = () => {
    if (name && age) {
      setIsSubmitted(true);
    }
  };

  const renderForm = () => (
    <div className="content-area">
      <h2 className="title">Patient Information</h2>

      <div className="form-grid">
        <div className="column-left">
          <div className="patient-detail">
            <label>Name:</label>
            <input
              type="text"
              className="detail-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="patient-detail">
            <label>Age:</label>
            <input
              type="number"
              className="detail-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="patient-detail">
            <label>Gender:</label>
            <select
              className="detail-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="column-right">
          <div className="patient-detail full-width">
            <label>Clinical Impression:</label>
            <textarea
              className="detail-textarea"
              rows="3"
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
            />
          </div>

          <div className="patient-detail full-width">
            <label>Brief History:</label>
            <textarea
              className="detail-textarea"
              rows="3"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
            />
          </div>

          <div className="patient-detail full-width">
            <label>Previous Medical History:</label>
            <textarea
              className="detail-textarea"
              rows="3"
              value={prevHistory}
              onChange={(e) => setPrevHistory(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="primary-button" onClick={handleAddPatient}>
        Add Patient
      </button>
    </div>
  );

  const renderSummary = () => (
    <div className="patient-summary content-area">
      <h2 className="title">Patient Details Saved!</h2>

      <div><strong>Name:</strong> {name}</div>
      <div><strong>Age:</strong> {age}</div>
      <div><strong>Gender:</strong> {gender}</div>

      <div><strong>Clinical Impression:</strong><p>{impression}</p></div>
      <div><strong>Brief History:</strong><p>{history}</p></div>
      <div><strong>Prev Medical History:</strong><p>{prevHistory}</p></div>

      <div className="summary-actions">
        <button
          className="primary-button"
          onClick={() => setIsStatusScreen(true)}
        >
          Next ➡
        </button>

        <button
          className="secondary-button"
          onClick={() => setIsSubmitted(false)}
        >
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <div className="patient-card">
      {isTesting ? (
        <AssessmentPage name={name} age={age} gender={gender} />
      ) : isStatusScreen ? (
        <StatusPage
          name={name}
          age={age}
          gender={gender}
          onNext={startSensoryAssessment}
        />
      ) : isSubmitted ? (
        renderSummary()
      ) : (
        renderForm()
      )}
    </div>
  );
};

export default AddPatient;
