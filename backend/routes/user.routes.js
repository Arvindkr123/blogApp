import { Router } from "express";
import { LoginController, RegisterController } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import UserModels from "../models/users.models.js";

const router = Router();

router.post("/login", LoginController)
router.post("/signup", RegisterController)
router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("USER ID:", req.user.id);

    const user = await UserModels.findOne({
      _id: req.user.id
    });

    console.log("FOUND USER:", user);



    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      message: err.message
    });
  }
});
router.get("/logout", verifyToken, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});


export default router;