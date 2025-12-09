import React from "react";
import "./LevelMeter.css";

/**
 * LevelMeter Component
 * Displays a visual progress bar for duration values with color coding
 * based on clinical reference ranges
 */
const LevelMeter = ({ 
  value = 0, 
  maxValue = 35, 
  label = "", 
  patientType = "adult_female",
  showReference = true 
}) => {
  // Reference ranges by patient type (in seconds)
  const references = {
    adult_male: { min: 25, max: 35, color: "#3b82f6" },
    adult_female: { min: 15, max: 25, color: "#ec4899" },
    child: { min: 6, max: 15, color: "#f59e0b" },
  };

  const ref = references[patientType] || references.adult_female;
  const percentage = (value / maxValue) * 100;

  // Determine color based on reference ranges
  const getStatusColor = () => {
    if (value >= ref.min && value <= ref.max) return "#10b981"; // green (normal)
    if (value < ref.min) return "#f59e0b"; // amber (low)
    return "#ef4444"; // red (high)
  };

  const getStatusLabel = () => {
    if (value >= ref.min && value <= ref.max) return "Normal";
    if (value < ref.min) return "Low";
    return "High";
  };

  const statusColor = getStatusColor();
  const statusLabel = getStatusLabel();

  return (
    <div className="level-meter-container">
      {label && <label className="level-meter-label">{label}</label>}
      
      <div className="level-meter-wrapper">
        <div className="level-meter-bar">
          <div
            className="level-meter-fill"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
        
        <div className="level-meter-value">
          <span className="level-meter-number">{value.toFixed(1)}</span>
          <span className="level-meter-unit">s</span>
        </div>
      </div>

      {showReference && (
        <div className="level-meter-reference">
          <span className="level-meter-status" style={{ color: statusColor }}>
            {statusLabel}
          </span>
          <span className="level-meter-range">
            ({ref.min}-{ref.max}s)
          </span>
        </div>
      )}
    </div>
  );
};

export default LevelMeter;
