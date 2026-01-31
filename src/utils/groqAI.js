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
You are a medical analysis AI. provide detailed analysis of the medical report 
such that people from non medical background can also understand that.

Return ONLY valid JSON.
No markdown. No explanations.

Format EXACTLY:

{
  "aiSummary": "string",
  "keyFindings": {},
  "flags": []
}

aiSummary must be a SINGLE LINE string.
Use "\\n" explicitly for new lines.
Do NOT include raw line breaks.
All string values must be JSON-escaped.

1. Explain everything observed in the report to the user in simple human language
2. list down all the metrics seen in the report with actual and reference values
3. Suggest the next steps with diet and lifestyle changes if required

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

