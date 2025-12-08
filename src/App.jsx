import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddPatient from "./pages/Patients/AddPatient";
import PatientHistory from "./pages/PatientHistory/PatientHistory";
import AssessmentHome from "./pages/Assessments/AssessmentHome";
import RespiratoryAssessment from "./pages/Assessments/RespiratoryAssessment";
import PhonationAssessment from "./pages/Assessments/PhonationAssessment";

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add Patient Page */}
        <Route path="/addpatient" element={<AddPatient />} />

        <Route path="/patienthistory" element={<PatientHistory />} />

        <Route path="/assessmenthome" element={<AssessmentHome />} />

        <Route path="/assess/respiratory" element={<RespiratoryAssessment />} />

        <Route path="/assess/phonation" element={<PhonationAssessment />} />



      </Routes>
    </Router>
  );
}

export default App;
