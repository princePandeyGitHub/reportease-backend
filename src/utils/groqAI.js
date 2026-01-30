// src/utils/groqAI.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const analyzeMedicalReport = async (rawText) => {
  if (!rawText) {
    throw new Error("No OCR text provided to AI");
  }

  const prompt = `
You are a medical analysis AI.

Return ONLY valid JSON.
No markdown. No explanations.

Format EXACTLY:

{
  "aiSummary": "string",
  "keyFindings": {},
  "flags": []
}

Medical report:
"""
${rawText}
"""
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  const content = completion.choices[0].message.content;

  return JSON.parse(content);
};
