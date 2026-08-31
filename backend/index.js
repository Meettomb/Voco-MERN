import dotenv from "dotenv";
import connectDB from "./db.js";
import app from "./app.js";
import startReminderScheduler from "./middleware/scheduler/reminderTime.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        // Connect MongoDB
        await connectDB();

        // Start reminder scheduler
        startReminderScheduler();

        // Start Express server
        app.listen(PORT, () => {
            console.log(
                `Backend running on port ${PORT} http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();