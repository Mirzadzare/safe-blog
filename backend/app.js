import express from "express"

const app = express();

app.listen(3000, () => {
    console.log("Backend is running on http://127.0.0.1:3000")
});