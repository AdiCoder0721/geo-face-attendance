import express from "express";
import User from "../models/User.js";

const router = express.Router();

// save/update face descriptor
router.post("/save-face", async (req, res) => {
  const { userId, descriptor } = req.body;
  await User.findByIdAndUpdate(userId, { faceDescriptor: descriptor });
  res.json({ msg: "Face saved" });
});

// alias for registration use-case
router.post("/register", async (req, res) => {
  const { userId, descriptor } = req.body;
  await User.findByIdAndUpdate(userId, { faceDescriptor: descriptor });
  res.json({ msg: "Face saved" });
});

// get face
router.get("/get/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ faceDescriptor: user.faceDescriptor });
});

export default router;