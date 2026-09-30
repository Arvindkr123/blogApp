import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { addPostController, getPostsController, updatePostController, deletePostController, getPostByIdController} from './../controllers/add.post.controllers.js';

const router = Router();

router.post('/add', verifyToken, addPostController);
// Read
router.get("/", getPostsController);
router.get("/:id", getPostByIdController);

// Update
router.put("/:id", verifyToken, updatePostController);

// Delete
router.delete("/:id", verifyToken, deletePostController);

export default router;