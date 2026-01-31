// src/controllers/chatController.js
import Groq from "groq-sdk";
import User from "../../models/User.js";
import Chat from "../../models/Chat.js";

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { message } = req.body;

        if (!message) return res.status(400).json({ message: "Message is required" });

        // 1️⃣ Fetch user's health profile
        const user = await User.findById(userId);
        const healthOverview = user.healthProfile?.overview || "No health overview available";

        // 2️⃣ Fetch previous chat messages (only last 10)
        const chatDoc = await Chat.findOne({ userId });
        const recentMessages = chatDoc?.messages.slice(-10) || [];

        // 3️⃣ Build AI prompt
        const aiPrompt = `
You are a medical AI assistant. Answer the user's questions based on their health profile.

User's health overview:
"""
${healthOverview}
"""

Conversation history (last 10 messages):
${recentMessages.map(m => `${m.role}: ${m.content}`).join("\n")}

User's new question:
"${message}"

Answer in simple human language. Include references to user's conditions if relevant. Keep explanations clear and concise.
`;

        // 4️⃣ Call Groq AI
        const completion = await groqClient.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 0.2
        });

        const aiResponse = completion.choices[0].message.content;

        // 5️⃣ Save message to DB
        if (chatDoc) {
            chatDoc.messages.push({ role: "user", content: message });
            chatDoc.messages.push({ role: "assistant", content: aiResponse });

            // Limit to last 10 messages
            if (chatDoc.messages.length > 10) {
                chatDoc.messages = chatDoc.messages.slice(-10);
            }

            await chatDoc.save();
        } else {
            await Chat.create({
                userId,
                messages: [
                    { role: "user", content: message },
                    { role: "assistant", content: aiResponse }
                ]
            });
        }

        res.json({ reply: aiResponse });
    } catch (err) {
        console.error("CHAT ERROR:", err);
        res.status(500).json({ message: "Chat failed", error: err });
    }
};
