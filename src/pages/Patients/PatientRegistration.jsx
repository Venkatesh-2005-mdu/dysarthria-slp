import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientRegistration.css';
import InteractiveMouth from './InteractiveMouth';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [patients, setPatients] = useState([]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Step 1: Basic Details
  const [basicDetails, setBasicDetails] = useState({
    name: '',
    gender: '',
    dob: '',
    age: '',
    referenceNo: '',
    briefHistory: '',
    medicalHistory: '',
    rehabilitationHistory: '',
  });

  // Step 2: General Status (if age > 15)
  const [generalStatus, setGeneralStatus] = useState({
    mentalStatus: '',
    physicalStatus: '',
    emotionalStatus: '',
    cognitiveStatus: '',
    memory: '',
  });

  // Step 3: Sensory Profile
  const [sensoryProfile, setSensoryProfile] = useState({
    hearing: '',
    vision: '',
  });

  // Step 4: Oral Cavity (handled by InteractiveMouth component)
  const [oralCavity, setOralCavity] = useState({});

  const handleBasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate age
      if (name === 'dob' && value) {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        updated.age = age.toString();
      }
      return updated;
    });
  };

  const handleGeneralStatusChange = (e) => {
    const { name, value } = e.target;
    setGeneralStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleSensoryProfileChange = (e) => {
    const { name, value } = e.target;
    setSensoryProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (
        !basicDetails.name ||
        !basicDetails.gender ||
        !basicDetails.dob ||
        !basicDetails.referenceNo
      ) {
        alert('Please fill in all required basic details');
        return;
      }
    }
    if (currentStep === 2 && parseInt(basicDetails.age) > 15) {
      if (
        !generalStatus.mentalStatus ||
        !generalStatus.physicalStatus ||
        !generalStatus.emotionalStatus ||
        !generalStatus.cognitiveStatus ||
        !generalStatus.memory
      ) {
        alert('Please fill in all general status fields');
        return;
      }
    }
    if (currentStep === 3) {
      if (!sensoryProfile.hearing || !sensoryProfile.vision) {
        alert('Please fill in sensory profile details');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Load existing patients
    const existingPatients = localStorage.getItem('patients');
    const patientsList = existingPatients ? JSON.parse(existingPatients) : [];

    // Create new patient object
    const newPatient = {
      id: Date.now().toString(),
      ...basicDetails,
      generalStatus,
      sensoryProfile,
      oralCavity,
      registrationDate: new Date().toLocaleDateString(),
      assessments: [],
      reports: [],
    };

    // Add to patients list
    patientsList.push(newPatient);
    localStorage.setItem('patients', JSON.stringify(patientsList));

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const showGeneralStatus = parseInt(basicDetails.age) > 15;

  return (
    <div className="registration-wrapper">
      {/* Navigation */}
      <nav className="registration-navbar">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="nav-title">Patient Registration</h1>
        </div>
        <div className="step-indicator">
          Step {currentStep} of {showGeneralStatus ? 4 : 3}
        </div>
      </nav>

      {/* Main Content */}
      <div className="registration-content">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="form-step glass-card">
            <h2 className="step-title">📋 Basic Patient Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="name"
                  value={basicDetails.name}
                  onChange={handleBasicDetailsChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={basicDetails.gender}
                  onChange={handleBasicDetailsChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={basicDetails.dob}
                  onChange={handleBasicDetailsChange}
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={basicDetails.age}
                  readOnly
                  placeholder="Auto-calculated"
                />
              </div>

              <div className="form-group">
                <label>Reference No. *</label>
                <input
                  type="text"
                  name="referenceNo"
                  value={basicDetails.referenceNo}
                  onChange={handleBasicDetailsChange}
                  placeholder="e.g., PT-001"
                />
              </div>

              <div className="form-group full-width">
                <label>Brief History</label>
                <textarea
                  name="briefHistory"
                  value={basicDetails.briefHistory}
                  onChange={handleBasicDetailsChange}
                  placeholder="Enter brief history"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Medical History</label>
                <textarea
                  name="medicalHistory"
                  value={basicDetails.medicalHistory}
                  onChange={handleBasicDetailsChange}
                  placeholder="Enter medical history"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Rehabilitation History</label>
                <textarea
                  name="rehabilitationHistory"
                  value={basicDetails.rehabilitationHistory}
                  onChange={handleBasicDetailsChange}
                  placeholder="Enter rehabilitation history"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: General Status (only if age > 15) */}
        {currentStep === 2 && showGeneralStatus && (
          <div className="form-step glass-card">
            <div className="patient-header">
              <h2 className="step-title">👤 {basicDetails.name}</h2>
              <div className="patient-badges">
                <span className="badge">{basicDetails.age} yrs</span>
                <span className="badge">{basicDetails.gender}</span>
              </div>
            </div>

            <h3 className="section-subtitle">🏥 General Status</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Mental Status</label>
                <textarea
                  name="mentalStatus"
                  value={generalStatus.mentalStatus}
                  onChange={handleGeneralStatusChange}
                  placeholder="Enter mental status observations"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Physical Status</label>
                <textarea
                  name="physicalStatus"
                  value={generalStatus.physicalStatus}
                  onChange={handleGeneralStatusChange}
                  placeholder="Enter physical status observations"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Emotional Status</label>
                <textarea
                  name="emotionalStatus"
                  value={generalStatus.emotionalStatus}
                  onChange={handleGeneralStatusChange}
                  placeholder="Enter emotional status observations"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Cognitive Status</label>
                <textarea
                  name="cognitiveStatus"
                  value={generalStatus.cognitiveStatus}
                  onChange={handleGeneralStatusChange}
                  placeholder="Enter cognitive status observations"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Memory</label>
                <textarea
                  name="memory"
                  value={generalStatus.memory}
                  onChange={handleGeneralStatusChange}
                  placeholder="Enter memory observations"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                ← Previous
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2/3: Sensory Profile */}
        {currentStep === (showGeneralStatus ? 3 : 2) && (
          <div className="form-step glass-card">
            <div className="patient-header">
              <h2 className="step-title">👤 {basicDetails.name}</h2>
              <div className="patient-badges">
                <span className="badge">{basicDetails.age} yrs</span>
                <span className="badge">{basicDetails.gender}</span>
              </div>
            </div>

            <h3 className="section-subtitle">👁️ 👂 Sensory Profile</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Hearing</label>
                <textarea
                  name="hearing"
                  value={sensoryProfile.hearing}
                  onChange={handleSensoryProfileChange}
                  placeholder="Enter hearing observations"
                  rows="4"
                />
              </div>

              <div className="form-group full-width">
                <label>Vision</label>
                <textarea
                  name="vision"
                  value={sensoryProfile.vision}
                  onChange={handleSensoryProfileChange}
                  placeholder="Enter vision observations"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                ← Previous
              </button>
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3/4: Oral Cavity (Placeholder) */}
        {currentStep === (showGeneralStatus ? 4 : 3) && (
          <div className="form-step glass-card">
            <div className="patient-header">
              <h2 className="step-title">👤 {basicDetails.name}</h2>
              <div className="patient-badges">
                <span className="badge">{basicDetails.age} yrs</span>
                <span className="badge">{basicDetails.gender}</span>
              </div>
            </div>

            <h3 className="section-subtitle">👄 Oral Cavity Structure</h3>
            <InteractiveMouth onDataChange={(data) => setOralCavity(data)} />

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                ← Previous
              </button>
              <button className="btn btn-success" onClick={handleFinish}>
                ✓ Complete Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRegistration;
