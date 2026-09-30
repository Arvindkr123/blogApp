export const verifyAdmin = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: user not found",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        message: "Forbidden: Admin access required",
      });
    }

    next();
  } catch (err) {
    console.error("VERIFY ADMIN ERROR:", err);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};