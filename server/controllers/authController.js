import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, faceDescriptor, adminKey } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json({ msg: "User already exists" });

    if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length === 0) {
      return res.status(400).json({ msg: "Face descriptor required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hash,
      faceDescriptor
    };
    // promote to admin if correct key supplied
    if (adminKey && adminKey === process.env.ADMIN_KEY) {
      newUser.role = "admin";
    }

    const user = await User.create(newUser);

    const { password: pw, ...userSafe } = user._doc;
    res.json({ msg: "Registered", user: userSafe });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No user" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: "7d"
    });

    // omit password before sending
    const { password: pw, ...userSafe } = user._doc;
    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json(err);
  }
};