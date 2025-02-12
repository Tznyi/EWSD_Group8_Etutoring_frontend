import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';

function App() {

  const [userRole, setUserRole] = useState(null); // Initially null, to wait for API

  useEffect(() => {
    // Simulate fetching user role from an API
    const fetchUserRole = async () => {
      try {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulated API response (Replace this with actual API call in future)
        const response = { role: "staff" }; // Change this for testing other roles

        setUserRole(response.role); // Update state with fetched role
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("student"); // Default to student if API fails
      }
    };

    fetchUserRole();
  }, []);

  // Show loading state while waiting for role
  if (!userRole) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <div className="container">
        <Sidebar role = {userRole}/>
        <div className="main-content">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;