import app from "./app.js"
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Initialize Database Connection
await mongoose.connect(process.env.MONGO).then((con) => {
  console.log("Connected to Database.");
});

// Run the Server
app.listen(3000, () => {
    console.log("Backend is running on http://127.0.0.1:3000")
});