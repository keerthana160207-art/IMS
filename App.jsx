import { useState } from "react";
import StudentDashboard from "./StudentDashboard";

const demoCredentials = {
  student: { id: "21CSE042", pass: "student123" },
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn
    ? <StudentDashboard onLogout={() => setLoggedIn(false)} />
    : <LoginPage onLogin={() => setLoggedIn(true)} />;
}

function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (
      userId === demoCredentials.student.id &&
      password === demoCredentials.student.pass
    ) {
      onLogin();
    } else {
      alert("Invalid credentials! Use demo auto-fill.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "#162033", borderRadius: 16, padding: "36px 40px", width: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.5)", color: "#e0e8f0" }}>
        
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>MS</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>CollegeIMS</div>
            <div style={{ fontSize: 12, color: "#7a9ab5" }}>Smart Campus Portal</div>
          </div>
        </div>

        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700 }}>Welcome back</h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#7a9ab5" }}>Sign in to access your personalized campus portal.</p>

        {/* Role Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["Student", "Faculty", "Admin"].map((r) => (
            <button key={r} style={{ flex: 1, padding: "10px 4px", border: `1px solid ${r === "Student" ? "#1a9e8f" : "#263a52"}`, borderRadius: 10, background: r === "Student" ? "#1e3a52" : "transparent", color: r === "Student" ? "#e0e8f0" : "#7a9ab5", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              {r === "Student" ? "🎓" : r === "Faculty" ? "🏫" : "⚙️"}<br />{r}
            </button>
          ))}
        </div>

        <label style={{ fontSize: 13, color: "#9ab5cc", display: "block", marginBottom: 6 }}>User / Employee ID</label>
        <input
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="Enter your ID"
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: "1px solid #263a52", background: "#1a2c42", color: "#e0e8f0", fontSize: 14, marginBottom: 14, outline: "none" }}
        />

        <label style={{ fontSize: 13, color: "#9ab5cc", display: "block", marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: "1px solid #263a52", background: "#1a2c42", color: "#e0e8f0", fontSize: 14, marginBottom: 14, outline: "none" }}
        />

        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: 14, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}
        >
          Sign In as Student
        </button>

        {/* Demo Credentials */}
        <div style={{ background: "#1a2c42", border: "1px solid #263a52", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#5a7a95", letterSpacing: 1, marginBottom: 8 }}>DEMO CREDENTIALS</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#1a9e8f" }}>
              ID: <strong>21CSE042</strong> · Pass: <strong>student123</strong>
            </span>
            <button
              onClick={() => { setUserId("21CSE042"); setPassword("student123"); }}
              style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #263a52", background: "#263a52", color: "#e0e8f0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Auto-fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}