import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewDashboard.css';

const NewDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [slpName, setSLPName] = useState(localStorage.getItem('slpName') || 'SLP');

  useEffect(() => {
    // Load patients from localStorage
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, []);

  useEffect(() => {
    // Filter patients based on search
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.referenceNo.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, patients]);

  const handleAddPatient = () => {
    navigate('/patient-registration');
  };

  const handlePatientHistory = (patientId) => {
    navigate(`/patient-history/${patientId}`);
  };

  const handleStartAssessment = (patientId) => {
    navigate(`/assessments/${patientId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('slpName');
    navigate('/');
  };

  const handleSLPProfile = () => {
    navigate('/slp-profile');
  };

  return (
    <div className="new-dashboard-wrapper">
      {/* Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="nav-left">
          <h1 className="nav-brand">🏥 SLP Assessment</h1>
        </div>
        <div className="nav-right">
          <span className="slp-name">Welcome, {slpName}</span>
          <button className="nav-btn nav-profile" onClick={handleSLPProfile}>
            👤 Profile
          </button>
          <button className="nav-btn nav-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Hero Section */}
        <div className="hero-section glass-card">
          <div className="hero-content">
            <h2 className="hero-title">Patient Management</h2>
            <p className="hero-subtitle">
              Manage patient assessments and track progress
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddPatient}
          >
            ➕ Add New Patient
          </button>
        </div>

        {/* Search Section */}
        <div className="search-section glass-card">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by patient name or reference ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Patients Section */}
        <div className="patients-section">
          <h3 className="section-title">Patient History</h3>

          {filteredPatients.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-icon">📋</div>
              <h4>No Patients Found</h4>
              <p>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Create your first patient to get started'}
              </p>
            </div>
          ) : (
            <div className="patients-grid">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="patient-card glass-card">
                  <div className="card-header">
                    <div className="patient-avatar">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="patient-info">
                      <h4 className="patient-name">{patient.name}</h4>
                      <p className="patient-ref">Ref: {patient.referenceNo}</p>
                    </div>
                  </div>

                  <div className="card-details">
                    <div className="detail-item">
                      <span className="detail-label">Age</span>
                      <span className="detail-value">{patient.age} yrs</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Gender</span>
                      <span className="detail-value">{patient.gender}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Registered</span>
                      <span className="detail-value">{patient.registrationDate}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handlePatientHistory(patient.id)}
                    >
                      📊 History
                    </button>
                    <button
                      className="action-btn assess-btn"
                      onClick={() => handleStartAssessment(patient.id)}
                    >
                      🎯 Assess
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
