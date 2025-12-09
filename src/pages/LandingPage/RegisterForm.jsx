import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

function RegisterForm() {
  const [name, setName] = useState("");
  const [clinic, setClinic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    console.log("Registering:", { name, clinic, email, password, agreeTerms });

    // redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-form-wrapper">
      <h2 className="auth-title">Create Your Account</h2>
      <p className="auth-subtitle">Start managing dysarthric assessments</p>

      <form className="auth-form" onSubmit={handleRegister}>

        <div className="auth-input-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Clinic Name</label>
          <input
            type="text"
            placeholder="Enter clinic name"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Create Password</label>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-checkbox">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
          />
          <label htmlFor="agreeTerms">I agree to the terms and conditions</label>
        </div>

        <button className="auth-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
