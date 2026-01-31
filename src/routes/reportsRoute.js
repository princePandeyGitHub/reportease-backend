// routes/reportsRoute.js
import express from "express";
import { analyzeReport, getReports } from "../controllers/reportController.js";
import { uploadReport } from "../middlewares/uploadReport.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { downloadReport } from "../controllers/downloadController.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  uploadReport.single("file"),
  analyzeReport
);

router.get("/download/:reportId", authMiddleware, downloadReport);

router.get('/',authMiddleware,getReports);

export default router;
