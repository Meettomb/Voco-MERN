import dotenv from "dotenv";
import connectDB from "./db.js";
import app from "./app.js";

dotenv.config();
// connect MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} http://localhost:${PORT}`);
});
