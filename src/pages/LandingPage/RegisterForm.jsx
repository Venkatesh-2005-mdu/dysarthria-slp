import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

function RegisterForm() {
  const [name, setName] = useState("");
  const [clinic, setClinic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    console.log("Registering:", { name, clinic, email, password });

    // redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-container fade-auth">
      <h2 className="auth-title">Create Your Account</h2>
      <p className="auth-subtitle">Start managing dysarthric assessments</p>

      <form className="auth-form" onSubmit={handleRegister}>

        <div className="auth-input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <input
            type="text"
            placeholder="Clinic Name"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="auth-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
