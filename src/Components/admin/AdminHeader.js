import { useState, useRef, useEffect } from "react";
import { COMPANY_NAME } from "../../hooks/usePageTitle";
import { Link, Outlet } from "react-router-dom";

export default function AdminSidebar() {

  const [openUser, setOpenUser] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleCollapse = () => {
    setCollapsed(v => !v);
    setOpenUser(false);
  };


  const handleNavClick = () => {
    setCollapsed(true);
    setOpenUser(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className="layout">

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

        <div className="logo-row">
          <Link to="/admin" onClick={handleNavClick} className="logo_link">
            <div className="logo">
              <span className="logo-first">
                {COMPANY_NAME.charAt(0)}
              </span>
              {!collapsed && COMPANY_NAME.slice(1)}
            </div>
          </Link>

        </div>

        <nav className="nav">

          <Link to="/admin" className="nav-item" onClick={handleNavClick}>
            <svg viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <button className="nav-item" onClick={() => setOpenUser(v => !v)}>
            <svg viewBox="0 0 24 24">
              <path d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
            </svg>

            {!collapsed && <span>User Management</span>}

            {!collapsed && (
              <svg className={openUser ? "arrow open" : "arrow"} viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" />
              </svg>
            )}
          </button>

          {openUser && !collapsed && (
            <div className="submenu">
              <Link to="/admin/users/all_users" onClick={handleNavClick}>All Users</Link>
              <Link to="/admin/users/all_active" onClick={handleNavClick}>Active Users</Link>
              <Link to="/admin/users/all_blocked" onClick={handleNavClick}>Blocked Users</Link>
            </div>
          )}

          <Link to="/admin/settings" className="nav-item" onClick={handleNavClick}>
            <svg viewBox="0 0 24 24">
              <path d="M19.14 12.94a7.14 7.14 0 0 0 .05-.94 7.14 7.14 0 0 0-.05-.94l2.03-1.58-1.92-3.32-2.39.96a7.17 7.17 0 0 0-1.63-.94l-.36-2.54h-3.8l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58a7.14 7.14 0 0 0-.05.94c0 .32.02.63.05.94L2.82 14.6l1.92 3.32 2.39-.96c.5.42 1.05.77 1.63.94l.36 2.54h3.8l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96 1.92-3.32-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
            </svg>

            {!collapsed && <span>Settings</span>}
          </Link>

        </nav>
      </div>

      {!collapsed && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(true)} />
      )}
      {!collapsed && <div className="sidebar-overlay" onClick={() => setCollapsed(true)} />}

      <div className="main">

        <div className="topbar">

          <button className="menu-btn" onClick={toggleCollapse}>
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <div className="profile" ref={profileRef}>
            <button className="profile-btn" onClick={() => setProfileOpen(v => !v)}>
              <svg viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
              </svg>
            </button>

            {profileOpen && (
              <div className="profile-menu">
                <Link to="#" onClick={() => setProfileOpen(false)}>Profile</Link>
                <Link to="#" onClick={() => setProfileOpen(false)}>Logout</Link>
              </div>
            )}
          </div>

        </div>

        <div className="content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}
