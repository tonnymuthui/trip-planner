import React from "react";
import "./css/TripDetails.css";

const TripDetails = ({ data, handleChange }) => {
  return (
    <div className="trip-details-container">
      <h2>Step 1: Trip & Driver Details</h2>
      <label>Trip ID (4-digit code):</label>
      <input
        type="text"
        name="trip_id"
        value={data.trip_id || ""}
        onChange={handleChange}
        pattern="\d{4}"
        maxLength="4"
        title="Enter a 4-digit Trip ID"
        required
      />
      <label>From (Start Location):</label>
      <input type="text" name="start_location" value={data.start_location || ""} onChange={handleChange} required />
      
      <label>To (Destination):</label>
      <input type="text" name="destination" value={data.destination || ""} onChange={handleChange} required />
      
      <label>Total Miles Driving Today:</label>
      <input type="number" name="miles_driving_today" value={data.miles_driving_today || ""} onChange={handleChange} required />
      
      <label>Total Mileage Today:</label>
      <input type="number" name="total_mileage_today" value={data.total_mileage_today || ""} onChange={handleChange} required />
      
      <label>Carrier Name:</label>
      <input type="text" name="carrier_name" value={data.carrier_name || ""} onChange={handleChange} required />
      
      <label>Main Office Address:</label>
      <input type="text" name="main_office_address" value={data.main_office_address || ""} onChange={handleChange} required />
      
      <label>Home Terminal Address:</label>
      <input type="text" name="home_terminal_address" value={data.home_terminal_address || ""} onChange={handleChange} required />
      
      <label>Truck/Trailer Numbers & License Plates:</label>
      <input type="text" name="truck_trailer_info" value={data.truck_trailer_info || ""} onChange={handleChange} required />
    </div>
  );
};

export default TripDetails;
