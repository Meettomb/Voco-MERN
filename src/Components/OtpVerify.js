import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import FullScreenLoader from "../Components/FullScreenLoader";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function OtpVerify() {
  usePageTitle("Verify OTP");

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  const savedData =
    location.state ||
    JSON.parse(localStorage.getItem("otpData") || "{}");

  const { email } = savedData;

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  useEffect(() => {

    const updateTimer = () => {

      const expiry = localStorage.getItem("otpExpiry");

      if (!expiry) {
        setTimer(0);
        return;
      }

      const remaining = Math.floor(
        (parseInt(expiry) - Date.now()) / 1000
      );

      if (remaining <= 0) {
        setTimer(0);
      } else {
        setTimer(remaining);
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);

  }, []);
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {

    const expiry = localStorage.getItem("otpExpiry");

    if (!expiry) {
      const newExpiry = Date.now() + 120000;
      localStorage.setItem("otpExpiry", newExpiry.toString());
    }

  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {

    // If backspace and current empty → go to previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Please enter complete OTP");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${REACT_APP_API_URL}/userModel/verifyOtp`,
        {
          email,
          otp: enteredOtp,
        }
      );

      setLoading(false);

      if (data.status === 1) {
        localStorage.removeItem("otpExpiry");
      localStorage.removeItem("otpData");
        setMessage("Registration successful");
        setMessageType("success");

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        setMessage(data.message);
        setMessageType("error");
      }

    } catch (err) {
      setLoading(false);
      setMessage("Server error");
      setMessageType("error");
    }
  };

  const handleResendOtp = async () => {

    if (timer > 0) return;

    try {

      setLoading(true);

      const { data } = await axios.post(
        `${REACT_APP_API_URL}/userModel/sendOtp`,
        savedData
      );

      setLoading(false);

      if (data.status === 1) {

        setMessage("New OTP sent");
        setMessageType("success");

        const newExpiry = Date.now() + 120000;

        localStorage.setItem("otpExpiry", newExpiry.toString());
        // do NOT trust setTimer only
        setTimer(Math.floor((newExpiry - Date.now()) / 1000));

      } else {

        setMessage(data.message);
        setMessageType("error");

      }

    } catch (err) {

      setLoading(false);
      setMessage("Server error");
      setMessageType("error");

    }
  };
  return (
    <>

      {loading && <FullScreenLoader />}
      {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )}

      <div className="otp-page">



        <div className="otp-card">
          <h2>{t("OtpPage.title")}</h2>

          <p className="otp-subtitle">
            {t("OtpPage.subtitle")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button className="otp-btn" type="submit">
              {t("OtpPage.verifyButton")}
            </button>
          </form>

          <p className="otp-resend">
            {t("OtpPage.notReceived")}{" "}
            <span
              onClick={handleResendOtp}
              style={{
                cursor: timer === 0 ? "pointer" : "not-allowed",
                opacity: timer === 0 ? 1 : 0.5
              }}
            >
              {timer === 0
                ? t("OtpPage.resend")
                : `Resend in ${timer}s`}
            </span>
          </p>
        </div>
      </div>

    </>
  );
}

export default OtpVerify;
