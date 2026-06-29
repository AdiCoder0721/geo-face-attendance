import { useEffect, useState } from "react";
import API from "../services/api";
import FaceRecognition from "../components/FaceRecognition";
import "./dashboard.css";

const Dashboard = ({ user, setUser }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("");
  const [faceVerified, setFaceVerified] = useState(false);
  const [heartbeatId, setHeartbeatId] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
    });
  }, []);

  // mark attendance whenever we have a successful blink and a location
  // also handle case where blink occurs before geolocation resolves by
  // including `location` in the dependency list.
  useEffect(() => {
    if (faceVerified && location) {
      markAttendance();
      setFaceVerified(false);
    }
  }, [faceVerified, location]);

  const markAttendance = async () => {
    try {
      const res = await API.post("/attendance/mark", {
        studentId: user._id,
        latitude: location.latitude,
        longitude: location.longitude
      });
      setStatus(res.data.msg || "");
      // on successful initial mark, start heartbeat pings every 30s
      if (res.data.msg && res.data.msg.toLowerCase().includes('marked')) {
        // avoid duplicate intervals
        if (!heartbeatId) {
          const id = setInterval(() => {
            API.post('/attendance/mark', {
              studentId: user._id,
              latitude: location.latitude,
              longitude: location.longitude,
              heartbeat: true
            }).catch(e => console.debug('heartbeat failed'));
          }, 30_000);
          setHeartbeatId(id);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error marking attendance';
      setStatus(msg);
    }
  };

  // stop heartbeat on logout/unmount
  useEffect(() => {
    return () => {
      if (heartbeatId) clearInterval(heartbeatId);
    };
  }, [heartbeatId]);

  return (
    <div className="dashboard-page">
      <div className="bg-shape one"></div>
      <div className="bg-shape two"></div>

      {/* HEADER */}
      <div className="dashboard-navbar">
        <h2>GeoFace Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">

        {/* LEFT PANEL */}
        <div className="face-panel">
          <h3>Face Verification</h3>
          <div className="face-box">
            <FaceRecognition
              userDescriptor={user?.faceDescriptor}
              blinkOnly={true}                // require only a blink for liveness
              onMatch={(match) => {
                if (match && !faceVerified) {
                  setFaceVerified(true);
                }
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="attendance-panel">
          <h3>Attendance Panel</h3>

          {status && (
            <div className="status-box">
              {status}
            </div>
          )}

          <div className="location-card">
            <p>📍 Latitude: {location?.latitude?.toFixed(4) || "Fetching..."}</p>
            <p>📍 Longitude: {location?.longitude?.toFixed(4) || "Fetching..."}</p>
          </div>

          <button className="mark-btn" onClick={markAttendance}>
            Mark Attendance Manually
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;