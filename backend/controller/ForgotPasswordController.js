import UserModel from "../model/UserModel.js";
import { otpStore } from "../utils/otpStore.js";
import { sendMail } from "../utils/mailService.js";
import bcrypt from "bcrypt";


// ============================================================
// STRATEGY PATTERN
// ============================================================

// Defines the common interface for password validation strategies.
class PasswordValidationStrategy {
    validate(email, newPassword, confirmPassword) {
        throw new Error("Validation method must be implemented");
    }
}


// Concrete Strategy for validating forgot-password data.
class ForgotPasswordValidationStrategy extends PasswordValidationStrategy {

    validate(email, newPassword, confirmPassword) {

        if (!email) {
            return "Email is required";
        }

        if (!newPassword) {
            return "Password is required";
        }

        if (!confirmPassword) {
            return "Confirm password is required";
        }

        if (newPassword.length < 6) {
            return "Password must be at least 6 characters";
        }

        if (newPassword !== confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    }
}


// ============================================================
// ADAPTER PATTERN
// ============================================================

// Adapter provides a common interface for sending notifications.
// It adapts the existing sendMail() function to the application.
class EmailNotificationAdapter {

    async send(email, subject, template, data) {

        return await sendMail(
            email,
            subject,
            template,
            data
        );
    }
}


// ============================================================
// FACTORY METHOD PATTERN
// ============================================================

// Factory responsible for creating the appropriate
// notification service.
class NotificationFactory {

    static create(type) {

        if (type === "email") {
            return new EmailNotificationAdapter();
        }

        throw new Error(`Unsupported notification type: ${type}`);
    }
}


// ============================================================
// CREATE PATTERN OBJECTS
// ============================================================

// Strategy object used for password validation.
const passwordValidationStrategy =
    new ForgotPasswordValidationStrategy();

// Factory creates the email notification adapter.
const notificationService =
    NotificationFactory.create("email");


// ============================================================
// FORGOT PASSWORD - SEND OTP
// ============================================================

export const forgotPasswordOtpSending = async (req, res) => {

    const { email } = req.body;

    try {

        // Find the user associated with the email.
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Check whether an OTP already exists for this email.
        const existingOtp = otpStore[email];


        // Prevent requesting another OTP before
        // the current OTP expires.
        if (
            existingOtp &&
            Date.now() < existingOtp.expiresAt
        ) {

            return res.json({
                status: 0,
                message: "Please wait before requesting new OTP",
            });
        }


        // Remove the expired OTP from the temporary store.
        if (
            existingOtp &&
            Date.now() >= existingOtp.expiresAt
        ) {

            delete otpStore[email];
        }


        // Generate a six-digit OTP.
        const otp =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();


        // Store OTP information temporarily.
        otpStore[email] = {

            otp,

            // OTP remains valid for two minutes.
            expiresAt:
                Date.now() + 2 * 60 * 1000,

            lastSent:
                Date.now(),

            data: {
                email
            }
        };


        // Send OTP using the notification service.
        // The controller does not directly depend on sendMail().
        await notificationService.send(
            email,
            "OTP Verification",
            "otp",
            otp
        );


        return res.json({
            status: 1,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: 0,
            message: "Error sending OTP",
        });
    }
};


// ============================================================
// FORGOT PASSWORD - VERIFY OTP
// ============================================================

export const forgotPasswordOtpVerify = async (req, res) => {

    try {

        const { email, otp } = req.body;


        // Get the OTP record associated with the email.
        const record = otpStore[email];


        // No OTP was requested.
        if (!record) {

            return res.json({
                status: 0,
                message: "No OTP request found for this email"
            });
        }


        // Check whether the OTP has expired.
        if (Date.now() >= record.expiresAt) {

            delete otpStore[email];

            return res.json({
                status: 0,
                message: "OTP has expired"
            });
        }


        // Check whether the submitted OTP matches
        // the stored OTP.
        if (record.otp !== otp) {

            return res.json({
                status: 0,
                message: "Invalid OTP"
            });
        }


        // Verify that the user still exists.
        const user =
            await UserModel.findOne({ email });


        if (!user) {

            return res.status(404).json({
                status: 0,
                message: "User not found"
            });
        }


        // OTP verification completed successfully.
        delete otpStore[email];


        return res.json({
            status: 1,
            message: "OTP verified successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: 0,
            message: "Error verifying OTP",
        });
    }
};


// ============================================================
// FORGOT PASSWORD - RESET PASSWORD
// ============================================================

export const forgotPasswordReset = async (req, res) => {

    try {

        const {
            email,
            newPassword,
            confirmPassword
        } = req.body;


        // ----------------------------------------------------
        // STRATEGY PATTERN
        // ----------------------------------------------------
        // Password validation is delegated to the strategy.
        // The controller does not contain individual
        // password-validation rules.
        const validationError =
            passwordValidationStrategy.validate(
                email,
                newPassword,
                confirmPassword
            );


        // Return validation error if the strategy
        // finds invalid input.
        if (validationError) {

            return res.json({
                status: 0,
                message: validationError
            });
        }


        // Find the user associated with the email.
        const user =
            await UserModel.findOne({ email });


        if (!user) {

            return res.status(404).json({
                status: 0,
                message: "User not found"
            });
        }


        // Hash the new password before saving it.
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // Update the user's password.
        user.password = hashedPassword;


        // Save the updated user.
        await user.save();


        // ----------------------------------------------------
        // ADAPTER + FACTORY METHOD
        // ----------------------------------------------------
        // The notification service was created through
        // NotificationFactory and internally uses the
        // EmailNotificationAdapter.
        await notificationService.send(
            email,
            "Password Successful Reset",
            "reset",
            null
        );


        return res.json({
            status: 1,
            message: "Password reset successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: 0,
            message: "Error resetting password",
        });
    }
};