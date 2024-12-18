import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ userName, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark "  style={{ backgroundColor: 'royalblue' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Logo</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link active" aria-current="page">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/team" className="nav-link">
                Team
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/invoices" className="nav-link">
                Invoices
              </Link>
            </li>
          </ul>
          <span className="navbar-text">
            Welcome, {userName ? userName : 'Guest'}
          </span>
          {userName && (
            <button
              className="btn btn-outline-light btn-sm ms-3"
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

export default Navbar;
