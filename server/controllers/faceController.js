import User from "../models/User.js";

export const registerFace = async (req, res) => {
  try {
    const { studentId, descriptor } = req.body;
    if (!studentId || !descriptor) {
      return res.status(400).json({ msg: "Missing fields" });
    }
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.faceDescriptor = descriptor;
    await user.save();
    res.json({ msg: "Face descriptor saved", user });
  } catch (err) {
    res.status(500).json(err);
  }
};
