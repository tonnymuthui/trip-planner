import React, { use, useState } from "react";
import TripDetails from "./TripDetails";
import { useNavigate } from "react-router-dom";
import LogInputForm from "./LogInputForm";
import axios from "axios";
import "./css/Multistepform.css";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tripDetails: { 
      start_location: "",
      destination: "",
      miles_driving_today: "",
      total_mileage_today: "",
      carrier_name: "",
      main_office_address: "",
      home_terminal_address: "",
      truck_trailer_info: "",
    },
    logs: [],  
  });

  const nextStep = () => {
    console.log("Logs Data:", formData.logs);
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleChange = (section, data) => {
    setFormData((prevData) => ({ ...prevData, [section]: data }));
  };

  const formatDateTime = (datetime) => {
    return datetime ? new Date(datetime).toISOString() : null;  
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found! Make sure you're logged in.");
        alert("Authentication token is missing!");
        return;
      }

      console.log(" Submitting Trip Data:", formData.tripDetails);
      console.log(" Logs Before Submission:", formData.logs);

      if (formData.logs.length === 0) {
        alert("No logs found! Please enter at least one log before submitting.");
        return;
      }

      
      const tripResponse = await axios.post(
        "https://trip-planner-1-x88j.onrender.com/api/create_trip/",
        formData.tripDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Trip submitted successfully:", tripResponse.data);

      const tripId = tripResponse.data.trip_id; 
      if (!tripId) {
        throw new Error("Trip ID missing in API response");
      }

     
      const formattedLogs = formData.logs.map(log => ({
        start_time: formatDateTime(log.startTime),
        end_time: formatDateTime(log.endTime),
        duty_status: log.dutyStatus,
        location: log.location || "Unknown",
        remarks: log.remarks || "N/A",
        trip: tripId, 
      }));

      
      if (formattedLogs.length > 0) {
        await axios.post(
          `https://trip-planner-1-x88j.onrender.com/api/trips/${tripId}/logs/`,
          formattedLogs,
          { headers: { Authorization: `Bearer ${token}`} } 
        );
      }

      alert("Trip and logs submitted successfully!");
    } catch (error) {
      console.error("Error submitting trip/logs:", error);
      alert("Failed to submit trip and logs.");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="multistep-form-container">
  
  <div className="form-header">
    <h1>Trip Log Form</h1>
    <p>Please complete all required information</p>
  </div>
  
  <div className="progress-container">
    <div className="progress-bar" style={{width: step === 1 ? '0%' : '100%'}}></div>
    <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1</div>
    <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2</div>
  </div>
  
  
  <div className="form-content fade-in">
    {step === 1 && (
      <TripDetails 
        data={formData.tripDetails} 
        handleChange={(e) => handleChange("tripDetails", { ...formData.tripDetails, [e.target.name]: e.target.value })} 
      />
    )}
    {step === 2 && (
      <LogInputForm 
        logs={formData.logs} 
        setLogs={(data) => handleChange("logs", data)} 
      />
    )}
  </div>

  <div className="button-container">
    {step > 1 && <button className="prev" onClick={prevStep}>Previous</button>}
    {step === 1 ? <button className="next" onClick={nextStep}>Next</button> : <button className="submit" onClick={handleSubmit}>Submit</button>}
  </div>
  <button className="home" onClick={() => navigate("/dashboard")} >GO BACK HOME</button>
</div>
  );
};

export default MultiStepForm;
