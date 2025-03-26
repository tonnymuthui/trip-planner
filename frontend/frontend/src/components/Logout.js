const Logout = () => {
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    };
  
    return <button onClick={handleLogout}>Logout</button>;
  };
  
  export default Logout;
  