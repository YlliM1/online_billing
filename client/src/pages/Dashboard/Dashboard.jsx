import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar</a>
        <button
          data-mdb-collapse-init
          className="navbar-toggler"
          type="button"
          data-mdb-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Team</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Invoices</a>
            </li>
          </ul>
          <span className="navbar-text">
            Welcome {userName ? userName : 'Guest'}
          </span>
          {userName && (
            <button
              className="btn btn-link"
              style={{ textDecoration: 'none', marginLeft: '1rem' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Dashboard;
