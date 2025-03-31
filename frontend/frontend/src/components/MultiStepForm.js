import React, { useState } from "react";
import TripDetails from "./TripDetails";
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
    return datetime ? new Date(datetime).toISOString() : null;  // Ensure valid ISO format
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

      // 1️⃣ Submit the trip
      const tripResponse = await axios.post(
        "http://127.0.0.1:8000/api/create_trip/",
        formData.tripDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Trip submitted successfully:", tripResponse.data);

      const tripId = tripResponse.data.trip_id; // Ensure trip_id exists
      if (!tripId) {
        throw new Error("Trip ID missing in API response");
      }

      // 2️⃣ Format logs before submission with correct field names
      const formattedLogs = formData.logs.map(log => ({
        start_time: formatDateTime(log.startTime),
        end_time: formatDateTime(log.endTime),
        duty_status: log.dutyStatus,
        location: log.location || "Unknown",
        remarks: log.remarks || "N/A",
        trip: tripId, 
      }));

      // 3️⃣ Submit logs in one request instead of multiple
      if (formattedLogs.length > 0) {
        await axios.post(
          `http://127.0.0.1:8000/api/trips/${tripId}/logs/`,
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

  return (
    <div>
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

      <div className="button-container">
        {step > 1 && <button className="prev" onClick={prevStep}>Previous</button>}
        {step === 1 ? <button className="next" onClick={nextStep}>Next</button> : <button className="submit" onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
};

export default MultiStepForm;
