export default function Dashboard() {
  return (
    <div className="dashboard">

      {/* Page Title */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your system</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">1,245</p>
        </div>

        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-number">860</p>
        </div>

        <div className="stat-card">
          <h3>Blocked Users</h3>
          <p className="stat-number">32</p>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">$12,540</p>
        </div>

      </div>

      {/* Content Grid */}
      <div className="dashboard-grid">

        {/* Recent Users */}
        <div className="dashboard-card">
          <h2>Recent Users</h2>

          <ul className="list">
            <li>John Doe</li>
            <li>Sarah Smith</li>
            <li>Alex Johnson</li>
            <li>Emma Brown</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h2>Quick Actions</h2>

          <div className="action-grid">
            <button>Add User</button>
            <button>View Users</button>
            <button>Settings</button>
          </div>
        </div>

      </div>

    </div>
  );
}
