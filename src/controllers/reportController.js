import { extractTextFromPDF } from '../utils/ocrSpace.js';
import { analyzeMedicalReport } from '../utils/groqAI.js';
import { updateUserHealthProfile } from '../utils/updateUserHealthProfile.js';
import cloudinary from "../config/cloudinary.js";
import Report from "../../models/Report.js";

// analyze reports controller
export const analyzeReport = async (req, res) => {
  try {
    if (!req.file || !req.body.title) {
      return res.status(400).json({ message: "PDF and title required" });
    }


    // 1️⃣ OCR (FROM REMOTE URL)
    const rawText = await extractTextFromPDF(req.file.path);

    // 2️⃣ AI analysis
    const aiResult = await analyzeMedicalReport(rawText);

    // 3️⃣ File metadata (REMOTE)
    const fileData = {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: req.file.path,
      publicId: req.file.filename
    };

    // 4️⃣ Save report
    const report = await Report.create({
      userId: req.userId,
      title: req.body.title,
      rawText,
      aiSummary: aiResult.aiSummary,
      keyFindings: aiResult.keyFindings,
      flags: aiResult.flags,
      file: fileData,
    });

    // 5️⃣ Update user health profile
    await updateUserHealthProfile(
      req.userId,
      aiResult.aiSummary,
      aiResult.flags
    );

    res.status(201).json({
      message: "Report analyzed successfully",
      reportId: report._id,
      aiSummary: report.aiSummary,
      keyFindings: report.keyFindings,
      flags: report.flags,
    });

  } catch (err) {
    console.error("REPORT ANALYSIS ERROR:", err);
    res.status(500).json({ message: "Analysis failed", error: err });
  }
};

// access reports controller
export const getReports = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware
    const { period } = req.query;

    const filter = { userId };

    // Apply date filter if period is provided
    if (period) {
      const now = new Date();
      let startDate;

      switch (period.toLowerCase()) {
        case "weekly":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case "monthly":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case "yearly":
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          return res.status(400).json({ message: "Invalid period query" });
      }

      filter.createdAt = { $gte: startDate };
    }

    const reports = await Report.find(filter)
      .populate({ path: "userId", select: "name healthProfile" })
      .sort({ createdAt: -1 }) // newest first
      .select("_id userId title aiSummary keyFindings flags createdAt file"); // return only necessary fields

    res.json({ reports });
  } catch (err) {
    console.error("GET REPORTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// download report controller
export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) return res.status(404).send("Report not found");

    if (report.userId.toString() !== req.userId) return res.status(403).send("Forbidden");

    const fetch = (await import("node-fetch")).default;
    const response = await fetch(report.file.url); // raw URL from Cloudinary
    const buffer = await response.buffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${report.file.originalName}"`);
    res.send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "report download failed" })
  }

}

// deleting report controller
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 1️⃣ Delete from Cloudinary (if exists)
    if (report.file?.publicId) {
      await cloudinary.uploader.destroy(report.file.publicId, {
        resource_type: "raw" // IMPORTANT for PDFs
      });
    }

    // 2️⃣ Delete from DB
    await Report.deleteOne({ _id: report._id });

    res.status(200).json({ message: "Report deleted successfully" });

  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);
    res.status(500).json({ message: "Failed to delete report" });
  }
};



