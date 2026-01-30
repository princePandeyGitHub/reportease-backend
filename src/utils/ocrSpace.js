// src/utils/ocrSpace.js
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

export const extractTextFromPDF = async (filePath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: process.env.OCR_SPACE_API_KEY,
    },
    body: formData,
  });

  const result = await response.json();

  if (result.IsErroredOnProcessing) {
    throw new Error(result.ErrorMessage || "OCR failed");
  }

  return result.ParsedResults
    .map((r) => r.ParsedText)
    .join("\n");
};
