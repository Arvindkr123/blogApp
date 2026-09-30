import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModels from "../models/users.models.js";

// ============================================
// GET ALL USERS
// GET /api/admin/users
// ============================================
export const getAllUsersAdminController = async (req, res) => {
  try {
    const users = await UserModels
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ADMIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};


// ============================================
// GET USER BY ID
// GET /api/admin/users/:id
// ============================================
export const getAdminUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await UserModels
      .findById(id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ADMIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};


// ============================================
// CREATE USER BY ADMIN
// POST /api/admin/users
// ============================================
export const createAdminUserController = async (req, res) => {
  try {
    const {
      name,
      email,
      handle,
      password,
      role,
    } = req.body;

    // Validation
    if (!name || !email || !handle || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing email
    const existingEmail = await UserModels.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check existing handle
    const existingHandle = await UserModels.findOne({
      handle: handle.toLowerCase().trim(),
    });

    if (existingHandle) {
      return res.status(409).json({
        success: false,
        message: "Handle already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModels.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      handle: handle.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    // Remove password from response
    const createdUser = await UserModels
      .findById(user._id)
      .select("-password");

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("CREATE ADMIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};


// ============================================
// UPDATE USER
// PUT /api/admin/users/:id
// ============================================
export const updateAdminUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      handle,
      password,
      role,
    } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user
    const user = await UserModels.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check email uniqueness
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      const emailExists = await UserModels.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      user.email = normalizedEmail;
    }

    // Check handle uniqueness
    if (handle !== undefined) {
      const normalizedHandle = handle.toLowerCase().trim();

      const handleExists = await UserModels.findOne({
        handle: normalizedHandle,
        _id: { $ne: id },
      });

      if (handleExists) {
        return res.status(409).json({
          success: false,
          message: "Handle already exists",
        });
      }

      user.handle = normalizedHandle;
    }

    // Update normal fields
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (role !== undefined) {
      user.role = role;
    }

    // Update password only if provided
    if (password !== undefined && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Remove password from response
    const updatedUser = await UserModels
      .findById(id)
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE ADMIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};


// ============================================
// DELETE USER
// DELETE /api/admin/users/:id
// ============================================
export const deleteAdminUserController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Prevent admin from deleting himself
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    // Find user
    const user = await UserModels.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await UserModels.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      userId: id,
    });
  } catch (error) {
    console.error("DELETE ADMIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};