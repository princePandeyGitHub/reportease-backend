// src/controllers/reportController.js
import Report from "../../models/Report.js";
import { extractTextFromPDF } from "../utils/ocrSpace.js";
import { analyzeMedicalReport } from "../utils/groqAI.js";

export const analyzeReport = async (req, res) => {
    try {
        if (!req.file || !req.body.title) {
            return res.status(400).json({ message: "PDF and title required" });
        }

        // 1️⃣ OCR step
        const rawText = await extractTextFromPDF(req.file.path);

        console.log("OCR TEXT LENGTH:", rawText.length);


        // 2️⃣ AI step (PASS TEXT!)
        const aiResult = await analyzeMedicalReport(rawText);

        // 3️⃣ Save to DB
        const fileData = {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/reports/${req.file.filename}`,
        };

        const report = await Report.create({
            userId: req.userId,
            title: req.body.title,
            rawText,
            aiSummary: aiResult.aiSummary,
            keyFindings: aiResult.keyFindings,
            flags: aiResult.flags,
            file: fileData,
        });

        res.status(201).json({
            message: "Report analyzed successfully",
            reportId: report._id
        });

    } catch (err) {
        console.error("REPORT ANALYSIS ERROR:", err);
        res.status(500).json({ message: "Analysis failed" });
    }
};

