import { Router } from "express";
import { getAllUsersAdminController, getAdminUserByIdController, createAdminUserController, updateAdminUserController, deleteAdminUserController } from "../controllers/admin.user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/", verifyToken, verifyAdmin, getAllUsersAdminController);
router.get("/:id", verifyToken, verifyAdmin, getAdminUserByIdController);
router.post("/", verifyToken, verifyAdmin, createAdminUserController);
router.put("/:id", verifyToken, verifyAdmin, updateAdminUserController);
router.delete("/:id", verifyToken, verifyAdmin, deleteAdminUserController);

export default router;