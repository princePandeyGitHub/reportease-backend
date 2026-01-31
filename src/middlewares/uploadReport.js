// src/middleware/uploadReport.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "medical-reports",
    resource_type: "raw", // IMPORTANT for PDFs
    format: "pdf",
    allowed_formats: ["pdf", "png", "jpg", "jpeg"]
  },
});

export const uploadReport = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
