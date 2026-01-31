// models/Chat.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default model("Chat", ChatSchema);
