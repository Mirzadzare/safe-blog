import { errorHandler } from "../utils/error.js";
import User from "../models/user.models.js";
import upload from '../utils/upload.js';
import cloudinary from '../utils/cloudinary.js';
import bcryptjs from "bcryptjs";
import Comment from "../models/comment.models.js";

export const changePassword = async (req, res) => {
    try {

        if (!req.body){
            return res.status(400).json({"message": "email, newPassword are required."});
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword || currentPassword==="" || newPassword ===""){
            return res.status(400).json({"message": "All fields are required."});
        }

        const userId = req.userData.id

        const user = await User.findById(userId)

        if (!user) {
            return res.status(403).json({"message":"Authentication Failed."})
        }

        // Check Current Password
        const validPassword = bcryptjs.compareSync(currentPassword, user.password)

        if (!validPassword){
                return res.status(403).json({"message":"The Current Password is wrong."})
        }

        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        
        const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { password: hashedPassword } },
        { new: true }
        );

        if (!updatedUser) {
        console.log("User not found");
        return null;
        }

        return res.status(200).json({"message":`Password updated successfully: ${updatedUser._id}`});

    } catch (error) {
        console.log(error)
    }
 
}

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userData.id
        const user = await User.findById(userId)

        if (!user) {
                return next(errorHandler(403, "Authentication Failed."))
            }

        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) {
            console.log("User not found!");
            return null;
            }

        return res.status(200).json({"message":`User Deleted successfully: ${deletedUser._id}`});
    } catch (error) {
        console.log(error)
    }

}

export const signout = async (req, res, next) => {

    try {
        res.clearCookie("access_token").status(200).json({"message":"User has been signed out."})
    } catch (error) {
        next(error)
    }
    
}

export const updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const userId = req.userData.id;
      const { username } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Update username
      if (username && username !== user.username) {
        user.username = username;
      }

      // Handle profile picture
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile-pictures',
              transformation: { width: 400, height: 400, crop: 'fill' },
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        // Delete old image from Cloudinary

        if (user.profilePicture) {
          const publicId = user.profilePicture.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
        }

        user.profilePicture = result.secure_url;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
};

export const getUsers = async (req, res) => {
  if (!req.userData.isAdmin) {
    return res.status(403).json({success: false, message: "Only admin is alowed to see all users"})
  }

  try {

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1

    const users = await User.find()
    .sort({createdAt: sortDirection})
    .skip(startIndex)
    .limit(limit)

    const usersWithoutPassword = users.map((user) => {
      const {password, ...rest } = user._doc;
      return rest;
    })

    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() -1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: {$gte: oneMonthAgo},
    })

    return res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });

  } catch(error){
    res.status(500).json({ success: false, message: error.message });
  }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id?.trim();
        const isAdmin = req.userData.isAdmin;

        if (!isAdmin){
          throw new Error("Only Admin Can Do this action!")
        }

        if (!userId) {
          throw new Error("UserId is required.")
        }

        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) {
            return res.status(404).json({ success:false, message:"User not found or not deleted" });
            }
        
        // Also delete User's comment
        const deleteComments = await Comment.deleteMany({ userId: userId})

        return res.status(200).json({"message":`User Deleted successfully: ${deletedUser._id}`});

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}