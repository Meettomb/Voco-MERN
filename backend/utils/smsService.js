import twilio from "twilio";

const TWILIO_NO = process.env.TWILIO_NO;
const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

/**
 * SMS Service (similar to email service)
 * @param {string} to - recipient number
 * @param {string} type - otp | success | reset
 * @param {string} value - dynamic value (otp etc.)
 */
export const smsService = async (to, type, value) => {
  try {
    let message = "";

    // OTP SMS
    if (type === "otp") {
      message = `LearnVoco OTP: ${value}. Valid for 2 minutes.`;
    }

    // SUCCESS SMS
    if (type === "success") {
      message = `LearnVoco: Registration successful 🎉 Welcome aboard!`;
    }

    // RESET PASSWORD SMS
    if (type === "reset") {
      message = `LearnVoco: Your password has been reset successfully. If not you, contact support.`;
    }

    // fallback safety
    if (!message) {
      throw new Error("Invalid SMS type");
    }

    const response = await client.messages.create({
      body: message,   // correct field
      from: TWILIO_NO,
      to: to,
    });

    return {
      status: 1,
      message: "SMS sent successfully",
      sid: response.sid,
    };

  } catch (error) {
    console.error("SMS Error:", error.message);

    return {
      status: 0,
      message: "Failed to send SMS",
      error: error.message,
    };
  }
};