// import React, { useState } from "react";
// import TripDetails from "./TripDetails";
// import HourlyLogs from "./HourlyLogs";
// import Remarks from "./TripDetails";
// import ComplianceSummary from "./ComplianceSummary";
// import axios from "axios";

// const DriverLogForm = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Step 1: Trip Details
//     current_location: "",
//     pickup_location: "",
//     dropoff_location: "",
//     total_miles_driving_today: "",
//     total_mileage_today: "",
//     carrier_name: "",
//     truck_number: "",

//     // Step 2: Hourly Logs
//     hourly_logs: [],

//     // Step 3: Remarks
//     remarks: [],
//   });

//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/create_trip/", formData);
//       console.log("Trip created:", response.data);
//       alert("Trip log submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting log:", error);
//       alert("Failed to submit log.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {step === 1 && <TripDetails formData={formData} setFormData={setFormData} nextStep={nextStep} />}
//       {step === 2 && <HourlyLogs formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
//       {step === 3 && <Remarks formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
//       {step === 4 && <ComplianceSummary formData={formData} handleSubmit={handleSubmit} prevStep={prevStep} />}
//     </div>
//   );
// };

// export default DriverLogForm;
