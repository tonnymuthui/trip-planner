import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TripMap from '../components/TripMap';
import './css/TripViewer.css';

const TripViewer = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchTrips = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("authToken");
          const response = await axios.get(`http://localhost:8000/api/trips/`, 
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
      setSelectedTripId(event.target.value);
    };
  
    if (loading) return <div className="loading">Loading trips...</div>;
    if (error) return <div className="error">{error}</div>;
    if (trips.length === 0) return <div className="no-data">No trips available</div>;
  
    return (
      <div className="trip-viewer-container">
        <div className="trip-selector">
          <h1>Trip Viewer</h1>
          <div className="select-container">
            <label htmlFor="trip-select">Select a trip:</label>
            <select 
              id="trip-select" 
              value={selectedTripId || ''} 
              onChange={handleTripSelect}
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
        
        {selectedTripId && <TripMap tripId={selectedTripId} />}
      </div>
    );
  };
  
export default TripViewer;