import Comment from "../models/comment.models.js";
import User from "../models/user.models.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;

    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required"
      });
    }

    if (content.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Comment must be 200 characters or less"
      });
    }

    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Post ID and User ID are required"
      });
    }

    // Prevent IDOR
    if (userId !== req.userData.id) {
      return res.status(403).json({
        success: false,
        message: "You can only comment as yourself"
      });
    }

    // 1. Create comment
    const newComment = await Comment.create({
      content: content.trim(),
      postId,
      userId,
    });

    // 2. Fetch user manually (no populate)
    const user = await User.findById(userId)
      .select("username profilePicture isAdmin")
      .lean();

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "You are not exist champ!"
      });
    }

    // 3. Build final combined response object
    const finalComment = {
      ...newComment.toObject(),
      user: user || null,
    };

    return res.status(201).json({
      success: true,
      comment: finalComment,
    });

  } catch (error) {
    console.error("createComment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message
    });
  }
};


export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId || !postId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    // 1. Fetch all comments (lean = faster, no ._doc needed)
    const comments = await Comment.find({ postId: postId.trim() })
      .sort({ createdAt: -1 })
      .lean();

    if (comments.length === 0) {
      return res.status(200).json({
        success: true,
        comments: [],
        total: 0,
      });
    }

    // 2. Extract all user IDs (unique)
    const userIds = [...new Set(comments.map((c) => c.userId.toString()))];

    // 3. Get all users in one query
    const users = await User.find({ _id: { $in: userIds } })
      .select("username profilePicture isAdmin")
      .lean();

    // Convert users array → object for fast lookup
    const usersById = {};
    users.forEach((u) => (usersById[u._id] = u));

    // 4. Attach user to each comment
    const finalComments = comments.map((comment) => ({
      ...comment,
      user: usersById[comment.userId] || null,
    }));

    return res.status(200).json({
      success: true,
      comments: finalComments,
      total: finalComments.length,
    });

  } catch (error) {
    console.error("getPostComments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userData.id;
    
    const user = await User.findById(userId)

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "You are not exist champ!"
    });

    }
    // Validate comment exists
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }

    // Toggle like
    const userIdStr = userId.toString();
    const likedIndex = comment.likes.findIndex(
      (id) => id.toString() === userIdStr
    );

    if (likedIndex === -1) {
      // Add like
      comment.likes.push(userId);
    } else {
      // Remove like
      comment.likes.splice(likedIndex, 1);
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      likes: comment.likes,
      numberOfLikes: comment.likes.length,
      isLiked: likedIndex === -1,
    });

  } catch (error) {
    console.error("likeComment error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to like comment",
      error: error.message 
    });
  }
};


export const editComment = async (req, res) => {
  const { commentId } = req.params;
  try {
  // Step 1: Update the comment (without populate)
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { 
      content: req.body.content.trim(),
      updatedAt: Date.now() 
    },
    { new: true }
  );

  if (!updatedComment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  // Step 2: Manually fetch the user data
  const user = await User.findById(updatedComment.userId).select("username profilePicture isAdmin");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Associated user not found"
    });
  }

  // Step 3: Attach user data to comment object (mimic populate)
  const commentWithUser = {
    ...updatedComment.toObject(),
    userId: {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin
    }
  };

  return res.status(200).json({
    success: true,
    comment: commentWithUser,
  });

} catch (error) {
  console.error("editComment error:", error);
  return res.status(500).json({ 
    success: false, 
    message: "Failed to edit comment",
    error: error.message 
  });
}
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }

    // Authorization check
    const isOwner = comment.userId.toString() === req.userData.id;
    const isAdmin = req.userData.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to delete this comment" 
      });
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentId,
    });

  } catch (error) {
    console.error("deleteComment error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete comment",
      error: error.message 
    });
  }
};