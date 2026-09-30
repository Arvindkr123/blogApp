import UserModels from "../models/users.models.js"; 
import bcryptjs from "bcryptjs"; 
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration: 7 days in milliseconds
};

export const RegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        
        if (!name || !email || !password) { 
            return res.status(400).json({
                message: 'Please provide all the fields' 
            });
        }

        const existUser = await UserModels.findOne({ email }); 
        if (existUser) {
            return res.status(400).json({
                message: 'User already exists' 
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const user = new UserModels({
            name, 
            email, 
            password: hashPassword, 
            role: 'User' 
        });

        await user.save(); 

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        // Store Token in HTTP-Only Cookie
        return res
            .cookie("token", token, cookieOptions)
            .status(201)
            .json({
                message: "User created successfully", 
                user: {
                    id: user._id,
                    name: user.name, 
                    email: user.email, 
                    role: user.role 
                }
            });
    } catch (err) {
        console.error("Register Error:", err); 
        return res.status(500).json({
            message: 'Something went wrong while registering user' 
        });
    }
};

export const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body; 
        
        if (!email || !password) { 
            return res.status(400).json({
                message: 'Please provide all the fields' 
            });
        }

        const existUser = await UserModels.findOne({ email }); 
        if (!existUser) {
            return res.status(400).json({
                message: 'Invalid credentials' 
            });
        }

        const isMatch = await bcryptjs.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: existUser._id, role: existUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        // Store Token in HTTP-Only Cookie
        return res
            .cookie("token", token, cookieOptions)
            .status(200)
            .json({
                message: "Login successful",
                user: {
                    id: existUser._id,
                    name: existUser.name, 
                    email: existUser.email, 
                    role: existUser.role 
                }
            });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            message: 'Something went wrong while logging in user' 
        });
    }
};

export const LogoutController = async (req, res) => {
    try {
        return res
            .clearCookie("token", { ...cookieOptions, maxAge: 0 })
            .status(200)
            .json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout Error:", err);
        return res.status(500).json({ message: "Logout failed" });
    }
};