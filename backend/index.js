import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/user.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminUsersRoutes from "./routes/admin.users.routes.js";
import { dbConnectionHandler } from "./utils/db.js";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Body Parsers & CORS Configuration
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Tighten for security when deploying
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/admin/posts", adminRoutes);
app.use("/api/admin/users", adminUsersRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Database Connection & Server Initialization
dbConnectionHandler()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit process with failure if DB connection fails
  });