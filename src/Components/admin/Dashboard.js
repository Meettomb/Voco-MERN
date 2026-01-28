import React from "react";
import usePageTitle from "../../hooks/usePageTitle";

export default function Dashboard() {

  usePageTitle("Dashboard");

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
            <h3>1,245</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z"/>
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Active Users</p>
            <h3>860</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Blocked Users</p>
            <h3>32</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm5 13.6L8.4 7 7 8.4 15.6 17Z"/>
          </svg>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <p>Revenue</p>
            <h3>$12,540</h3>
          </div>

          <svg viewBox="0 0 24 24" className="stat-icon">
            <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5z"/>
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
            <li>John Doe</li>
            <li>Sarah Smith</li>
            <li>Alex Johnson</li>
            <li>Emma Brown</li>
          </ul>

        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">

          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="action-grid">
            <button>Add User</button>
            <button>View Users</button>
            <button>Add Words</button>
            <button>Add MCQs</button>
          </div>

        </div>

        {/* System Status */}
        <div className="dashboard-card">

          <div className="card-header">
            <h2>System Status</h2>
          </div>

          <ul className="status-list">
            <li>Server: Online</li>
            <li>Database: Connected</li>
            <li>API: Running</li>
          </ul>

        </div>

        {/* Top Languages */}
        <div className="dashboard-card">

          <div className="card-header">
            <h2>Top Learning Languages</h2>
          </div>

          <ul className="data-list">
            <li>English</li>
            <li>Spanish</li>
            <li>French</li>
            <li>Hindi</li>
          </ul>

        </div>

      </div>

    </div>
  );
}
