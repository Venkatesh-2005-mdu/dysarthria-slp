import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Logging in:", { email, password, rememberMe });

    // redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-form-wrapper">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Login to continue your assessment</p>

      <form className="auth-form" onSubmit={handleLogin}>
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
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-checkbox">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        <button className="auth-btn" type="submit">Login</button>
      </form>

      <a href="#" className="auth-forgot-link">Forgot password?</a>
    </div>
  );
}

export default LoginForm;
