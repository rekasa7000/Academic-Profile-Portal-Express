"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authRoute = express_1.default.Router();
const prisma = new client_1.PrismaClient();
authRoute.post("/signup", async (req, res) => {
    try {
        const values = req.body;
        const existingUser = await prisma.account.findUnique({
            where: { email: values.email },
        });
        if (existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(values.password, 10);
        const newUser = await prisma.account.create({
            data: {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                password: hashedPassword,
            },
        });
        if (newUser) {
            return res.status(200).json({
                message: `Account Created Successfully.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
authRoute.post("/signin", async (req, res) => {
    try {
        const values = req.body;
        const existingUser = await prisma.account.findUnique({
            where: { email: values.email },
        });
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const passwordMatch = await bcryptjs_1.default.compare(values.password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.user = {
            id: existingUser.userId,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        };
        return res.status(200).json({ userId: existingUser.userId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
authRoute.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
    });
});
exports.default = authRoute;
