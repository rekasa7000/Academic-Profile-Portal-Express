// Import required modules
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PortfolioType } from "../types";

const portfolioRoute = express.Router();
const prisma = new PrismaClient();

portfolioRoute.post("/addportfolio", async (req, res) => {
  try {
    const values: PortfolioType = req.body;

    // Log request body for debugging
    console.log("Request Body:", values);

    const existingTitle = await prisma.porfolio.findFirst({
      where: { projectTitle: values.title },
    });

    if (existingTitle) {
      return res
        .status(401)
        .json({ message: "There is already a project saved." });
    }

    const newProject = await prisma.porfolio.create({
      data: {
        userId: values.userId,
        projectTitle: values.title,
        projectDesc: values.description,
        projectGit: values.gitUrl,
      },
    });

    if (newProject) {
      return res.status(200).json({
        message: `Project Created Successfully.`,
      });
    } else {
      throw new Error("Failed to create project"); // Throw error if newProject is falsy
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

portfolioRoute.get("/get/portfolio/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const numberUserId = parseInt(userId);
    const projects = await prisma.porfolio.findMany({
      where: { userId: numberUserId },
    });

    if (projects) {
      return res.status(200).json({
        projects,
      });
    } else {
      throw new Error("Error getting projects");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


portfolioRoute.put('/portfolio/:portfolioId', async (req, res) => {
  try {

    const values = req.body;

    // Log request body for debugging
    console.log("Request Body:", req.body);

    const portfolioId = req.params.portfolioId;
    const numberProjectId = parseInt(portfolioId);

    if (isNaN(numberProjectId)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }

    if (!values.title || !values.description || !values.gitUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const projects = await prisma.porfolio.update({
      where: { portfolioId: numberProjectId},
        data:{
          projectTitle: values.title,
          projectDesc: values.description,
          projectGit: values.gitUrl,
        }
    });

    if (projects) {
      return res.status(200).json({
        message: `Project Updated Successfully.`,
        data: projects
      });
    } else {
      throw new Error("Failed to update project"); // Throw error if project is false
    }

  } catch (error) {
    res.status(500).json({ message: "Internal server error"});
  }
});

portfolioRoute.delete('/portfolio/:portfolioId', async (req, res) => {
  try {
    const portfolioId = req.params.portfolioId;
    const numberProjectId = parseInt(portfolioId);

    if (isNaN(numberProjectId)) {
      return res.status(400).json({ message: 'Invalid portfolio ID' });
    }

    const deletedProject = await prisma.porfolio.delete({
      where: { portfolioId: numberProjectId },
    });

    if (deletedProject) {
      return res.status(200).json({
        message: 'Project deleted successfully.',
        data: deletedProject,
      });
    } else {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default portfolioRoute;
