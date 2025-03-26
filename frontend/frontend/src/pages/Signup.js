import React, {useState} from "react";
import styles from "../styles/Auth.module.css";
import { Link } from "react-router-dom";
import { signup } from "../api/auth";


const Signup = () => {
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await signup(formData);
        alert("Signup successful! You can now log in.");
      } catch (error) {
        alert("Signup failed. Check console for details.");
      }
    };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h2 className={styles.authTitle}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
        <input type="text" name= "username" placeholder="Username" className={styles.authInput} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className={styles.authInput} onChange={handleChange} required/>
        <input type="password" name="password" placeholder="Password" className={styles.authInput} onChange={handleChange} required />
        <button type="submit" className={styles.authButton} >Sign Up</button>
        </form>
        <Link to="/login" className={styles.authLink}>Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
