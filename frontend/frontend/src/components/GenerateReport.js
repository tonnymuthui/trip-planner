import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./report.css"; 

const dutyStatusMap = {
  "Off Duty": 0,
  "Sleeper Berth": 1,
  "Driving": 2,
  "On Duty": 3,
};

const GenerateReport = () => {
  const [tripId, setTripId] = useState("");
  const [tripDetails, setTripDetails] = useState(null);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!tripId) return;
    setLoading(true);
    setError("");

    try {
      const tripResponse = await axios.get(`/api/trips/${tripId}/`);
      const logResponse = await axios.get(`/api/trips/${tripId}/logs/`);

      setTripDetails(tripResponse.data);
      setLogData(logResponse.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Failed to fetch report. Please check the Trip ID.");
    }

    setLoading(false);
  };

  // Convert log data to chart format
  const formattedLogData = logData.map((log) => ({
    time: new Date(log.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: dutyStatusMap[log.duty_status] ?? null,
  }));

  return (
    <div className="report-container">
      <h2 className="report-header">Driver Trip Report</h2>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Trip ID (4-digit)"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          maxLength={4}
        />
        <button onClick={fetchReport} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {tripDetails && (
        <div className="trip-details">
          <h3>Trip Details</h3>
          <div className="trip-info">
            <p><strong>From:</strong> {tripDetails.start_location}</p>
            <p><strong>To:</strong> {tripDetails.destination}</p>
            <p><strong>Total Mileage:</strong> {tripDetails.total_mileage_today} miles</p>
            <p><strong>Truck Info:</strong> {tripDetails.truck_trailer_info}</p>
          </div>
        </div>
      )}

      {logData.length > 0 && (
        <div className="chart-container">
          <h3>Driver Duty Status Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedLogData}>
              <XAxis dataKey="time" />
              <YAxis
                type="number"
                domain={[0, 3]}
                ticks={[0, 1, 2, 3]}
                tickFormatter={(value) =>
                  Object.keys(dutyStatusMap).find((key) => dutyStatusMap[key] === value)
                }
              />
              <Tooltip />
              <Line type="step" dataKey="status" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
