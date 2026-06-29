import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import faceRoutes from "./routes/faceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/admin", adminRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// return JSON 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// centralized error handler — always return JSON
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

console.log(process.env.MONGO_URI);

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => console.log("Server running on port 5000"));
})
.catch(err => console.log(err));