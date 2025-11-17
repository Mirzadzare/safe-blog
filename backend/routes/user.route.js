import express from "express"
import { changePassword, deleteAccount, signout, updateProfile, getUsers, deleteUser } from "../controllers/user.controller.js"
import { checkAuth } from "../middleware/checkAuth.js";

const Router = express.Router();
Router.route("/")
.get(checkAuth, getUsers)

Router.route("/")
.delete(checkAuth, deleteAccount)

Router.route("/:id")
.delete(checkAuth, deleteUser)

Router.route("/password")
.put(checkAuth, changePassword)

Router.route("/profile")
.put(checkAuth, updateProfile)

Router.route("/signout")
.post(signout)

export default Router;