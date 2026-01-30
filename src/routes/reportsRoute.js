// src/routes/reportRoutes.js
import express from "express";
import { upload } from "../config/upload.js";
import { analyzeReport } from "../controllers/reportController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  upload.single("pdf"),
  analyzeReport
);

export default router;
