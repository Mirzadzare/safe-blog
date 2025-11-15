import Post from "../models/post-models.js";
import cloudinary from '../utils/cloudinary.js';

export const createPost = async (req, res) => {
  try {

    if (!req.userData.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create posts." });
    }

    if (req.fileError) {
      return res
        .status(400)
        .json({ success: false, message: req.fileError });
    }

    const { title, content, category } = req.body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title, content, and category are required." });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .join("-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Title must contain valid characters for a slug." });
    }

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res
        .status(400)
        .json({ success: false, message: "A post with this title (slug) already exists." });
    }

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "post-pictures",
            transformation: [
              { width: 800, height: 600, crop: "fill", gravity: "auto" },
              { quality: "auto", fetch_format: "auto" },
              { width: 400, height: 400, crop: "fill", gravity: "auto", fetch_format: "webp" },
            ],
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const newPost = new Post({
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      slug,
      image: imageUrl,
      userId: req.userData.id,
    });

    const savedPost = await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post: savedPost,
    });

  } catch (err) {
    console.error("createPost error:", err);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating post.",
      error: err.message,
    });
  }
};

export const getPosts = async (req, res) => {

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    {title: {$regex: req.query.searchTerm, $options: "i"}},
                    {content: {$regex: req.query.searchTerm, $options: "i"}},
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date
        
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
    } catch (error) {
        return res.status(401).json({"message": error.message})
    }
}


export const deletePost = async (req, res) => {

    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        // Check if user is allowed to do this (preventing Idor) 
        if (req.userData.id === post.userId){
            const deletedPost = await Post.findByIdAndDelete(postId)

            if (!deletedPost){
                throw new Error("The post has not been deleted.")
            }
            res.status(200).json({"message": "The post has been deleted."})
        } else {
            throw new Error("You are not alowed to do this mate!")
        }
    } catch(error) {
        return res.status(401).json({"message": error.message})
    }

}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    const userId = req.userData.id;
    const { title, content, category } = req.body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "title, content and category are required." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }

    if (post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "You are not allowed to edit this post." });
    }

    const updateFields = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
    };

    if (req.file) {

      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`post-pictures/${publicId}`);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "post-pictures",
            transformation: [
              { width: 800, height: 600, crop: "fill", gravity: "auto" },
              { quality: "auto", fetch_format: "auto" },
              { width: 400, height: 400, crop: "fill", gravity: "auto", fetch_format: "webp" },
            ],
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      updateFields.image = uploadResult.secure_url;
    }

    const updated = await Post.findByIdAndUpdate(
      postId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("updatePost error:", err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    }

    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};