import { useState } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";

function OtpVerify() {
  const { t } = useTranslation();

    usePageTitle("Verify OTP");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    // Verify OTP API call here
  };

  return (
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
              />
            ))}
          </div>

          <button className="otp-btn" type="submit">
            {t("OtpPage.verifyButton")}
          </button>
        </form>

        <p className="otp-resend">
          {t("OtpPage.notReceived")}{" "}
          <span>{t("OtpPage.resend")}</span>
        </p>
      </div>
    </div>
  );
}

export default OtpVerify;
