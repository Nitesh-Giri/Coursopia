import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const adminSchema = z.object({
        firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
        lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" })
    });

    const validateData = adminSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) });
    }

    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new admin
        const newAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Admin created successfully",
            admin: newAdmin
        });

    } catch (error) {
        console.error("Error creating Admin:", error);
        return res.status(500).json({ message: "Error creating Admin" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isCorrectPassword = await bcryptjs.compare(password, admin.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id },
            config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        );

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        };

        res.cookie("jwt", token, cookieOptions);
        return res.status(200).json({
            message: "Admin logged in successfully",
            admin,
            token
        });

    } catch (error) {
        console.error("Error logging in Admin:", error);
        return res.status(500).json({ message: "Error logging in Admin" });
    }
};

export const logout = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(400).json({ message: "Admin not logged in" });
        }

        res.clearCookie("jwt");
        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ message: "Error logging out" });
    }
};
