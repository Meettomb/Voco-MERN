import cron from "node-cron";
import UserModel from "../../model/UserModel.js";
import { sendMail } from "../../utils/mailService.js";

const startReminderScheduler = () => {

    // Runs every minute
    cron.schedule("* * * * *", async () => {

        try {

            // Get current time in HH:mm format
            const currentTime = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }).format(new Date());

            // console.log(
            //     `Checking reminders at ${currentTime}`
            // );

            // Find users who:
            // 1. Have email notifications enabled
            // 2. Have a reminder time
            // 3. Reminder time matches current time
            const users = await UserModel.find({
                emailNotifications: true,
                reminderTime: currentTime
            });

            // console.log(
            //     `Found ${users.length} reminder(s)`
            // );

            for (const user of users) {

                await sendMail(
                    user.email,
                    "LearnVoco Reminder",
                    "reminder",
                    "It's time to continue your practice!"
                );

                // console.log(
                //     `Reminder sent to ${user.email}`
                // );
            }

        } catch (error) {

            console.error(
                "Error in reminder scheduler:",
                error
            );

        }

    });

    console.log("Reminder scheduler started.");
};

export default startReminderScheduler;