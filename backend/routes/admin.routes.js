import express from "express";

import {
  getAllPostsAdminController,
  getAdminPostByIdController,
  createAdminPostController,
  updateAdminPostController,
  deleteAdminPostController,
} from "../controllers/admin.controllers.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();


// GET ALL POSTS
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getAllPostsAdminController
);


// GET SINGLE POST
router.get(
  "/:id",
  verifyToken,
  verifyAdmin,
  getAdminPostByIdController
);


// CREATE POST
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createAdminPostController
);


// UPDATE POST
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  updateAdminPostController
);


// DELETE POST
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  deleteAdminPostController
);


export default router;