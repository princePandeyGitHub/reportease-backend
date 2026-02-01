// models/Report.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    /* ---------------- FILE STORAGE ---------------- */
    file: {
      originalName: {
        type: String, // "blood_report_jan.pdf"
        required: true,
      },
      mimeType: {
        type: String, // "application/pdf", "image/png"
        required: true,
      },
      size: {
        type: Number, // bytes
        required: true,
      },
      url: {
        type: String, // S3 / Cloudinary / local path
        required: true,
      },
      publicId: {
        type: String,
        required: true
      }
    },

    /* ---------------- OCR + AI ---------------- */
    rawText: {
      type: String, // OCR output
      required: true,
    },

    aiSummary: {
      type: String, // unlimited explanation
    },

    keyFindings: {
      type: Schema.Types.Mixed,
      default: {},
    },

    flags: {
      type: [String], // "urgent", "follow-up required"
      default: [],
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model('Report',ReportSchema);
