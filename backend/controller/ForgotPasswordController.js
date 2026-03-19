import UserModel from "../model/UserModel.js";
import { otpStore } from "../utils/otpStore.js";
import { sendMail } from "../utils/mailService.js";
import bcrypt from "bcrypt";
import e from "express";

export const forgotPasswordOtpSending = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingOtp = otpStore[email];
        if (existingOtp && Date.now() < existingOtp.expiresAt) {
            return res.json({
                status: 0,
                message: "Please wait before requesting new OTP",
            });
        }

        if (existingOtp && Date.now() >= existingOtp.expiresAt) {
            delete otpStore[email];
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 2 * 60 * 1000, // OTP valid for 2 minutes
            lastSent: Date.now(),
            data: { email }
        };

        console.log("OTP STORE:", otpStore);

        await sendMail(
            email,
            "OTP Verification",
            "otp",
            otp
        );

        res.json({ status: 1, message: "OTP sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: "Error sending OTP",
        });
    }
}

export const forgotPasswordOtpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = otpStore[email];
        if (!record) {
            return res.json({ status: 0, message: "No OTP request found for this email" });
        }

        if (Date.now() >= record.expiresAt) {
            delete otpStore[email];
            return res.json({ status: 0, message: "OTP has expired" });
        }

        if (record.otp !== otp) {
            return res.json({ status: 0, message: "Invalid OTP" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 0, message: "User not found" });
        }

        delete otpStore[email];
        res.json({ status: 1, message: "OTP verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: "Error verifying OTP",
        });
    }
}

export const forgotPasswordReset = async (req, res) => {
    try {

        const { email, newPassword, confirmPassword } = req.body;

        // validation

        if (!email) {
            return res.json({
                status: 0,
                message: "Email is required"
            });
        }

        if (!newPassword) {
            return res.json({
                status: 0,
                message: "Password is required"
            });
        }

        if (!confirmPassword) {
            return res.json({
                status: 0,
                message: "Confirm password is required"
            });
        }

        if (newPassword.length < 6) {
            return res.json({
                status: 0,
                message: "Password must be at least 6 characters"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.json({
                status: 0,
                message: "Passwords do not match"
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 0,
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        await sendMail(
            email,
            "Password Successful Reset",
            "reset",
            null
        );

        return res.json({
            status: 1,
            message: "Password reset successfully"
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            status: 0,
            message: "Error resetting password",
        });

    }
};