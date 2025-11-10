import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js"

dotenv.config();

export function ConnectToDatabase() {
    mongoose.connection.on('open', () => {
        console.info("Connected to Database.")
    })
    try {
        const connection = mongoose.connect(process.env.MONGO)
        return connection

    } catch (error) {
        console.log(error)
    }
}

const app = express();

app.use(express.json())
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/signup", authRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })

    next();
})

app.listen(3000, () => {
    console.log("Backend is running on http://127.0.0.1:3000")
    ConnectToDatabase()
});