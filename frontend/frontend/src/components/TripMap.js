import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './css/TripMap.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for start and end markers
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TripMap = ({ tripId }) => {
  const [trip, setTrip] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://127.0.0.1:8000/api/trips/${tripId}/`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrip(response.data);
        
        
        const logsResponse = await axios.get(`http://127.0.0.1:8000/api/trips/${tripId}/logs/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        await processLocationData(response.data, logsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching trip data: ' + err.message);
        setLoading(false);
      }
    };
    
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  
  const processLocationData = async (tripData, logEntries) => {
    try {
      
      const useBackendCoordinates = tripData.start_latitude && tripData.start_longitude;
      
      
      const locationData = [
        {
          id: 'start',
          name: tripData.start_location,
          type: 'start',
          logs: [],
          timestamp: new Date(tripData.created_at).toISOString(),
          
          coordinates: useBackendCoordinates ? 
            [parseFloat(tripData.start_latitude), parseFloat(tripData.start_longitude)] : null
        },
        {
          id: 'end',
          name: tripData.destination,
          type: 'end',
          logs: [],
          timestamp: new Date(Math.max(...logEntries.map(log => new Date(log.end_time)))).toISOString(),
          
          coordinates: useBackendCoordinates && tripData.destination_latitude && tripData.destination_longitude ? 
            [parseFloat(tripData.destination_latitude), parseFloat(tripData.destination_longitude)] : null
        }
      ];

      
      const locationGroups = {};
      
      logEntries.forEach(log => {
        if (!log.location) return;
        
        if (!locationGroups[log.location]) {
          locationGroups[log.location] = {
            id: `log-${log.id}`,
            name: log.location,
            type: 'intermediate',
            logs: [],
            timestamp: new Date(log.start_time).toISOString(),
            
            coordinates: log.latitude && log.longitude ? 
              [parseFloat(log.latitude), parseFloat(log.longitude)] : null
          };
        }
        
        locationGroups[log.location].logs.push({
          id: log.id,
          duty_status: log.duty_status,
          start_time: log.start_time,
          end_time: log.end_time,
          remarks: log.remarks || 'No remarks'
        });
        
        
        const logTime = new Date(log.start_time);
        const currentTime = new Date(locationGroups[log.location].timestamp);
        if (logTime < currentTime) {
          locationGroups[log.location].timestamp = log.start_time;
        }
      });
      
      
      Object.values(locationGroups).forEach(group => {
        locationData.push(group);
      });
      
      
      locationData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      
      const endIndex = locationData.findIndex(loc => loc.type === 'end');
      if (endIndex !== -1 && endIndex !== locationData.length - 1) {
        const endLocation = locationData.splice(endIndex, 1)[0];
        locationData.push(endLocation);
      }
      
      
      let geocodedLocations = [];
      
      if (useBackendCoordinates) {
        
        geocodedLocations = locationData.map(location => {
          
          if (!location.coordinates) {
            const match = locationData.find(loc => 
              loc.name.toLowerCase() === location.name.toLowerCase() && loc.coordinates
            );
            if (match) {
              return { ...location, coordinates: match.coordinates };
            } else {
              
              return location;
            }
          }
          return location;
        });
      }
      
      
      const locationsToGeocode = geocodedLocations.length > 0 ? 
        geocodedLocations.filter(loc => !loc.coordinates) : 
        locationData;
      
      if (locationsToGeocode.length > 0) {
        const newlyGeocodedLocations = await Promise.all(
          locationsToGeocode.map(async (location) => {
            if (!location.coordinates) {
              const coords = await geocodeLocation(location.name);
              return { ...location, coordinates: coords };
            }
            return location;
          })
        );
        
        
        if (geocodedLocations.length > 0) {
          geocodedLocations = geocodedLocations.map(loc => {
            if (!loc.coordinates) {
              const geocodedLoc = newlyGeocodedLocations.find(newLoc => newLoc.id === loc.id);
              return geocodedLoc || loc;
            }
            return loc;
          });
        } else {
          geocodedLocations = newlyGeocodedLocations;
        }
      }
      
      setLocations(geocodedLocations.filter(loc => loc.coordinates));
    } catch (err) {
      setError('Error processing location data: ' + err.message);
    }
  };

  
  const geocodeLocation = async (locationText) => {
    if (!locationText) return null;
  
    try {
        
        const response = await axios.get(`http://localhost:8000/api/geocode/`, {
            params: { location: locationText }
        });

        if (response.data && response.data.latitude && response.data.longitude) {
            return [parseFloat(response.data.latitude), parseFloat(response.data.longitude)];
        }
        return null;
    } catch (err) {
        console.error('Geocoding error:', err);
        return null;
    }
};
//     try {
    
//       const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
//         params: {
//           q: locationText,
//           format: 'json',
//           limit: 1
//         },
//         headers: {
//           'User-Agent': 'TripMapApplication' // Required by Nominatim ToS
//         }
//       });
      
//       if (response.data && response.data.length > 0) {
//         return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
//       }
//       return null;
//     } catch (err) {
//       console.error('Geocoding error:', err);
//       return null;
//     }
//   };

  if (loading) return <div className="loading">Loading trip map...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!trip || locations.length === 0) return <div className="no-data">No trip data available</div>;

  
  const bounds = L.latLngBounds(locations.map(loc => loc.coordinates));
  const center = bounds.getCenter();
  
 
  const routeCoordinates = locations.map(loc => loc.coordinates);

  return (
    <div className="trip-map-container">
      <div className="trip-header">
        <h2>Trip {trip.trip_id}: {trip.start_location} to {trip.destination}</h2>
        <div className="trip-details">
          <p>Carrier: {trip.carrier_name}</p>
          <p>Total miles: {trip.total_mileage_today}</p>
        </div>
      </div>
      
      <MapContainer 
        center={center} 
        zoom={5} 
        style={{ height: '600px', width: '100%' }}
        bounds={bounds}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        
        <Polyline 
          positions={routeCoordinates}
          color="blue"
          weight={3}
          opacity={0.7}
        />
        
        
        {locations.map((location, index) => (
          <Marker 
            key={location.id}
            position={location.coordinates}
            icon={location.type === 'start' ? startIcon : location.type === 'end' ? endIcon : new L.Icon.Default()}
          >
            <Popup>
              <div className="location-popup">
                <h3>{location.name}</h3>
                {location.type === 'start' && <p><strong>Trip Start</strong></p>}
                {location.type === 'end' && <p><strong>Trip Destination</strong></p>}
                
                {location.logs && location.logs.length > 0 && (
                  <div className="duty-logs">
                    <h4>Duty Status Logs:</h4>
                    <ul>
                      {location.logs.map(log => (
                        <li key={log.id}>
                          <strong>{log.duty_status}</strong>
                          <div>
                            {new Date(log.start_time).toLocaleString()} - 
                            {new Date(log.end_time).toLocaleString()}
                          </div>
                          <div className="remarks">{log.remarks}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              <div>
                <strong>{location.name}</strong>
                {location.logs && location.logs.length > 0 && (
                  <div>{location.logs.length} duty change{location.logs.length > 1 ? 's' : ''}</div>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TripMap;