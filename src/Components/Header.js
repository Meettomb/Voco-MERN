import { useState, useEffect, useRef } from "react";
import '../Style/index.css';
import { COMPANY_NAME } from "../hooks/usePageTitle";
import Logo from '../assets/images/Voco.png';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

function Header({ onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const sideNavRef = useRef(null);

  // Disable background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu when clicking outside
  const handleBackdropClick = () => {
    setMenuOpen(false);
  };



  return (
    <header className="header">
      <div className="outer_header_div">
        <nav className="navbar">
          {/* Logo */}
          <div className="logo">
            <img
              id="logo"
              className="logoImage"
              src={Logo}
              alt={`${COMPANY_NAME} Logo`}
            />
            <p>{COMPANY_NAME}</p>
          </div>

          {/* Desktop Links */}
          <div className="header_links_section">
            <ul>
              <li>
                <Link to="/">{t("nav.home")}</Link>
              </li>

              <li>
                <Link to="/learn-words">{t("nav.learnWords")}</Link>
              </li>

              <li>
                <Link to="/videos">{t("nav.videos")}</Link>
              </li>

              <li>
                <Link to="/mcqs">{t("nav.mcqs")}</Link>
              </li>

              <li>
                <Link to="/practice">{t("nav.practice")}</Link>
              </li>
              <li>
                <Link to="/progress">{t("nav.progress")}</Link>
              </li>

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

              <li className="auth-link" onClick={onOpen}>{t("nav.login")}</li>
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
            <Link to="/learn-words" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 -960 960 960">
                <path d="M160-120v-720l640 360-640 360Z" />
              </svg>
              {t("nav.learnWords")}
            </Link>
          </li>

          <li>
            <Link to="/videos" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 -960 960 960">
                <path d="m380-300 280-180-280-180v360Z" />
              </svg>
              {t("nav.videos")}
            </Link>
          </li>

          <li>
            <Link to="/mcqs" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 -960 960 960">
                <path d="M160-120v-720h640v720H160Z" />
              </svg>
              {t("nav.mcqs")}
            </Link>
          </li>

          <li>
            <Link to="/practice" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 -960 960 960">
                <path d="M440-200h80v-240h240v-80H520v-240h-80v240H200v80h240v240Z" />
              </svg>
              {t("nav.practice")}
            </Link>
          </li>

          <li>
            <Link to="/progress" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 -960 960 960">
                <path d="M200-160v-80h560v80H200Zm0-160v-360h80v360h-80Zm200 0v-480h80v480h-80Zm200 0v-240h80v240h-80Z" />
              </svg>
              {t("nav.progress")}
            </Link>
          </li>
        </ul>



        {/* Auth CTA */}
        <button className="side-nav-auth" onClick={onOpen}>
          {t("nav.login")}
        </button>
      </div>


    </header>
  );
}


export default Header;
