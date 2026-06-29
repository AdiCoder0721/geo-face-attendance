import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [page, setPage] = useState(user ? "dashboard" : "choose");

  const goToLogin = () => setPage("login");
  const goToRegister = () => setPage("register");

  if (!user) {
    if (page === "register") {
      return (
        <Register
          onRegistered={goToLogin}
          goToLogin={goToLogin}
        />
      );
    }

    if (page === "choose") {
      return (
        <div className="login-page">
          <div className="bg-shape one"></div>
          <div className="bg-shape two"></div>

          <div className="login-card welcome-card">
            <h1 className="logo">Geo Face Attendance</h1>
            <p className="subtitle">Smart attendance tracking with facial recognition</p>

            <div className="welcome-buttons">
              <button className="login-btn" onClick={() => setPage("login")}>Student Login</button>
              <button className="login-btn" onClick={() => setPage("adminlogin")}>Admin Login</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Login
        setUser={setUser}
        goToRegister={goToRegister}
        isAdmin={page === "adminlogin"}
        goBack={() => setPage("choose")}
      />
    );
  }

  // user is logged in
  if (user.role === "admin") {
    return <Admin user={user} setUser={setUser} />;
  }

  return <Dashboard user={user} setUser={setUser} />;
}

export default App;