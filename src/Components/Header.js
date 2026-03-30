import { useState, useEffect, useRef } from "react";
import '../Style/index.css';
import { COMPANY_NAME } from "../hooks/usePageTitle";
import Logo from '../assets/images/Voco.png';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import getUser from "../utils/getUser.js";
import axios from "axios";


function Header({ onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('token');
  const profileRef = useRef(null);
  const { t, i18n } = useTranslation();
  const sideNavRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const target = location.state?.target;

  const [userData, setUserData] = useState(null);

  // get data from token
  const user = getUser();
  const id = user?.id;


  const handelLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  }

  useEffect(() => {
    if (id) {
      getLoginUserData();
    }
  }, [id]);
  const role = userData?.role;

  const getLoginUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/userModel/getUserDataById/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      );

      setUserData(response.data.data);

    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);


  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when clicking outside
  const handleBackdropClick = () => {
    setMenuOpen(false);
  };

  // const handleSideNavNavigate = () => {
  //   setProfileOpen(false);
  //   setMenuOpen(false);
  // };


  return (
    <header className="header">
      <div className="outer_header_div">
        <nav className="navbar">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img
                id="logo"
                className="logoImage"
                src={Logo}
                alt={`${COMPANY_NAME} Logo`}
              />
              <p>{COMPANY_NAME}</p>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="header_links_section">
            <ul>
              <li>
                <Link to="/">{t("nav.home")}</Link>
              </li>

              <li>
                <Link to="/choose-learning-language"
                  state={{ target: "learn-words" }}
                  className={target === "learn-words" ? "active-link" : ""}
                >
                  {t("nav.learnWords")}
                </Link>
              </li>

              <li>
                <Link
                  to="/choose-learning-language"
                  state={{ target: "videos" }}
                  className={target === "videos" ? "active-link" : ""}
                >
                  {t("nav.videos")}
                </Link>

              </li>

              <li>
                <Link to="/choose-learning-language"
                  state={{ target: "mcqs-exam" }}
                  className={target === "mcqs-exam" ? "active-link" : ""}
                >
                  {t("nav.mcqs")}
                </Link>
              </li>

              {/* <li>
                <Link to="/progress">{t("nav.progress")}</Link>
              </li> */}

              <li>
                <select
                  className="language-select"
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </li>

              {!isLoggedIn ? (
                <li className="auth-link" onClick={onOpen}>{t("nav.login")}</li>
              ) : (
                <li className="profile-wrapper" ref={profileRef}>
                  <button
                    className="profile-btn"
                    onClick={() => setProfileOpen(v => !v)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="profile-dropdown">
                      <Link to="/profile" onClick={() => setProfileOpen(false)}>{t("nav.profile")}</Link>

                      <Link to="/settings" onClick={() => setProfileOpen(false)}>
                        {t("nav.settings")}
                      </Link>

                      {role === "admin" && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)}>
                          {t("nav.adminPanel")}
                        </Link>
                      )}

                      <button onClick={handelLogout}>{t("nav.logout")}</button>

                    </div>
                  )}
                </li>
              )}

            </ul>
          </div>

          {/* Hamburger */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            role="button"
          >
            <svg viewBox="0 -960 960 960">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="side-nav-backdrop" onClick={handleBackdropClick} />
      )}

      {/* Side Nav */}
      <div
        ref={sideNavRef}
        className={`side-nav ${menuOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="side-nav-content">
          {/* Header */}
          <div className="side-nav-header">
            <div className="side-nav-brand">
              <img src={Logo} alt="VOCO" />
              <span>VOCO</span>
            </div>

            <button
              className="close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 -960 960 960">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          </div>

          {/* Profile OR Login */}
          {isLoggedIn ? (
            <div className="side-nav-profile">
              <button
                className="side-profile-btn"
                onClick={() => setProfileOpen(v => !v)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a5 5 0 1 0-0.001-10.001A5 5 0 0 0 12 12zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
                </svg>

                <span>{t("nav.myProfile")}</span>
              </button>

              {profileOpen && (
                <div
                  className="side-profile-dropdown"
                  onMouseDown={(e) => e.stopPropagation()}
                >

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    {t("nav.profile")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/settings");
                      setProfileOpen(false);
                      setMenuOpen(false);
                    }}
                  >

                    {t("nav.settings")}
                  </button>

                  {role === "admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/admin");
                        setProfileOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {t("nav.adminPanel")}
                    </button>
                  )}
                </div>
              )}

            </div>
          ) : (null)}



          {/* Language */}
          <div className="side-nav-lang">
            <label>Language</label>
            <select
              className="language-select"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* Links */}
          <ul className="side-nav-links">
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 -960 960 960">
                  <path d="M120-200v-360l360-280 360 280v360H600v-240H360v240H120Z" />
                </svg>
                {t("nav.home")}
              </Link>
            </li>

            <li>
              <Link to="/choose-learning-language" state={{ target: "learn-words" }} onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 -960 960 960">
                  <path d="M160-120v-640q0-33 23.5-56.5T240-840h400q33 0 56.5 23.5T720-760v640
      q-20-12-40-18t-40-6H240q-20 0-40 6t-40 18Zm80-160h320v-80H240v80Zm0-160h400v-80H240v80Zm0-160h400v-80H240v80Z
    " />
                </svg>
                {t("nav.learnWords")}
              </Link>
            </li>

            <li>
              <Link to="/choose-learning-language" state={{ target: "videos" }} onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 -960 960 960">
                  <path d="M160-120v-720l640 360-640 360Z" />
                </svg>
                {t("nav.videos")}
              </Link>
            </li>

            <li>
              <Link to="/choose-learning-language" state={{ target: "mcqs-exam" }} onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 -960 960 960">
                  <path d=" M480-200q-33 0-56.5-23.5T400-280q0-33 23.5-56.5T480-360
      q33 0 56.5 23.5T560-280q0 33-23.5 56.5T480-200Zm-120-240
      q0-66 40-105t80-55q30-12 45-29t15-39q0-33-23.5-56.5T480-760
      q-33 0-56.5 23.5T400-680h-80q0-66 47-113t113-47
      q66 0 113 47t47 113q0 45-23 75t-57 45q-33 14-49 31t-16 49v40h-80v-40Z
    " />
                </svg>
                {t("nav.mcqs")}
              </Link>
            </li>

            {/* <li>
              <Link to="/progress" onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 -960 960 960">
                  <path d="M200-160v-80h560v80H200Zm0-160v-360h80v360h-80Zm200 0v-480h80v480h-80Zm200 0v-240h80v240h-80Z" />
                </svg>
                {t("nav.progress")}
              </Link>
            </li> */}
          </ul>



          {/* Auth CTA */}
          {isLoggedIn ? (
            <button className="side-nav-auth" onClick={handelLogout}>
              Logout
            </button>
          ) : (
            <button className="side-nav-auth" onClick={onOpen}>
              {t("nav.login")}
            </button>
          )}

        </div>
      </div>


    </header>
  );
}


export default Header;
