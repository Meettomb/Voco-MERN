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

  const openSidebar = () => {
    setCollapsed(false);
  };

  const closeSidebar = () => {
    setCollapsed(true);
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

        <nav className="nav" onMouseEnter={openSidebar}
          onMouseLeave={closeSidebar}>

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
              <Link to="/admin/users/all-users" onClick={handleNavClick}>All Users</Link>
              <Link to="/admin/users/all-active" onClick={handleNavClick}>Active Users</Link>
              <Link to="/admin/users/all-blocked" onClick={handleNavClick}>Blocked Users</Link>
            </div>
          )}

          <Link to="/admin/settings" className="nav-item" onClick={handleNavClick}>
            <svg viewBox="0 -960 960 960">
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" />
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

          <button className="menu-btn" onClick={() => setCollapsed(v => !v)}>
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
                <Link to="/" onClick={() => setProfileOpen(false)}>Client side</Link>
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
