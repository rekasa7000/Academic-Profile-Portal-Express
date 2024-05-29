import express from "express";
import { PrismaClient } from "@prisma/client";
import { PortfolioType } from "../types";

const accountRoute = express.Router();
const prisma = new PrismaClient();

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
    } else {
      throw new Error("Error getting projects");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default accountRoute;
