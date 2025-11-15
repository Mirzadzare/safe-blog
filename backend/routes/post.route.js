import express from "express"
import { checkAuth } from "../middleware/checkAuth.js"
import { createPost, getPosts, deletePost, updatePost } from "../controllers/post.controller.js"
import upload from "../utils/upload.js"

const Router = express.Router()

Router
.post("/create", checkAuth, upload, createPost)
.get("/", getPosts)
.delete("/:id", checkAuth, deletePost)
.put("/:id", checkAuth, upload , updatePost)

export default Router;