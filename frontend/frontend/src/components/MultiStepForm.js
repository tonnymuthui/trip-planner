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

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/create_trip/", formData);
      console.log("Trip submitted successfully:", response.data);
      alert("Trip created successfully!");
    } catch (error) {
      console.error("Error submitting trip:", error);
      alert("Failed to submit trip.");
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
