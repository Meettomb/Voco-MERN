import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function SignInPopup({ onClose, onOpenRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  /* Lock background scroll */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  /* Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* Validation */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t("signIn.errors.emailRequired");
    } else if (!emailRegex.test(formData.username.trim())) {
      newErrors.username = "Please enter a valid email address";
    }


    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  /* Submit */
  const submitForm = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Valid form data:", formData);

    // API call here
  };

  return (
    <main className="signIn_main">
      <div className="signin-overlay" onClick={onClose}>
        <div
          className="signin-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button className="signin-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h2 className="signin-title">{t("signIn.title")}</h2>
          <p className="signin-subtitle">
            {t("signIn.subtitle")}</p>

          <form className="signin-form" onSubmit={submitForm}>
            {/* Username */}
            <div className="form-group">
              <label>{t("signIn.emailLabel")}</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M20 21c0-4.418-3.582-8-8-8s-8 3.582-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t("signIn.emailPlaceholder")}
                  className={errors.username ? "error" : ""}
                />
              </div>
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>{t("signIn.passwordLabel")}</label>
              <div className="input-icon-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 10V7a4 4 0 118 0v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("signIn.passwordPlaceholder")}
                  className={errors.password ? "error" : ""}
                />

                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </span>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="btn-login">
              {t("signIn.loginButton")}
            </button>

            <p className="signin-register">
              {t("signIn.noAccount")}{" "}
              <span
                className="register-link"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
              >
                {t("signIn.register")}
              </span>

            </p>

          </form>
        </div>
      </div>
    </main>
  );
}

export default SignInPopup;
