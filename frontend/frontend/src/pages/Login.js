import React, { useState } from "react";
import styles from "../styles/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import logo from "./logo2.png";
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await login(credentials);
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        
      }
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      
      <div className={styles.roadAnimation}>
        <div className={styles.roadLines}></div>
      </div>
      <div className={styles.truckContainer}>
        <div className={styles.truck}></div>
        <div className={styles.truck}></div>
      </div>
      
      <div className={styles.authContainer}>
        
        <div className={styles.authHeader}>
          <div className={styles.logoContainer}>
            
            <img src={logo} alt="Trucking Logger" className={styles.logo} />
          </div>
        </div>
        
        <div className={styles.authForm}>
          <h2 className={styles.authTitle}>Login</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="username" className={styles.fieldLabel}>Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                className={styles.authInput}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.fieldLabel}>Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className={styles.authInput}
                onChange={handleChange}
                required
              />
            </div>
            
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
            
            <button
              type="submit"
              className={`${styles.authButton} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? <span className={styles.loadingIndicator}></span> : "Login"}
            </button>
          </form>
          
          <Link to="/signup" className={styles.authLink}>
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;