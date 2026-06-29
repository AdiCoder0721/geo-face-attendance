import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: String
  },
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    default: "Present"
  }
  ,
  // last time the student's client reported being in-range
  lastSeen: {
    type: Date
  },
  // cumulative duration in milliseconds (optional)
  totalDurationMs: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);