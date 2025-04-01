import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClock } from "react-icons/fa";


const ComplianceSummary = () => {
  const [totalDrivenTime, setTotalDrivenTime] = useState(0);
  const [remainingTimeToDrive, setRemainingTimeToDrive] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplianceData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/compliance-summary/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTotalDrivenTime(response.data.total_driven_time.toFixed(2));
        setRemainingTimeToDrive(response.data.remaining_time_to_drive.toFixed(2));
      } catch (error) {
        console.error("Error fetching compliance data:", error);
        setError("Failed to fetch compliance data. Please try again later.");
      }
    };

    fetchComplianceData();
  }, []);

  return (
    <div className="compliance-summary-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2 className="heading" style={{
    textAlign: "center",
    fontFamily: "Helvetica, Arial, sans-serif",
    color: "#2c3e50",
    fontSize: "1.2em",
    fontWeight: "600"
  }}
  >   Compliance Summary</h2>
          <div className="metric-card">
            <FaClock className="icon" />
            <div className="metric">
              <p className="metric-value">{totalDrivenTime} hrs</p>
              <p className="metric-label">Driven this cycle</p>
            </div>
            <div className="metric">
              <p className="metric-value">{remainingTimeToDrive} hrs</p>
              <p className="metric-label">Remaining to drive</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComplianceSummary;
