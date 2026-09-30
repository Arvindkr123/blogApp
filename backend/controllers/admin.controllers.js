import mongoose from "mongoose";
import PostsModels from "../models/post.models.js";

// ========================================
// GET ALL POSTS - ADMIN
// ========================================
export const getAllPostsAdminController = async (req, res) => {
  try {
    const posts = await PostsModels
      .find()
      .populate("createdBy", "name email handle role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });

  } catch (error) {
    console.error("GET ALL ADMIN POSTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};


// ========================================
// GET SINGLE POST - ADMIN
// ========================================
export const getAdminPostByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await PostsModels
      .findById(id)
      .populate("createdBy", "name email handle role");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });

  } catch (error) {
    console.error("GET ADMIN POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};


// ========================================
// CREATE POST - ADMIN
// ========================================
export const createAdminPostController = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      readTime,
    } = req.body;

    // Validation
    if (
      !name ||
      !description ||
      !category ||
      !readTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const post = await PostsModels.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      readTime: readTime.trim(),
      createdBy: req.user.id,
    });

    // Get populated post
    const createdPost = await PostsModels
      .findById(post._id)
      .populate("createdBy", "name email handle role");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: createdPost,
    });

  } catch (error) {
    console.error("CREATE ADMIN POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};


// ========================================
// UPDATE POST - ADMIN
// ========================================
export const updateAdminPostController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      category,
      readTime,
    } = req.body;

    // Check valid ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // Find post
    const post = await PostsModels.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) {
      post.name = name.trim();
    }

    if (description !== undefined) {
      post.description = description.trim();
    }

    if (category !== undefined) {
      post.category = category.trim();
    }

    if (readTime !== undefined) {
      post.readTime = readTime.trim();
    }

    await post.save();

    // Get updated post with author
    const updatedPost = await PostsModels
      .findById(id)
      .populate("createdBy", "name email handle role");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });

  } catch (error) {
    console.error("UPDATE ADMIN POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};


// ========================================
// DELETE POST - ADMIN
// ========================================
export const deleteAdminPostController = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await PostsModels.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await PostsModels.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      postId: id,
    });

  } catch (error) {
    console.error("DELETE ADMIN POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};