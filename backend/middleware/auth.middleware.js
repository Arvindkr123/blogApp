import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  console.log("Token exists:", !!token);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    console.log("Decoded user:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message);

    return res.status(401).json({
      message: "Unauthorized: Token expired or invalid"
    });
  }
};