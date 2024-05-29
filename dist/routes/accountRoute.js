"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const accountRoute = express_1.default.Router();
const prisma = new client_1.PrismaClient();
accountRoute.get("/get/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const numberUserId = parseInt(userId);
        const user = await prisma.account.findUnique({
            where: { userId: numberUserId },
            include: {
                Porfolio: true,
                PermanentInfo: true,
            },
        });
        if (user) {
            return res.status(200).json({
                user,
            });
        }
        else {
            throw new Error("Error getting projects");
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = accountRoute;
