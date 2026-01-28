import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function RegisterPopup({ onClose, onOpenSignIn }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle("Registration");
  /* Lock background scroll */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;



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
      newErrors.username = t("signUp.errors.usernameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("signUp.errors.emailRequired");
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = t("signUp.errors.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("signUp.errors.phoneRequired");
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = t("signUp.errors.phoneInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("signUp.errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("signUp.errors.passwordLength");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("signUp.errors.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("signUp.errors.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Registration data:", formData);

    setFormData({
      username:"",
      email:"",
      phone:"",
      password:""
    })

    setErrors({});
    onClose();

    // Navigate to the OTP Page
    navigate("/OtpVerify",{
      state:{
        username:formData.username,
        email:formData.email,
        phone: formData.phone,
        password:formData.password
      }
    })

    

  };

  return (
    <main className="signIn_main">
      <div className="signin-overlay" onClick={onClose}>
        <div className="signin-modal" onClick={(e) => e.stopPropagation()}>
          <button className="signin-close" onClick={onClose} aria-label="Close">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>


          <h2 className="signin-title">{t("signUp.title")}</h2>
          <p className="signin-subtitle">{t("signUp.subtitle")}</p>

          <form className="signin-form" onSubmit={submitForm}>
            {/* Username */}
            <div className="form-group">
              <label>{t("signUp.usernameLabel")}</label>
              <div className="input-icon-wrapper">
                {/* User Icon */}
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
                  placeholder={t("signUp.usernamePlaceholder")}
                  className={errors.username ? "error" : ""}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>


            {/* Email */}
            <div className="form-group">
              <label>{t("signUp.emailLabel")}</label>
              <div className="input-icon-wrapper">
                {/* Email Icon */}
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16v12H4z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M4 6l8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("signUp.emailPlaceholder")}
                  className={errors.email ? "error" : ""}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>


            {/* Phone */}
            <div className="form-group">
              <label>{t("signUp.phoneLabel")}</label>
              <div className="input-icon-wrapper">
                {/* Phone Icon */}
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 3h4l2 5-3 2c1.5 3 3.5 5 6.5 6.5l2-3 5 2v4c0 1-1 2-2 2-9 0-16-7-16-16 0-1 1-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("signUp.phonePlaceholder")}
                  className={errors.phone ? "error" : ""}
                />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>


            {/* Password */}
            <div className="form-group">
              <label>{t("signUp.passwordLabel")}</label>
              <div className="input-icon-wrapper">
                {/* Lock Icon */}
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
                  placeholder={t("signUp.passwordPlaceholder")}
                  className={errors.password ? "error" : ""}
                />

                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    /* Eye Off */
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M2 12s4-6 10-6 10 6 10 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
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

            {/* Confirm Password */}
            <div className="form-group">
              <label>{t("signUp.confirmPasswordLabel")}</label>
              <div className="input-icon-wrapper">
                {/* Lock Icon */}
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
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("signUp.confirmPasswordPlaceholder")}
                  className={errors.confirmPassword ? "error" : ""}
                />

                <span
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    /* Eye Off */
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M2 12s4-6 10-6 10 6 10 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
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

              {errors.confirmPassword && (
                <span className="error-text">
                  {errors.confirmPassword}
                </span>
              )}
            </div>


            <button type="submit" className="btn-login">
              {t("signUp.signUpButton")}
            </button>

            <p className="signin-register">
              {t("signUp.haveAccount")}{" "}
              <span
                className="register-link"
                onClick={() => {
                  onClose();
                  onOpenSignIn();
                }}
              >
                {t("signUp.signIn")}
              </span>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default RegisterPopup;
