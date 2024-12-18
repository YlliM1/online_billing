import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = sessionStorage.getItem('user_name');
    const lastActivity = sessionStorage.getItem('last_activity');
    const now = new Date().getTime();

    if (storedName) {
      if (lastActivity && now - lastActivity > 45 * 60 * 1000) {
        alert("Session expired. Please log in again.");
        handleLogout();
      } else {
        setUserName(storedName);
        sessionStorage.setItem('last_activity', now);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/online_billing/server/php/logout.php', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.clear();
        navigate('/login');
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <div>
      {/* Use Navbar Component */}
      <Navbar userName={userName} handleLogout={handleLogout} />

      {/* Dashboard Content */}
      <div className="container mt-4">
        <h1>Welcome to the Dashboard</h1>
        {/* Add dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
