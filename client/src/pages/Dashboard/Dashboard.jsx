import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Chart } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overdueInvoices: 0,
    totalOffers: 0,
    totalUsers: 0,
    monthlyRevenue: [],
    offersByStatus: { approved: 0, rejected: 0, pending: 0 }, // Add this to hold the status data
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = sessionStorage.getItem('user_name');
    const lastActivity = sessionStorage.getItem('last_activity');
    const now = new Date().getTime();

    if (storedName) {
      if (lastActivity && now - lastActivity > 45 * 60 * 1000) {
        alert('Session expired. Please log in again.');
        handleLogout();
      } else {
        setUserName(storedName);
        sessionStorage.setItem('last_activity', now);
        fetchDashboardData();
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
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost/online_billing/server/php/fetch_dashboard_stats.php');
      const data = await response.json();

      if (data.success) {
        setStats({
          totalInvoices: data.stats.totalInvoices || 0,
          totalRevenue: data.stats.totalRevenue || 0,
          pendingPayments: data.stats.pendingPayments || 0,
          overdueInvoices: data.stats.overdueInvoices || 0,
          totalOffers: data.stats.totalOffers || 0,
          totalUsers: data.stats.totalUsers || 0,
          monthlyRevenue: data.stats.monthlyRevenue || [],
          offersByStatus: data.stats.offersByStatus || { approved: 0, rejected: 0, pending: 0 },
        });
      } else {
        alert('Failed to load dashboard data.');
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    }
  };

  // Data for Bar Chart (Revenue for each month)
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats.monthlyRevenue, // Use the monthly revenue data from the state
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for Doughnut Chart (Approved, Rejected, Pending offers)
  const doughnutChartData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [stats.offersByStatus.approved, stats.offersByStatus.rejected, stats.offersByStatus.pending],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        hoverBackgroundColor: ['#45a049', '#d32f2f', '#ffb300'],
      },
    ],
  };

  // Bar chart options to adjust Y-axis
  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,  // Y-axis starts at 0
        ticks: {
          stepSize: 1000,  // Step between ticks (1000, 2000, 3000, etc.)
          callback: function(value) {
            return '$' + value.toLocaleString();  // Format the tick labels as currency (e.g., $1,000)
          },
        },
      },
    },
  };

  return (
    <div>
      <Navbar userName={userName} handleLogout={handleLogout} />
      <div className="dashboard-container">
        <h1>Welcome, {userName}</h1>
        <div className="stats">
          <div className="card">
            <h3>Total Invoices</h3>
            <p>{stats.totalOffers}</p> 
          </div>
          <div className="card">
            <h3>Total Revenue</h3>
            <p>${(Number(stats.totalRevenue) || 0).toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Pending Payments</h3>
            <p>${(Number(stats.pendingPayments) || 0).toFixed(2)}</p> 
          </div>
          <div className="card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers || 0}</p>
          </div>
        </div>
        <div className="charts">
          <div className="chart-container">
            <h3>Monthly Revenue</h3>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="chart-container">
            <h3>Offers Status</h3>
            <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
