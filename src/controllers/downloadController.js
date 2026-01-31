import Report from "../../models/Report.js";

export const downloadReport = async (req, res) => {
  const report = await Report.findById(req.params.reportId);
  if (!report) return res.status(404).send("Report not found");

  if (report.userId.toString() !== req.userId) return res.status(403).send("Forbidden");

  const fetch = (await import("node-fetch")).default;
  const response = await fetch(report.file.url); // raw URL from Cloudinary
  const buffer = await response.buffer();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${report.file.originalName}"`);
  res.send(buffer);
}