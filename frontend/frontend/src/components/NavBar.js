import React from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/navbar.css"; 

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="navbar-title">Trip Logger</div>
      <ul className="navbar-links">
        <li onClick={() => navigate("/dashboard")}>Home</li>
        <li onClick={() => navigate("/reportviewer")}>View Daily Logs</li>
        <li onClick={() => navigate("/tripviewer")}>View Trip Route</li>
        <li className="logout" onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }}>Log Out</li>
      </ul>
    </nav>
  );
};

export default Navbar;
