import { useState, useEffect, useRef } from "react";
import '../Style/index.css';
import { COMPANY_NAME } from "../hooks/usePageTitle";
import Logo from '../assets/images/Voco.png';
import { useTranslation } from 'react-i18next';

function Header({onOpen}) {
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
              <li>{t("nav.home")}</li>
              <li>{t("nav.learnWords")}</li>
              <li>{t("nav.videos")}</li>
              <li>{t("nav.mcqs")}</li>
              <li>{t("nav.practice")}</li>
              <li>{t("nav.progress")}</li>

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
        <div
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          role="button"
        >
          <svg viewBox="0 -960 960 960">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </div>

        <ul>
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

          <li>{t("nav.home")}</li>
          <li>{t("nav.learnWords")}</li>
          <li>{t("nav.videos")}</li>
          <li>{t("nav.mcqs")}</li>
          <li>{t("nav.practice")}</li>
          <li>{t("nav.progress")}</li>
          <li className="auth-link" onClick={onOpen}>{t("nav.login")}</li>
        </ul>
      </div>
    </header>
  );
}


export default Header;
