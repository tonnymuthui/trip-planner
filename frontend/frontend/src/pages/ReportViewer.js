import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GenerateReport from '../components/GenerateReport'; 
import './css/ReportViewer.css';
import Navbar from "../components/NavBar"


const ReportViewer = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tripDetails, setTripDetails] = useState(null);
    
    useEffect(() => {
      const fetchTrips = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("authToken");
          const response = await axios.get(`https://trip-planner-1-x88j.onrender.com/api/trips/`, 
            { headers: { Authorization: `Bearer ${token}` } 
          });
          setTrips(response.data);
          setLoading(false);
        } catch (err) {
          setError('Error fetching trips: ' + err.message);
          setLoading(false);
        }
      };
      
      fetchTrips();
    }, []);
  
    const handleTripSelect = (event) => {
      const tripId = event.target.value;
      setSelectedTripId(tripId);
      
      
      if (!tripId) {
        setTripDetails(null);
      }
    };
  
    if (loading) return (
      <div className="loading-container">
        <div className="loading">Loading trips...</div>
      </div>
    );
    
    if (error) return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  
    return (
      <div><Navbar/>
      <div className="trip-viewer-container">
        
        <div className="trip-selector">
          <h1>View a Report / Log Sheet</h1>
          <div className="select-container">
            <label htmlFor="trip-select">Select a trip:</label>
            <select 
              id="trip-select" 
              value={selectedTripId || ''} 
              onChange={handleTripSelect}
              className="trip-select"
            >
              <option value="">-- Select a trip --</option>
              {trips.map(trip => (
                <option key={trip.trip_id} value={trip.trip_id}>
                  Trip {trip.trip_id}: {trip.start_location} to {trip.destination}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        
        <div className="report-section">
          {selectedTripId ? (
            <GenerateReport selectedTripId={selectedTripId} />
          ) : (
            <div className="no-trip-selected">
              <p>Please select a trip to generate a report.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  };
  
export default ReportViewer;