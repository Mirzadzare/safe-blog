import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv';
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

app.listen(3000, () => {
    console.log("Backend is running on http://127.0.0.1:3000")
    ConnectToDatabase()
});