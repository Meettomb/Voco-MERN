import { useState } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";
import FullScreenLoader from "../../Components/FullScreenLoader";
import axios from "axios";

export default function EnterNewPassword() {

  usePageTitle("Enter New Password");

  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [messageType, setMessageType] = useState("");

  const validate = () => {

    if (!password) {
      setError(t("EnterNewPassword.errors.passwordRequired"));
      return false;
    }

    if (password.length < 6) {
      setError(t("EnterNewPassword.errors.passwordLength"));
      return false;
    }

    if (!confirmPassword) {
      setError(t("EnterNewPassword.errors.confirmPasswordRequired"));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t("EnterNewPassword.errors.passwordMismatch"));
      return false;
    }

    setError("");
    setApiError("");
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate();

    if (!isValid) return;

    try {

      setLoading(true);
      setApiError("");

      const otpData = JSON.parse(
        localStorage.getItem("otpData")
      );

      if (!otpData?.email) {
        setApiError("Email not found");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/ForgotPassword/forgotPasswordReset",
        {
          email: otpData.email,
          newPassword: password,
          confirmPassword: confirmPassword,
        }
      );

      if (response.data.status === 1) {

        localStorage.removeItem("otpData");
        localStorage.removeItem("otpExpiry");

        setSuccessMsg(response.data.message);
        setMessageType("success");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

      } else {

        setApiError(response.data.message);

      }

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Server error";

      setApiError(msg);
      setSuccessMsg(msg);
      setMessageType("error");

    } finally {

      setLoading(false);

    }
  };


  const handleBack = () => {
    window.history.back();
  };


  return (
    <>
      {loading && <FullScreenLoader />}
      {successMsg && (
        <span className={`app-message ${messageType === "success" ? "success" : "error"}`}
        >
          {successMsg}
        </span>
      )}
      <div className="newpass-page">

        <div className="newpass-page__card">

          {/* HEADER */}

          <div className="newpass-page__header">

            <button
              className="newpass-page__backBtn"
              onClick={handleBack}
              type="button"
            >

              {/* SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>

            </button>

            <h2 className="newpass-page__title">
              {t("EnterNewPassword.title")}
            </h2>

          </div>


          <p className="newpass-page__subtitle">
            {t("EnterNewPassword.subtitle")}
          </p>


          <form onSubmit={handleSubmit}>

            {/* PASSWORD */}

            <div className="newpass-page__field">

              <label className="newpass-page__label">
                {t("EnterNewPassword.passwordLabel")}
              </label>

              <div className="newpass-page__inputWrap">

                <input
                  type={showPass ? "text" : "password"}
                  className="newpass-page__input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setApiError("");
                  }}
                />

                <button
                  type="button"
                  className="newpass-page__eye"
                  onClick={() => setShowPass(!showPass)}
                >

                  {showPass ? (

                    // eye off
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

                    // eye
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

                </button>

              </div>

            </div>


            {/* CONFIRM */}

            <div className="newpass-page__field">

              <label className="newpass-page__label">
                {t("EnterNewPassword.confirmPasswordLabel")}
              </label>

              <div className="newpass-page__inputWrap">

                <input
                  type={showConfirm ? "text" : "password"}
                  className="newpass-page__input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                    setApiError("");
                  }}
                />

                <button
                  type="button"
                  className="newpass-page__eye"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >

                  {showConfirm ? (
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
                </button>

              </div>


              {error && (
                <span className="newpass-page__error">
                  {error}
                </span>
              )}
              {apiError && (
                <span className="newpass-page__error">
                  {apiError}
                </span>
              )}

            </div>


            <button style={{ cursor: "pointer" }}
              type="submit"
              className="newpass-page__btn"
              disabled={loading}
            >
              {loading ? "Saving..." : t("EnterNewPassword.resetButton")}
            </button>

          </form>

        </div>

      </div>
    </>
  );
}