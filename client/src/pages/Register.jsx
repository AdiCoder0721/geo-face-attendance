import { useState } from "react";
import API from "../services/api";
import FaceRecognition from "../components/FaceRecognition";
import "./registerSplit.css";

const Register = ({ onRegistered, goToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [descriptor, setDescriptor] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = name && email && password && descriptor;

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        adminKey,
        faceDescriptor: descriptor
      });

      if (res.data.msg) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          onRegistered && onRegistered();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="bg-shape one"></div>
      <div className="bg-shape two"></div>

      <div className="register-container">

        {/* LEFT SIDE - FACE SCANNER */}
        <div className="face-section">
          <h2>Face Verification</h2>
          <p>Align your face inside the camera</p>

          <div className="face-box">
            <FaceRecognition
              onCapture={(desc) => {
                setDescriptor(desc);
                setError("");
              }}
            />
          </div>

          {descriptor && (
            <p className="face-success">
              ✓ Face captured successfully
            </p>
          )}
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="form-section">
          <h1>Create Account</h1>
          <p className="subtitle">Join GeoFace Attendance</p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Admin Key (optional)"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />

          <button disabled={!canSubmit} onClick={handleSubmit}>
            Create Account
          </button>

          <div className="auth-link">
            Already have an account?{" "}
            <span onClick={goToLogin}>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;