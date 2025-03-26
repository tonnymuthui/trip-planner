import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import {motion} from "framer-motion";
// import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { FaClock, FaMapMarkerAlt, FaUser, FaBars } from "react-icons/fa";
import "./css/backup.css";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalHours, setTotalHours] = useState(0);
  const [user, setUser] = useState({ name: "John Doe" });
  const [lastLocation, setLastLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Example: San Francisco
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate fetching total hours logged in the past 7 days
    setTotalHours(42);
  }, []);

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
  <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
    <FaBars />
  </button>
  
  <div className="sidebar-profile">
    <div className="sidebar-profile-image"></div>
    <div className="sidebar-profile-details">
      <div className="sidebar-profile-name">{user.name}</div>
      <div className="sidebar-profile-role">Dashboard User</div>
    </div>
  </div>
        <h2>Dashboard</h2>
        <ul>
          <li>Overview</li>
          <li>Logs</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <div className="metrics">
          <div className="metric-card">
            <FaClock className="icon" />
            <p>{format(currentTime, "EEEE, MMMM d, yyyy - hh:mm a")}</p>
          </div>
          <div className="metric-card">
            <FaUser className="icon" />
            <p>{user.name}</p>
          </div>
          <div className="metric-card">
            <FaClock className="icon" />
            <p>{totalHours} hrs logged this week</p>
          </div>
        </div>

        <div className="map-container">
          <h3>Last Logged Location</h3>
          <MapContainer center={[lastLocation.lat, lastLocation.lng]} zoom={13} className="map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lastLocation.lat, lastLocation.lng]}>
              <Popup>
                Last recorded location
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="daily-log-card-container">
        <div className="daily-log-card" onClick={() => navigate("/daily-log")}>
        <div className="w-full flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardCheck className="text-blue-500" size={24} />
                        Daily Log
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Record your trip details and compliance logs effortlessly.
                    </p>
                </div>
                <ArrowRight className="text-gray-500 transition-transform transform hover:translate-x-2" size={24} />
            </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
