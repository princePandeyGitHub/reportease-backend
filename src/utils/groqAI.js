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
You are a medical analysis AI. provide detailed ai Summary explaining things with example.

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

export const generateHealthOverview = async (previousOverview, newSummary, conditions) => {
  const prompt = `
You are a medical AI assistant.

User's previous health profile summary:
"""
${previousOverview || "None"}
"""

New medical report summary:
"""
${newSummary}
"""

Current conditions (tags):
${conditions.join(", ")}

Generate a clear, human-readable health overview. Include important updates from the new report and retain relevant previous context. 

Return ONLY the summary text, do NOT include JSON.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return completion.choices[0].message.content;
};

