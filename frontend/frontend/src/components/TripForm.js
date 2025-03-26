import React, { useState } from "react";
import axios from "axios";

const TripForm = () => {
  const [tripData, setTripData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_hours: "",
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    // console.log("Sending data:" formData);
      const response = await axios.post("http://127.0.0.1:8000/api/create_trip/", tripData);
      console.log("Trip created:", response.data);
      alert("Trip created successfully!");
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip.");
    }
  };

  return (
    <div>
      <h2>Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="current_location" placeholder="Current Location" onChange={handleChange} />
        <input type="text" name="pickup_location" placeholder="Pickup Location" onChange={handleChange} />
        <input type="text" name="dropoff_location" placeholder="Dropoff Location" onChange={handleChange} />
        <input type="number" name="current_cycle_hours" placeholder="Current Cycle Used (Hrs)" onChange={handleChange} />
        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
};

export default TripForm;
