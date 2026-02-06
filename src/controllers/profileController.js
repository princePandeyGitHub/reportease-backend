import User from "../../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId // from middleware
        const user = await User.findById(userId)
            .select("_id name healthProfile")
        res.json({ user });
    } catch (error) {
        console.error("GET profile error", error)
        res.status(500).json({ message: error })
    }
}