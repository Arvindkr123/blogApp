
import PostsModels from './../models/post.models.js';

// ==========================================
// CREATE POST
// ==========================================
export const addPostController = async (req, res) => {
  try {
    const { name, description, category, readTime } = req.body;

    if (!name || !description || !category || !readTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const post = await PostsModels.create({
      name,
      description,
      category,
      readTime,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("ADD POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL POSTS
// ==========================================
export const getPostsController = async (req, res) => {
  try {
    const posts = await PostsModels
      .find()
      .populate("createdBy", "name handle")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("GET POSTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE POST
// ==========================================
export const getPostByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await PostsModels
      .findById(id)
      .populate("createdBy", "name handle");

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
    console.error("GET POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE POST
// ==========================================
export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, category, readTime } = req.body;

    const post = await PostsModels.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only post owner can update
    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post",
      });
    }

    post.name = name ?? post.name;
    post.description = description ?? post.description;
    post.category = category ?? post.category;
    post.readTime = readTime ?? post.readTime;

    await post.save();

    const updatedPost = await PostsModels
      .findById(id)
      .populate("createdBy", "name handle");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("UPDATE POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE POST
// ==========================================
export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await PostsModels.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only post owner can delete
    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await PostsModels.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};