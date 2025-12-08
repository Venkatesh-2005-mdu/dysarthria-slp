import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can clear auth later
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="dash-container">

      {/* TOP RIGHT BUTTONS */}
      <div className="dash-top-buttons">
        <button className="dash-profile-btn" onClick={handleProfile}>Profile</button>
        <button className="dash-logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* HEADER */}
      <header className="dash-header">
        <h1 className="dash-title">Welcome, SLP</h1>
        <p className="dash-subtitle">
          Clinical Dashboard — Manage Patient Records & Assessments
        </p>
      </header>

      {/* BIG CARDS SECTION */}
      <div className="dash-cards">

        {/* ADD PATIENT */}
        <div
          className="dash-card big-card"
          onClick={() => navigate("/Addpatient")}
        >
          <h2>➕ Add New Patient</h2>
          <p>
            Register a new patient and start clinical assessment.
            Secure, organized, and quick.
          </p>
        </div>

        {/* PATIENT HISTORY */}
        <div
          className="dash-card big-card"
          onClick={() => navigate("/patienthistory")}
        >
          <h2>📁 Patient History</h2>
          <p>
            Search previous patients and access past assessments, progress
            reports & uploaded sessions.
          </p>
        </div>

        {/* ASSESSMENTS */}
        <div
          className="dash-card big-card"
          onClick={() => navigate("/Addpatient")}
        >
          <h2>📝 Assessments & Tasks</h2>
          <p>
            Start new assessments, assign tasks, upload speech samples, and
            track improvement.
          </p>
        </div>

        {/* REPORTS */}
        <div
          className="dash-card big-card"
          onClick={() => navigate("/reports")}
        >
          <h2>📊 Reports</h2>
          <p>
            Generate PDF reports, track clinical outcomes, and download
            historical analyses.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
