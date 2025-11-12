import express from "express"
import { signin, signup } from "../controllers/auth.controller.js"
import { googleAuth } from "../controllers/oauth.controller.js"

const router = express.Router()

router.route("/signup").post(signup)
router.route("/signin").post(signin)

// OAUTH
router.route("/google").post(googleAuth)

export default router;