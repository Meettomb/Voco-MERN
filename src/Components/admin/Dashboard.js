import React, { useEffect, useState } from "react";
import axios from "axios";
import usePageTitle from "../../hooks/usePageTitle";



export default function Dashboard() {
  usePageTitle("Dashboard");

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL

  const [dashboard, setDashboard] = useState(null);


  const getDashboard = async () => {
    try {

      const res = await axios.get(
        `${REACT_APP_API_URL}/dashboard/data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setDashboard(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    getDashboard();

    const interval = setInterval(() => {
      getDashboard();
    }, 5000); // refresh every 5 sec

    return () => clearInterval(interval);

  }, []);


  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your system</p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-left">
            <p>Total Users</p>
            <h3>{dashboard?.counts.totalUsers}</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Active Users</p>
            <h3>{dashboard?.counts.activeUsers}</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Unactive Users</p>
            <h3>{dashboard?.counts.blockedUsers}</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm5 13.6L8.4 7 7 8.4 15.6 17Z" />
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Total Languages</p>
            <h3>{dashboard?.counts.totalLanguages}</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M12 3v2a7 7 0 1 1-7 7H3a9 9 0 1 0 9-9z" />
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Total MCQs</p>
            <h3>{dashboard?.counts.totalMcq}</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M3 5h18v2H3zM3 11h12v2H3zM3 17h18v2H3z" />
          </svg>
        </div>

      </div>

      {/* ================= GRID ================= */}
      <div className="dashboard-grid">

        {/* Recent Users */}
        <div className="dashboard-card">

          <div className="card-header">
            <h2>Recent Users</h2>
          </div>

          <ul className="data-list">
            {dashboard?.recentUsers?.map((u, i) => (
              <li key={i}>{u.username}</li>
            ))}
          </ul>

        </div>

        {/* System Status */}
        <div className="dashboard-card">

          <div className="card-header">
            <h2>System Status</h2>
          </div>

          <ul className="status-list">
            <li>
              Server:
              <span className={
                dashboard?.system.server === "Online"
                  ? "green"
                  : "red"
              }>
                {dashboard?.system.server}
              </span>
            </li>

            <li>
              Database: {dashboard?.system.database}
            </li>

            <li>
              API: {dashboard?.system.api}
            </li>
          </ul>

        </div>


        {/* AI Services */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>AI Services</h2>
          </div>

          <ul className="status-list">
            {dashboard?.system?.aiServices?.map((service) => (
              <li key={service.name}>
                {service.name}:
                <span
                  className={
                    service.status === "Running"
                      ? "green"
                      : service.status === "Checking"
                        ? ""
                        : "red"
                  }
                >
                  {service.status}
                </span>
              </li>
            ))}
          </ul>
        </div>


      </div>

    </div>
  );
}
