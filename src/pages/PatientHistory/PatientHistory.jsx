import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientHistory.css';

const PatientHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load patient data
    const patients = localStorage.getItem('patients');
    if (patients) {
      const patientsList = JSON.parse(patients);
      const foundPatient = patientsList.find((p) => p.id === patientId);
      if (foundPatient) {
        setPatient(foundPatient);
        setAssessments(foundPatient.assessments || []);
      }
    }
    setLoading(false);
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [patientId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!patient) {
    return (
      <div className="error-state glass-card">
        <h2>Patient Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleStartAssessment = () => {
    // Store the current patient ID so AssessmentHome can access it
    sessionStorage.setItem('currentPatientId', patientId);
    navigate('/assessmenthome');
  };

  const handleViewReport = (assessmentId) => {
    navigate(`/report/${patientId}/${assessmentId}`);
  };

  // Auto-calculate current age
  const dob = new Date(patient.dob);
  const today = new Date();
  let currentAge = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    currentAge--;
  }

  return (
    <div className="history-wrapper">
      {/* Navigation */}
      <nav className="history-navbar">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1 className="nav-title">Patient History</h1>
      </nav>

      {/* Main Content */}
      <div className="history-content">
        {/* Patient Header Card */}
        <div className="patient-header glass-card">
          <div className="header-main">
            <div className="patient-avatar">{patient.name.charAt(0).toUpperCase()}</div>
            <div className="patient-info">
              <h1 className="patient-name">{patient.name}</h1>
              <p className="patient-ref">Ref: {patient.referenceNo}</p>
            </div>
          </div>

          <div className="patient-details-grid">
            <div className="detail-box">
              <span className="detail-label">Current Age</span>
              <span className="detail-value">{currentAge} years</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Gender</span>
              <span className="detail-value">{patient.gender}</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">DOB</span>
              <span className="detail-value">{new Date(patient.dob).toLocaleDateString()}</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Registered</span>
              <span className="detail-value">{patient.registrationDate}</span>
            </div>
          </div>
        </div>

        {/* Clinical Details Section */}
        <div className="clinical-section glass-card">
          <h2 className="section-title">📋 Clinical Details</h2>

          <div className="details-tabs">
            {patient.briefHistory && (
              <div className="detail-tab">
                <h3>Brief History</h3>
                <p>{patient.briefHistory}</p>
              </div>
            )}
            {patient.medicalHistory && (
              <div className="detail-tab">
                <h3>Medical History</h3>
                <p>{patient.medicalHistory}</p>
              </div>
            )}
            {patient.rehabilitationHistory && (
              <div className="detail-tab">
                <h3>Rehabilitation History</h3>
                <p>{patient.rehabilitationHistory}</p>
              </div>
            )}
          </div>
        </div>

        {/* General Status Section (if available) */}
        {patient.generalStatus && Object.values(patient.generalStatus).some((v) => v) && (
          <div className="general-status glass-card">
            <h2 className="section-title">🏥 General Status</h2>

            <div className="status-grid">
              {patient.generalStatus.mentalStatus && (
                <div className="status-item">
                  <h4>Mental Status</h4>
                  <p>{patient.generalStatus.mentalStatus}</p>
                </div>
              )}
              {patient.generalStatus.physicalStatus && (
                <div className="status-item">
                  <h4>Physical Status</h4>
                  <p>{patient.generalStatus.physicalStatus}</p>
                </div>
              )}
              {patient.generalStatus.emotionalStatus && (
                <div className="status-item">
                  <h4>Emotional Status</h4>
                  <p>{patient.generalStatus.emotionalStatus}</p>
                </div>
              )}
              {patient.generalStatus.cognitiveStatus && (
                <div className="status-item">
                  <h4>Cognitive Status</h4>
                  <p>{patient.generalStatus.cognitiveStatus}</p>
                </div>
              )}
              {patient.generalStatus.memory && (
                <div className="status-item">
                  <h4>Memory</h4>
                  <p>{patient.generalStatus.memory}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sensory Profile Section (if available) */}
        {patient.sensoryProfile && Object.values(patient.sensoryProfile).some((v) => v) && (
          <div className="sensory-section glass-card">
            <h2 className="section-title">👁️ 👂 Sensory Profile</h2>

            <div className="sensory-grid">
              {patient.sensoryProfile.hearing && (
                <div className="sensory-item">
                  <h4>👂 Hearing</h4>
                  <p>{patient.sensoryProfile.hearing}</p>
                </div>
              )}
              {patient.sensoryProfile.vision && (
                <div className="sensory-item">
                  <h4>👁️ Vision</h4>
                  <p>{patient.sensoryProfile.vision}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assessments Section */}
        <div className="assessments-section">
          <div className="assessments-header glass-card">
            <h2 className="section-title">📊 Assessment History</h2>
            <button className="btn btn-primary" onClick={handleStartAssessment}>
              ➕ New Assessment
            </button>
          </div>

          {assessments.length === 0 ? (
            <div className="empty-assessments glass-card">
              <div className="empty-icon">📋</div>
              <h4>No Assessments Yet</h4>
              <p>Start a new assessment to track patient progress</p>
              <button className="btn btn-primary" onClick={handleStartAssessment}>
                Begin Assessment
              </button>
            </div>
          ) : (
            <div className="assessments-list">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="assessment-item glass-card">
                  <div className="assessment-header">
                    <h4 className="assessment-type">{assessment.type || 'Assessment'}</h4>
                    <span className="assessment-date">{assessment.date}</span>
                  </div>
                  <div className="assessment-details">
                    <p className="assessment-notes">{assessment.notes || 'No notes'}</p>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewReport(assessment.id)}
                  >
                    📄 View Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
