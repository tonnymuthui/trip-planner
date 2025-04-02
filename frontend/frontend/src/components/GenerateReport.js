import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import "./css/report.css";


const DUTY_STATUS = {
  "Off Duty": 0,
  "Sleeper Berth": 1,
  "Driving": 2,
  "On Duty": 3,
};



const GenerateReport = ({ selectedTripId }) => {
  const [tripId, setTripId] = useState(selectedTripId || "");
  const [tripDetails, setTripDetails] = useState(null);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    if (selectedTripId) {
      setTripId(selectedTripId);
      fetchReport(selectedTripId);
    }
  }, [selectedTripId]);

  const fetchReport = async (id = tripId) => {
    if (!id) {
      setError("Please enter a valid Trip ID");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const tripResponse = await axios.get(`https://trip-planner-1-x88j.onrender.com/api/trips/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      const logResponse = await axios.get(`https://trip-planner-1-x88j.onrender.com/api/logentries/?trip_id=${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!tripResponse.data) {
        throw new Error("Trip not found");
      }

      setTripDetails(tripResponse.data);
      console.log("Trip Details:", tripDetails);
      console.log("User inside tripDetails:", tripDetails.user);

      
      const sortedLogData = logResponse.data.sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      );
      setLogData(sortedLogData);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(
        error.response?.status === 404
          ? "Trip not found. Please check the Trip ID."
          : "Failed to fetch report. Please try again later."
      );
      setTripDetails(null);
      setLogData([]);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!logData.length) return [];
    
    
    return logData.map(log => ({
      time: new Date(log.start_time).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      }),
      timestamp: new Date(log.start_time).getTime(),
      status: log.duty_status,
      statusValue: DUTY_STATUS[log.duty_status],
      duration: log.duration_minutes || 0,
    }));
  };

  const formattedLogData = prepareChartData();

  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="time">{`Time: ${data.time}`}</p>
          <p className="status">{`Status: ${data.status}`}</p>
          <p className="duration">{`Duration: ${data.duration} min`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="report-container">

      <h2 className="report-header">Driver Trip Report</h2>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Trip ID (4-digit)"
          value={tripId}
          onChange={(e) => setTripId(e.target.value.trim())}
          maxLength={4}
          className="trip-id-input"
        />
        <button 
          onClick={() => fetchReport()} 
          disabled={loading}
          className="generate-btn"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <div className="loading-indicator">Loading report data...</div>}

      {tripDetails && (
        <div className="report-content">
          <div className="trip-details">
            <div><h3>Trip Details</h3></div>
            <div className="trip-info-grid">
              <div className="info-item">
                <span className="info-label">Trip ID:</span>
                <span className="info-value">{tripDetails.id || tripId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Driver:</span>
                <span className="info-value">{tripDetails.user}</span>
              </div>
              <div className="info-item">
                <span className="info-label">From:</span>
                <span className="info-value">{tripDetails.start_location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">To:</span>
                <span className="info-value">{tripDetails.destination}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Mileage:</span>
                <span className="info-value">{tripDetails.total_mileage_today} miles</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date:</span>
                <span className="info-value">
                  {tripDetails.start_date && new Date(tripDetails.start_date).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Truck Info:</span>
                <span className="info-value">{tripDetails.truck_trailer_info}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">
                  <span className={`status-badge ${tripDetails.status?.toLowerCase() || ""}`}>
                    {tripDetails.status || "Active"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {logData.length > 0 ? (
            <div className="chart-section">
              <h3>Driver Duty Status Timeline</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={formattedLogData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                    <XAxis 
                      dataKey="time" 
                      label={{ value: "Time (24hr)", position: "bottom", offset: 20 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      type="number"
                      domain={[0, 3]}
                      ticks={[0, 1, 2, 3]}
                      tickFormatter={(value) => {
                        const status = Object.keys(DUTY_STATUS).find(
                          (key) => DUTY_STATUS[key] === value
                        );
                        return status || "";
                      }}
                      label={{ value: "Duty Status", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      type="stepAfter" 
                      dataKey="statusValue" 
                      name="Duty Status" 
                      stroke="#007bff" 
                      strokeWidth={2} 
                      dot={{ stroke: '#007bff', strokeWidth: 2, r: 4, fill: 'white' }}
                      activeDot={{ r: 6, fill: '#007bff' }}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              
            </div>
          ) : (
            !loading && <div className="no-data-message">No log data available for this trip.</div>
          )}
        </div>
      )}

      
      {tripDetails && (
        <div className="report-actions">
          <button 
            className="print-btn"
            onClick={() => window.print()}
          >
            Print Report
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;