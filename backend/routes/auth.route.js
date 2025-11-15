import express from "express"
import { signin, signup } from "../controllers/auth.controller.js"
import { googleAuth } from "../controllers/oauth.controller.js"

const Router = express.Router()

Router.route("/signup").post(signup)
Router.route("/signin").post(signin)

// OAUTH
Router.route("/google").post(googleAuth)

export default Router;