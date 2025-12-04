import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import logo from "../../images/logo.png";
import logo1 from "../../images/logo1.png";
import "./LandingPage.css";

function LandingPage() {
  const [view, setView] = useState("none");

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
        </div>
      </nav>

      {/* HERO + FORM SECTION */}
      <section id="home" className="landing-content">

        <div className="hero-card glass animate-slide-up">
          <h1 className="hero-title">
            Dysarthria Speech <br /> Assessment System
          </h1>

          <p className="hero-desc">
            Clinically designed AI-supported tool for Speech-Language Pathologists
            to assess, track, and monitor dysarthric speech accurately.
          </p>

          <div className="logo-row">
            <img src={logo} className="hero-logo" alt="" />
            <img src={logo1} className="hero-logo" alt="" />
          </div>

          <div className="hero-buttons">
            <button onClick={() => setView("Login")} className="glass-btn-primary">Login</button>
            <button onClick={() => setView("Register")} className="glass-btn-outline">Register</button>
          </div>
        </div>

        <div className="form-card glass animate-slide-in">
          {view === "Login" && <LoginForm />}
          {view === "Register" && <RegisterForm />}
          {view === "none" && <p className="select-text">Please choose Login or Register</p>}
        </div>

      </section>


      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <h2 className="section-title">Features</h2>

        <div className="features-grid">
          <div className="feature-card glass fade-in">
            <h3>AI Speech Analysis</h3>
            <p>Automated assessment for dysarthric speech.</p>
          </div>

          <div className="feature-card glass fade-in">
            <h3>Real-Time Results</h3>
            <p>Instant feedback with high accuracy.</p>
          </div>

          <div className="feature-card glass fade-in">
            <h3>Progress Tracking</h3>
            <p>Monitor improvement over time.</p>
          </div>

          <div className="feature-card glass fade-in">
            <h3>SLP Friendly</h3>
            <p>Designed for clinical professionals.</p>
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
        <p className="contact-text">
          Email: support@dysarthria-ai.com <br />
          Phone: +91 90000 00000 <br />
          Address: SSN College of Engineering, Chennai
        </p>
      </section>

    </div>
  );
}

export default LandingPage;
