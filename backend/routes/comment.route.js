import express from "express";
import { checkAuth } from "../middleware/checkAuth.js"
import { createComment, getPostComments, likeComment, editComment, deleteComment } from "../controllers/comment.controller.js";


const Router = express.Router()

Router.post('/', checkAuth, createComment);
Router.get('/:postId', getPostComments);
Router.put('/like/:commentId', checkAuth, likeComment);
Router.put('/edit/:commentId', checkAuth, editComment);
Router.delete('/delete/:commentId', checkAuth, deleteComment);

export default Router;