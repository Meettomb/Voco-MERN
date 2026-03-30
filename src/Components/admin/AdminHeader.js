import { useState, useRef, useEffect } from "react";
import { COMPANY_NAME } from "../../hooks/usePageTitle";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminSidebar() {

  const [openUser, setOpenUser] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openWords, setOpenWords] = useState(false);
  const [openMcqs, setOpenMcqs] = useState(false);

  const [collapsed, setCollapsed] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');
  
  const handelLogout = () =>{
    localStorage.removeItem('token');
    navigate('/');
  }

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
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
            </svg>

            {!collapsed && <span>Dashboard</span>}
          </Link>

          <button className="nav-item" onClick={() => setOpenUser(v => !v)}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
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
              <Link to="users/all-users" onClick={handleNavClick}>All Users</Link>
              <Link to="users/active-users" onClick={handleNavClick}>Active Users</Link>
            </div>
          )}

          {/* =======================
   Language Management
======================= */}

          <Link
            to="language/ui-languages"
            className="nav-item"
            onClick={handleNavClick}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3a15 15 0 0 1 0 18" />
              <path d="M12 3a15 15 0 0 0 0 18" />
            </svg>



            {!collapsed && <span>Supported UI Languages</span>}
          </Link>

          <button
            className="nav-item"
            onClick={() => setOpenLanguage(v => !v)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3V4z" />
              <path d="M7 4v16" />
            </svg>



            {!collapsed && <span>Learning Languages</span>}

            {!collapsed && (
              <svg
                className={openLanguage ? "arrow open" : "arrow"}
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5" />
              </svg>
            )}
          </button>

          {openLanguage && !collapsed && (
            <div className="submenu">

              <Link
                to="language/learning-languages/add"
                onClick={handleNavClick}
              >
                Add Learning Language
              </Link>

              <Link
                to="language/learning-languages/view-all-learning-languages"
                onClick={handleNavClick}
              >
                Manage Learning Languages
              </Link>

            </div>
          )}




          {/* =======================
   Words Management
======================= */}
          <button className="nav-item" onClick={() => setOpenWords(v => !v)}>
            <svg viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="4" rx="1" />
              <rect x="4" y="10" width="16" height="4" rx="1" />
              <rect x="4" y="16" width="10" height="4" rx="1" />
            </svg>



            {!collapsed && <span>Words Management</span>}

            {!collapsed && (
              <svg className={openWords ? "arrow open" : "arrow"} viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" />
              </svg>
            )}
          </button>

          {openWords && !collapsed && (
            <div className="submenu">
              <Link to="words/add" onClick={handleNavClick}>Add Words</Link>
              <Link to="words/ViewLanguages" onClick={handleNavClick}>Manage Words</Link>
            </div>
          )}

          {/* =======================
   MCQs Management
======================= */}
          <button className="nav-item" onClick={() => setOpenMcqs(v => !v)}>
            <svg viewBox="0 0 24 24">
              <circle cx="5" cy="7" r="2" />
              <circle cx="5" cy="12" r="2" />
              <circle cx="5" cy="17" r="2" />
              <path d="M10 7h10" />
              <path d="M10 12h10" />
              <path d="M10 17h10" />
            </svg>



            {!collapsed && <span>MCQs Management</span>}

            {!collapsed && (
              <svg className={openMcqs ? "arrow open" : "arrow"} viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5" />
              </svg>
            )}
          </button>

          {openMcqs && !collapsed && (
            <div className="submenu">
              <Link to="mcq/add" onClick={handleNavClick}>Add MCQs</Link>
              <Link to="mcq/manage" onClick={handleNavClick}>Manage MCQs</Link>
            </div>
          )}

          {/* 
          <Link to="/admin/settings" className="nav-item" onClick={handleNavClick}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
            </svg>

            {!collapsed && <span>Settings</span>}
          </Link> */}

        </nav>


      </div>

      {!collapsed && (
        <div className="sidebar-overlay" onClick={() => setCollapsed(true)} />
      )}


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
                <Link to="/profile" onClick={() => setProfileOpen(false)}>Profile</Link>
                <Link to="/" onClick={() => setProfileOpen(false)}>Client side</Link>

                {isLoggedIn &&
                  <Link to="#" 
                  onClick={(e)=>{
                    e.preventDefault(); 
                    handelLogout(); 
                    setProfileOpen(false);
                  }}
                  >Logout</Link> 

                }
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
