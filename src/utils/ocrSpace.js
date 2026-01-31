// src/utils/ocrSpace.js
import fetch from "node-fetch";
import FormData from "form-data";

export const extractTextFromPDF = async (fileUrl) => {
  // 1️⃣ Download PDF from Cloudinary
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error("Failed to download PDF for OCR");
  }

  const buffer = await fileResponse.buffer();

  // 2️⃣ Send buffer to OCR.space
  const formData = new FormData();
  formData.append("apikey", process.env.OCR_SPACE_API_KEY);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("file", buffer, {
    filename: "report.pdf",
    contentType: "application/pdf",
  });

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.IsErroredOnProcessing) {
    console.error("OCR ERROR:", data.ErrorMessage);
    return "";
  }

  return data.ParsedResults?.[0]?.ParsedText || "";
};
