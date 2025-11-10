import express from "express"
import { getUsers } from "../controllers/user.controller.js"

const Router = express.Router();

Router.route("/").get(getUsers)

export default Router;