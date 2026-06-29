import { useState } from "react";
import API from "../services/api";
import "./login.css";

const Login = ({ setUser, goToRegister, isAdmin, goBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.token) {
        const userRes = res.data.user;

        if (isAdmin && userRes.role !== "admin") {
          setError("Not authorized as admin");
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userRes));
        setUser(userRes);
      } else {
        setError(res.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-page">
      {/* background blur shapes */}
      <div className="bg-shape one"></div>
      <div className="bg-shape two"></div>

      <div className="login-card">
        <h1 className="logo">GeoFace</h1>
        <p className="subtitle">
          {isAdmin ? "Admin Dashboard Access" : "Smart Attendance Login"}
        </p>

        {error && <div className="error">{error}</div>}

        <div className="input-box">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          {isAdmin ? "Admin Login" : "Login"}
        </button>

        <div className="bottom-row">
          {!isAdmin && (
            <button className="link-btn" onClick={goToRegister}>
              Create account
            </button>
          )}

          {isAdmin && (
            <button className="link-btn" onClick={goBack}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;