import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_URL = "http://localhost:8000/api/logs"; // Adjust to match your backend

const RouteMap = () => {
  const [route, setRoute] = useState([]);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const extractedRoute = data.map(log => [log.latitude, log.longitude]);
        const extractedStops = data.map(log => ({
          lat: log.latitude,
          lng: log.longitude,
          name: log.locationName,
          description: log.remarks
        }));

        setRoute(extractedRoute);
        setStops(extractedStops);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <MapContainer center={route.length ? route[0] : [0, 0]} zoom={6} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Draw Route */}
      {route.length > 1 && <Polyline positions={route} color="blue" />}

      {/* Display Stops */}
      {stops.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.lat, stop.lng]}
          icon={
            new L.Icon({
              iconUrl: index === stops.length - 1 ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              iconSize: [32, 32],
            })
          }
        >
          <Popup>
            <strong>{stop.name}</strong> <br />
            {stop.description || "No additional details"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RouteMap;
