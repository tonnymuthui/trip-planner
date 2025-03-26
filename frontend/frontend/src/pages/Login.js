import React, {useState} from "react";
import styles from "../styles/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await login(credentials);
      console.log("Login Response:", response);
      if(response.status === 200){
        localStorage.setItem("token", response.data.token); 
        console.log("Redirecting to dashboard...");
        
      }
      navigate("/dashboard");
      alert("Login successful!");
    } catch (error) {
      alert("Login failed. Check console for details.");
    }
  };




  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h2 className={styles.authTitle}>Login</h2>
        <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" className={styles.authInput} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className={styles.authInput} onChange={handleChange} required />
        <button type="submit" className={styles.authButton} >Login</button>
        </form>
        <Link to="/signup" className={styles.authLink}>Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
