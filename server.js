import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";


dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; 


if (!MONGODB_URI) {
  console.error("MongoDB connection URI not configured");
  process.exit(1);
}


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });


    server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });


