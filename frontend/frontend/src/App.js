import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MultiStepForm from "./components/MultiStepForm";
import GenerateReport from "./components/GenerateReport";
import TripViewer from "./pages/TripViewer";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/multistepform" element={<MultiStepForm />} />
        <Route path="/generatereport" element={<GenerateReport />} />
        <Route path="/tripviewer" element={<TripViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
