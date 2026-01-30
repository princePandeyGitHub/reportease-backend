import User from "../../models/User.js";
import { generateHealthOverview } from "./groqAI.js"; // new AI function

export const updateUserHealthProfile = async (userId, reportSummary, reportFlags) => {
  // 1️⃣ fetch existing user
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const existingProfile = user.healthProfile || {
    overview: "",
    conditions: []
  };

  // 2️⃣ merge conditions
  const mergedConditions = Array.from(new Set([
    ...existingProfile.conditions,
    ...reportFlags // flags from report
  ]));

  // 3️⃣ generate updated overview via AI
  // assume generateHealthOverview(previousOverview, newSummary, conditions) returns string
  const newOverview = await generateHealthOverview(
    existingProfile.overview,
    reportSummary,
    mergedConditions
  );

  // 4️⃣ update user profile
  user.healthProfile = {
    overview: newOverview,
    conditions: mergedConditions,
    lastUpdated: new Date()
  };

  await user.save();

  return user.healthProfile;
};
