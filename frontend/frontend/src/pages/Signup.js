import React, { useState } from "react";
import styles from "../styles/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signup(formData);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError("Signup failed. Please check your information and try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      {/* Background animations */}
      <div className={styles.roadAnimation}>
        <div className={styles.roadLines}></div>
      </div>
      <div className={styles.truckContainer}>
        <div className={styles.truck}></div>
        <div className={styles.truck}></div>
      </div>
      
      <div className={styles.authContainer}>
        {/* Header section */}
        <div className={styles.authHeader}>
          <div className={styles.logoContainer}>
            {/* If you have a logo, uncomment this line: */}
            {/* <img src="/logo.png" alt="Trucking Logger" className={styles.logo} /> */}
          </div>
        </div>
        
        <div className={styles.authForm}>
          <h2 className={styles.authTitle}>Sign Up</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="username" className={styles.fieldLabel}>Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                className={styles.authInput}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.fieldLabel}>Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
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
                placeholder="Create a password"
                className={styles.authInput}
                onChange={handleChange}
                required
              />
            </div>
            
            <button
              type="submit"
              className={`${styles.authButton} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? <span className={styles.loadingIndicator}></span> : "Sign Up"}
            </button>
          </form>
          
          <Link to="/login" className={styles.authLink}>
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;