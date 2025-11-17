import express from "express"
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"

const app = express();

app.use(express.json())
app.use(cookieParser());

// Small Middleware for Error handling
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

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/comment", commentRoutes)

export default app;