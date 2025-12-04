import { useState } from "react";
import "./AuthForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
  };

  return (
    <div className="auth-container fade-auth">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Login to continue your assessment</p>

      <form className="auth-form" onSubmit={handleLogin}>
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="auth-btn" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
