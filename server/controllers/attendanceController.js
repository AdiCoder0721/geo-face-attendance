import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, latitude, longitude, heartbeat } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    // check duplicate
    const existing = await Attendance.findOne({
      studentId,
      date: today
    });

    const now = new Date();

    // Heartbeat: refresh lastSeen without changing initial mark restrictions
    if (heartbeat) {
      if (!existing) return res.status(400).json({ msg: "No existing attendance to refresh" });
      existing.latitude = latitude;
      existing.longitude = longitude;
      existing.lastSeen = now;
      existing.status = "Present";
      await existing.save();
      return res.json({ msg: "Attendance refreshed", attendance: existing });
    }

    // Non-heartbeat (initial mark attempt): enforce 1-hour rule
    const ONE_HOUR = 60 * 60 * 1000;
    if (existing) {
      const created = new Date(existing.createdAt).getTime();
      if ((now.getTime() - created) < ONE_HOUR) {
        return res.status(400).json({ msg: "Already marked within 1 hour" });
      }

      // existing is older than 1 hour: remove previous and allow new mark
      await Attendance.deleteOne({ _id: existing._id });
    }

    const attendance = await Attendance.create({
      studentId,
      date: today,
      latitude,
      longitude,
      lastSeen: now,
      status: "Present"
    });

    res.json({ msg: "Attendance marked", attendance });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADMIN HELPER - get all attendances for today (with student details)
export const todaysAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const list = await Attendance.find({ date: today }).populate(
      "studentId",
      "name email"
    );

    const FIVE_MIN = 5 * 60 * 1000;
    const now = Date.now();

    // compute derived fields and auto-update status when necessary
    const enriched = await Promise.all(list.map(async (att) => {
      const created = new Date(att.createdAt).getTime();
      const lastSeen = att.lastSeen ? new Date(att.lastSeen).getTime() : new Date(att.updatedAt).getTime();

      // determine if absent due to timeout
      const isTimedOut = (now - lastSeen) > FIVE_MIN;
      if (isTimedOut && att.status !== "Absent") {
        att.status = "Absent";
        await att.save();
      }

      const durationMs = Math.max(0, lastSeen - created);

      return {
        ...att.toObject(),
        durationSeconds: Math.round(durationMs / 1000)
      };
    }));

    res.json({ attendances: enriched });
  } catch (err) {
    res.status(500).json(err);
  }
};
