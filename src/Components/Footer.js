import { useTranslation } from "react-i18next";
import logo from "../assets/images/Voco.png"; // adjust path if needed

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
            <li>{t("footer.links.words")}</li>
            <li>{t("footer.links.videos")}</li>
            <li>{t("footer.links.mcqs")}</li>
            <li>{t("footer.links.progress")}</li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="footer-column">
          <h4>{t("footer.sections.company")}</h4>
          <ul>
            <li>{t("footer.links.about")}</li>
            <li>{t("footer.links.contact")}</li>
            <li>{t("footer.links.privacy")}</li>
            <li>{t("footer.links.terms")}</li>
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
// This line is just for testing purposes.