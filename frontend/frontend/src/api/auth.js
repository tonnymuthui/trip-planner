// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/auth/";

// export const registerUser = async (userData) => {
//   return axios.post(`${API_URL}registration/`, userData);
// };

// export const loginUser = async (userData) => {
//   return axios.post(`${API_URL}login/`, userData);
// };
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; 

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, userData);
    console.log("Signup successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, credentials);
    console.log("Login successful:", response.data);

    
    localStorage.setItem("authToken", response.data.authToken);  
    localStorage.setItem("refreshToken", response.data.refreshToken);
    

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};
