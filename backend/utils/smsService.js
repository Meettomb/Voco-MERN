import twilio from "twilio";

const TWILIO_NO = process.env.TWILIO_NO;
const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

export const sendOTP = async (to, type, value) => {
    try {
        let message = "";

        if (type === "otp") {
            message = `LearnVoco OTP: ${value}. Valid for 2 minutes.`;
        } else if (type === "success") {
            message = `LearnVoco: Registration successful. Welcome aboard!`;
        } else if (type === "reset") {
            message = `LearnVoco: Your password has been reset successfully. If not you, contact support.`;
        } else {
            throw new Error("Invalid SMS type");
        }

        console.log("========== SMS DEBUG ==========");
        console.log("To:", to);
        console.log("From:", TWILIO_NO);
        console.log("Type:", type);
        console.log("Account SID exists:", !!ACCOUNT_SID);
        console.log("Auth Token exists:", !!AUTH_TOKEN);
        console.log("===============================");

        const response = await client.messages.create({
            body: message,
            from: TWILIO_NO,
            to,
        });

        console.log("Twilio SID:", response.sid);
        console.log("Twilio Status:", response.status);

        return {
            status: 1,
            message: "SMS sent successfully",
            sid: response.sid,
        };

    } catch (error) {
        console.error("========== TWILIO ERROR ==========");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Status:", error.status);
        console.error("More Info:", error.moreInfo);
        console.error("==================================");

        return {
            status: 0,
            message: "Failed to send SMS",
            error: error.message,
            code: error.code,
            statusCode: error.status,
        };
    }
};