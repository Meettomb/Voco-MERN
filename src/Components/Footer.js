import { useTranslation } from "react-i18next";
import logo from "../assets/images/Voco.png"; // adjust path if needed
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand / Logo */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="VOCO Logo" />
            <h3>VOCO</h3>
          </div>
          <p>{t("footer.tagline")}</p>
        </div>

        {/* Product Links */}
        <div className="footer-column">
          <h4>{t("footer.sections.product")}</h4>
          <ul>
            <li>
              <Link to="/choose-learning-language"
                state={{ target: "learn-words" }}
              >
                {t("footer.links.words")}
              </Link>
            </li>
            <li>
              <Link to="/choose-learning-language"
                state={{ target: "videos" }}
              >
                {t("footer.links.videos")}
              </Link>
            </li>
            <li>
              <Link to="/ai-based-learning">
                {t("footer.links.aiBasedLearning")}
              </Link>
            </li>
          
          </ul>
        </div>

        {/* Company Links */}
        <div className="footer-column">
          <h4>{t("footer.sections.company")}</h4>
          <ul>
            <li>
              <Link to="/about" target="blanck">{t("footer.links.about")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("footer.links.contact")}</Link>
            </li>
            <li>
              <Link to="/privacy-policy" target="blanck">{t("footer.links.privacy")}</Link>
            </li>
            <li>
              <Link to="/terms-of-use" target="blanck">{t("footer.links.terms")}</Link>
            </li>
          </ul>
        </div>

        {/* Languages */}
        <div className="footer-column">
          <h4>{t("footer.sections.language")}</h4>
          <p className="footer-language">
            {t("footer.languageNote")}
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VOCO</span>
        <span>{t("footer.rights")}</span>
      </div>
    </footer>
  );
}

export default Footer;
