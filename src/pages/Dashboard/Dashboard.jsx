import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [userStats] = useState({
    totalPatients: 24,
    activeAssessments: 8,
    completedAssessments: 156,
    avgAccuracy: 98.5
  });

  const handleLogout = () => {
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="dashboard-wrapper">

      {/* PREMIUM NAVBAR */}
      <nav className="dashboard-navbar">
        <div className="dash-nav-left">
          <h2 className="dash-brand">Dysarthria Assessment</h2>
        </div>

        <div className="dash-nav-right">
          <button className="dash-profile-btn" onClick={handleProfile}>Profile</button>
          <button className="dash-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">

        {/* HEADER SECTION */}
        <div className="dash-header-section">
          <div className="dash-greeting">
            <h1 className="dash-title">Welcome Back, SLP</h1>
            <p className="dash-subtitle">Clinical Dashboard — Manage Patient Records & Assessments</p>
          </div>

          <div className="dash-quick-stats">
            <div className="stat-card glass">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{userStats.totalPatients}</div>
                <div className="stat-label">Total Patients</div>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-value">{userStats.activeAssessments}</div>
                <div className="stat-label">Active Sessions</div>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <div className="stat-value">{userStats.completedAssessments}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>

            <div className="stat-card glass">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{userStats.avgAccuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION CARDS GRID */}
        <section className="dash-actions-section">
          <h2 className="section-heading">Quick Actions</h2>

          <div className="dash-cards-grid">

            {/* ADD PATIENT */}
            <div className="dash-action-card glass" onClick={() => navigate("/Addpatient")}>
              <div className="card-icon">➕</div>
              <h3>Add New Patient</h3>
              <p>Register a new patient and start clinical assessment. Secure, organized, and quick.</p>
              <div className="card-arrow">→</div>
            </div>

            {/* PATIENT HISTORY */}
            <div className="dash-action-card glass" onClick={() => navigate("/patienthistory")}>
              <div className="card-icon">📁</div>
              <h3>Patient History</h3>
              <p>Search previous patients and access past assessments, progress reports & sessions.</p>
              <div className="card-arrow">→</div>
            </div>

            {/* ASSESSMENTS */}
            <div className="dash-action-card glass" onClick={() => navigate("/assessmenthome")}>
              <div className="card-icon">📝</div>
              <h3>Start Assessment</h3>
              <p>Begin new clinical assessments, assign tasks, upload speech samples & track improvement.</p>
              <div className="card-arrow">→</div>
            </div>

            {/* REPORTS */}
            <div className="dash-action-card glass" onClick={() => navigate("/reports")}>
              <div className="card-icon">📊</div>
              <h3>Generate Reports</h3>
              <p>Create PDF reports, track outcomes, and download detailed clinical analyses instantly.</p>
              <div className="card-arrow">→</div>
            </div>

          </div>
        </section>

        {/* RECENT ACTIVITY SECTION */}
        <section className="dash-activity-section">
          <h2 className="section-heading">Recent Activity</h2>

          <div className="activity-list glass">
            <div className="activity-item">
              <div className="activity-badge phonation">Phonation</div>
              <div className="activity-info">
                <div className="activity-title">Patient #24 - Vowel Assessment</div>
                <div className="activity-time">Completed 2 hours ago</div>
              </div>
              <div className="activity-result">✓ Complete</div>
            </div>

            <div className="activity-item">
              <div className="activity-badge sz">S/Z Ratio</div>
              <div className="activity-info">
                <div className="activity-title">Patient #18 - Ratio Test</div>
                <div className="activity-time">Completed 5 hours ago</div>
              </div>
              <div className="activity-result">✓ Complete</div>
            </div>

            <div className="activity-item">
              <div className="activity-badge ros">Rate of Speech</div>
              <div className="activity-info">
                <div className="activity-title">Patient #22 - Speech Rate Test</div>
                <div className="activity-time">In Progress</div>
              </div>
              <div className="activity-result pending">⏳ Active</div>
            </div>

            <div className="activity-item">
              <div className="activity-badge articulation">Articulation</div>
              <div className="activity-info">
                <div className="activity-title">Patient #19 - TAT Screening</div>
                <div className="activity-time">Started 12 hours ago</div>
              </div>
              <div className="activity-result pending">⏳ Active</div>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}

export default Dashboard;
