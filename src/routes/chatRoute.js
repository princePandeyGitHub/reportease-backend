// src/routes/chatRoute.js
import express from "express";
import { chatWithUser } from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, chatWithUser);

export default router;
