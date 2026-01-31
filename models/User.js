import mongoose from "mongoose";

const HealthProfileSchema = new mongoose.Schema(
  {
    overview: {
      type: String,
      trim: true,
    },

    conditions: {
      type: [String], // structured tags like ["diabetes", "hypertension"]
      default: [],
      index: true,    // useful for queries
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // prevents separate _id for subdocument
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // IMPORTANT: hides hash from queries by default
    },

    healthProfile: {
      type: HealthProfileSchema,
      default: null, // user may not have it initially
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model('User',UserSchema);
