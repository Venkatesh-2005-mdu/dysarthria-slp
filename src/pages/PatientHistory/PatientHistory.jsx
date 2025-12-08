import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientHistory.css";

export default function PatientHistory({ patientsProp = null, onView = null }) {
  const navigate = useNavigate();

  const samplePatients = [
    { id: "P001", name: "Arjun Kumar", age: 8, lastVisit: "2025-11-12", status: "Active" },
    { id: "P002", name: "Meera Devi", age: 5, lastVisit: "2025-12-03", status: "Follow-up" },
    { id: "P003", name: "Rahul Singh", age: 10, lastVisit: "2025-10-28", status: "Closed" },
    { id: "P004", name: "Sahana R", age: 6, lastVisit: "2025-11-11", status: "Active" },
    { id: "P005", name: "Venkatesh M", age: 19, lastVisit: "2025-12-05", status: "Follow-up" }
  ];

  const patients = patientsProp && Array.isArray(patientsProp) ? patientsProp : samplePatients;

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }, [query, patients]);

  const handleView = (id) => {
    if (typeof onView === "function") {
      onView(id);
      return;
    }
    navigate(`/patient/${id}`);
  };

  const initials = (name) =>
    name
      .split(" ")
      .map(n => n[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="phv2-page">

      {/* LEFT COLUMN — title and search */}
      <div className="phv2-left-col">
        <div className="phv2-header">
          <h1 className="phv2-title">Patient History</h1>
          <p className="phv2-sub">Search records, view reports and continue assessments.</p>

          <div className="phv2-search">
            <label className="phv2-search-label" htmlFor="ph-search">
              <svg className="phv2-search-icon" viewBox="0 0 24 24">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </label>

            <input
              id="ph-search"
              className="phv2-search-input"
              placeholder="Search by name or ID (e.g. Arjun or P001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — card list */}
      <div className="phv2-right-col">
        <div className="phv2-list-wrap">
          {filtered.length === 0 ? (
            <div className="phv2-empty">No records found for “{query}”</div>
          ) : (
            filtered.map((p, i) => (
              <article
                key={p.id}
                className="phv2-card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="phv2-left">
                  <div className="phv2-avatar">{initials(p.name)}</div>
                  <div className="phv2-meta">
                    <h3 className="phv2-name">{p.name}</h3>
                    <div className="phv2-small">
                      <span className="phv2-id">{p.id}</span> • <span>{p.age} yrs</span>
                    </div>
                  </div>
                </div>

                <div className="phv2-right">
                  <div className="phv2-last">Last Visit</div>
                  <div className="phv2-date">{p.lastVisit}</div>

                  <div className={`phv2-badge phv2-badge-${p.status.replace(/\s+/g,'').toLowerCase()}`}>
                    {p.status}
                  </div>

                  <div className="phv2-actions">
                    <button className="phv2-btn" onClick={() => handleView(p.id)}>
                      View Records
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
