import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import logo from "../../images/logo.png";
import logo1 from "../../images/logo1.png";
import "./LandingPage.css";

function LandingPage() {
  const [view, setView] = useState("home"); // home, login, register

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // If on login/register view, show full-page form with logos
  if (view === "login" || view === "register") {
    return (
      <div className="landing-wrapper">
        {/* NAVBAR - Auth Pages */}
        <nav className="navbar navbar-auth">
          <div className="nav-left">
            <img src={logo} alt="logo" className="nav-logo" />
            <h2>Dysarthria Assessment</h2>
          </div>

          <button onClick={() => setView("home")} className="nav-link nav-back">
            ← Back Home
          </button>
        </nav>

        {/* AUTH SECTION - Full Page */}
        <section className="auth-page">
          <div className="auth-container">
            
            {/* Left Side - Branding */}
            <div className="auth-branding glass">
              <div className="logo-showcase">
                <img src={logo} className="auth-logo" alt="Logo 1" />
                <img src={logo1} className="auth-logo" alt="Logo 2" />
              </div>
              
              <h1 className="auth-brand-title">
                Dysarthria Assessment System
              </h1>
              
              <p className="auth-brand-desc">
                Clinically designed AI-supported tool for Speech-Language Pathologists
                to assess, track, and monitor dysarthric speech accurately and effectively.
              </p>

              <div className="auth-features">
                <div className="auth-feature-item">
                  <div className="auth-feature-icon">✓</div>
                  <p>Real-time Speech Analysis</p>
                </div>
                <div className="auth-feature-item">
                  <div className="auth-feature-icon">✓</div>
                  <p>Patient Progress Tracking</p>
                </div>
                <div className="auth-feature-item">
                  <div className="auth-feature-icon">✓</div>
                  <p>Clinical Grade Reports</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-container glass">
              {view === "login" && <LoginForm />}
              {view === "register" && <RegisterForm />}
              
              <div className="auth-footer">
                {view === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button onClick={() => setView("register")} className="auth-link">
                      Register here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button onClick={() => setView("login")} className="auth-link">
                      Login here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Main Landing Page View
  return (
    <div className="landing-wrapper">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="logo" className="nav-logo" />
          <h2>Dysarthria Assessment</h2>
        </div>

        <div className="nav-right">
          <button onClick={() => scrollToSection("home")} className="nav-link">Home</button>
          <button onClick={() => scrollToSection("features")} className="nav-link">Features</button>
          <button onClick={() => scrollToSection("about")} className="nav-link">About Us</button>
          <button onClick={() => scrollToSection("contact")} className="nav-link">Contact</button>
          <button onClick={() => setView("login")} className="nav-auth-btn">Login</button>
        </div>
      </nav>

      {/* HERO SECTION - Without Forms */}
      <section id="home" className="landing-content-new">
        
        {/* Hero Title */}
        <h1 className="page-hero-title">
          Dysarthria Speech <br /> Assessment System
        </h1>

        {/* Main Welcome Card - Full Width */}
        <div className="hero-main-card glass">
          
          {/* Left: Content */}
          <div className="hero-left">
            <h3 className="welcome-title">Welcome</h3>
            <p className="welcome-text">
              Join our community of speech-language pathologists using advanced assessment tools.
              Clinically designed AI-supported tool for Speech-Language Pathologists to assess, 
              track, and monitor dysarthric speech accurately.
            </p>

            <div className="hero-buttons">
              <button onClick={() => setView("login")} className="glass-btn-primary">Login</button>
              <button onClick={() => setView("register")} className="glass-btn-outline">Register</button>
            </div>
          </div>

          {/* Right: Logos and Stats */}
          <div className="hero-right">
            <div className="logo-row">
              <img src={logo} className="hero-logo" alt="" />
              <img src={logo1} className="hero-logo" alt="" />
            </div>

            <div className="welcome-stats">
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Assessments</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <h2 className="section-title">Features</h2>

        <div className="features-grid-2x2">
          <div className="feature-card glass fade-in">
            <h3>AI Speech Analysis</h3>
            <p>Automated assessment for dysarthric speech with real-time metrics.</p>
          </div>

          <div className="feature-card glass fade-in">
            <h3>Real-Time Results</h3>
            <p>Instant feedback with clinical-grade accuracy and precision.</p>
          </div>

          <div className="feature-card glass fade-in">
            <h3>Progress Tracking</h3>
            <p>Monitor patient improvement and recovery over time.</p>
          </div>

          <div className="feature-card glass fade-in">
            <h3>SLP Friendly</h3>
            <p>Designed specifically for clinical professionals and SLPs.</p>
          </div>
        </div>
      </section>


      {/* ABOUT US SECTION */}
      <section id="about" className="about-section">
        <h2 className="section-title">About Us</h2>
        <p className="about-text">
          We are a research-driven team committed to developing modern clinical tools
          to support Speech-Language Pathologists in diagnosing and assessing speech disorders.
        </p>
      </section>


      {/* CONTACT SECTION */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Contact Us</h2>
        <p className="contact-text">Have questions? We'd love to hear from you.</p>
        
        <form className="contact-form" onSubmit={(e) => {
          e.preventDefault();
          alert('Message sent! We will get back to you shortly.');
          e.target.reset();
        }}>
          <input 
            type="text" 
            className="contact-input" 
            placeholder="Your Name" 
            required 
          />
          <input 
            type="email" 
            className="contact-input" 
            placeholder="Your Email" 
            required 
          />
          <textarea 
            className="contact-textarea" 
            placeholder="Your Message" 
            required
          ></textarea>
          <button type="submit" className="contact-submit">Send Message</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer>
        <p>&copy; 2024 Dysarthria Assessment System. All rights reserved. | <a href="#home">Privacy Policy</a> | <a href="#home">Terms of Service</a></p>
      </footer>

    </div>
  );
}

export default LandingPage;
