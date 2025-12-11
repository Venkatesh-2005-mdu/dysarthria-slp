import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SLPProfile.css';

const SLPProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    credentials: '',
    license: '',
    specialization: '',
    contact: '',
    email: '',
    yearsExperience: '',
    clinicName: '',
    bio: '',
  });

  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    // Load SLP profile from localStorage
    const savedProfile = localStorage.getItem('slpProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setEditForm(parsedProfile);
    }
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...profile });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.credentials) {
      alert('Please fill in Name and Credentials');
      return;
    }

    setProfile(editForm);
    localStorage.setItem('slpProfile', JSON.stringify(editForm));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('slpProfile');
    localStorage.removeItem('patients');
    navigate('/');
  };

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'SLP';

  if (isEditing) {
    return (
      <div className="profile-wrapper">
        <nav className="profile-navbar">
          <button className="back-btn" onClick={handleCancel}>
            ← Cancel
          </button>
          <h1 className="nav-title">Edit SLP Profile</h1>
        </nav>

        <div className="profile-content">
          <div className="edit-form glass-card">
            <h2>Edit Your Profile</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Credentials *</label>
                <input
                  type="text"
                  name="credentials"
                  value={editForm.credentials}
                  onChange={handleInputChange}
                  placeholder="e.g., M.S. SLP"
                />
              </div>

              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="license"
                  value={editForm.license}
                  onChange={handleInputChange}
                  placeholder="License number"
                />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={editForm.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Pediatric Speech Therapy"
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={editForm.contact}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={editForm.yearsExperience}
                  onChange={handleInputChange}
                  placeholder="Years"
                />
              </div>

              <div className="form-group">
                <label>Clinic/Organization Name</label>
                <input
                  type="text"
                  name="clinicName"
                  value={editForm.clinicName}
                  onChange={handleInputChange}
                  placeholder="Clinic name"
                />
              </div>

              <div className="form-group form-group-full">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Brief bio or about you"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasProfile = profile.name && profile.credentials;

  return (
    <div className="profile-wrapper">
      <nav className="profile-navbar">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1 className="nav-title">SLP Profile</h1>
      </nav>

      <div className="profile-content">
        {!hasProfile ? (
          <div className="setup-card glass-card">
            <div className="setup-icon">👤</div>
            <h2>Create Your Profile</h2>
            <p>Set up your SLP profile to get started with patient assessments</p>
            <button className="btn btn-primary btn-lg" onClick={handleEdit}>
              Create Profile
            </button>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="profile-header glass-card">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-info">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-credentials">{profile.credentials}</p>
                {profile.specialization && (
                  <p className="profile-specialization">{profile.specialization}</p>
                )}
              </div>
              <button className="btn btn-secondary" onClick={handleEdit}>
                ✏️ Edit Profile
              </button>
            </div>

            {/* Professional Details */}
            <div className="details-grid">
              {profile.license && (
                <div className="detail-card glass-card">
                  <h3>📋 License</h3>
                  <p>{profile.license}</p>
                </div>
              )}

              {profile.yearsExperience && (
                <div className="detail-card glass-card">
                  <h3>📊 Experience</h3>
                  <p>{profile.yearsExperience} years</p>
                </div>
              )}

              {profile.contact && (
                <div className="detail-card glass-card">
                  <h3>📱 Contact</h3>
                  <p>{profile.contact}</p>
                </div>
              )}

              {profile.email && (
                <div className="detail-card glass-card">
                  <h3>📧 Email</h3>
                  <p>{profile.email}</p>
                </div>
              )}

              {profile.clinicName && (
                <div className="detail-card glass-card">
                  <h3>🏥 Clinic</h3>
                  <p>{profile.clinicName}</p>
                </div>
              )}
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="bio-section glass-card">
                <h3>📝 About</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-value">
                  {JSON.parse(localStorage.getItem('patients') || '[]').length}
                </div>
                <div className="stat-label">Patients</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Assessments</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Reports</div>
              </div>
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={handleEdit}>
                ✏️ Edit Profile
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SLPProfile;
