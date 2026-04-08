import { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "./AdminDashboard";

const demoCredentials = {
  student: { id: "21CSE042", pass: "student123" },
  faculty: { id: "FAC001", pass: "faculty123" },
  admin: { id: "ADMIN01", pass: "admin123" },
};

export const themes = {
  dark: {
    bg: "#0d1b2a", card: "#162033", sidebar: "#101e2e", border: "#1e3a52",
    input: "#1a2c42", inputBorder: "#263a52", text: "#e0e8f0", subtext: "#7a9ab5",
    label: "#9ab5cc", navActive: "#1a2c42", panelBg: "#162033", rowBg: "#1a2332",
    rowActive: "#1a2c3e", demoBox: "#1a2c42", sectionLabel: "#4a6a85",
    toggleBg: "#1e3a52", toggleText: "#7a9ab5", tableHead: "#1a2c42",
    statCard: "#162033", searchBg: "#1a2c42",
  },
  light: {
    bg: "#f0f4f8", card: "#ffffff", sidebar: "#ffffff", border: "#d1dce8",
    input: "#f5f8fc", inputBorder: "#c5d3e0", text: "#1a2c42", subtext: "#5a7a95",
    label: "#4a6a85", navActive: "#e8f4f2", panelBg: "#ffffff", rowBg: "#f5f8fc",
    rowActive: "#e8f4f2", demoBox: "#f0f4f8", sectionLabel: "#8aaabb",
    toggleBg: "#e0eaf4", toggleText: "#4a6a85", tableHead: "#e8f0f8",
    statCard: "#ffffff", searchBg: "#f0f4f8",
  },
};

export function ThemeToggle({ isDark, toggleTheme, t }) {
  return (
    <button onClick={toggleTheme} style={{
      display: "flex", alignItems: "center", gap: 8,
      background: t.toggleBg, border: `1px solid ${t.border}`,
      borderRadius: 20, padding: "6px 14px",
      color: t.toggleText, fontSize: 13, fontWeight: 600,
      cursor: "pointer", transition: "all 0.3s",
    }}>
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("student");
  const [isDark, setIsDark] = useState(true);
  const t = themes[isDark ? "dark" : "light"];

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => setLoggedIn(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  if (loggedIn && role === "student")
    return <StudentDashboard onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme} t={t} />;
  if (loggedIn && role === "faculty")
    return <FacultyDashboard onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme} t={t} />;
  if (loggedIn && role === "admin")
    return <AdminDashboard onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme} t={t} />;

  return <LoginPage onLogin={handleLogin} role={role} setRole={setRole} isDark={isDark} toggleTheme={toggleTheme} t={t} />;
}

function LoginPage({ onLogin, role, setRole, isDark, toggleTheme, t }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const creds = demoCredentials[role];
  const roleIcon = (r) => r === "student" ? "🎓" : r === "faculty" ? "🏫" : "⚙️";
  const roleLabel = role === "student" ? "Student" : role === "faculty" ? "Faculty" : "Admin";

  const handleLogin = () => {
    if (userId === creds.id && password === creds.pass) {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials! Use demo auto-fill.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", transition: "all 0.3s" }}>
      <div style={{ position: "fixed", top: 20, right: 24 }}>
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} t={t} />
      </div>

      <div style={{ background: t.card, borderRadius: 16, padding: "36px 40px", width: 380, boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.12)", color: t.text, transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>MS</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>CollegeIMS</div>
            <div style={{ fontSize: 12, color: t.subtext }}>Smart Campus Portal</div>
          </div>
        </div>

        <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: t.text }}>Welcome back</h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: t.subtext }}>Sign in to access your personalized campus portal.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["student", "faculty", "admin"].map((r) => (
            <button key={r} onClick={() => { setRole(r); setError(""); setUserId(""); setPassword(""); }}
              style={{ flex: 1, padding: "10px 4px", border: `1px solid ${role === r ? "#1a9e8f" : t.inputBorder}`, borderRadius: 10, background: role === r ? (isDark ? "#1e3a52" : "#e8f4f2") : "transparent", color: role === r ? (isDark ? "#e0e8f0" : "#1a9e8f") : t.subtext, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>
              {roleIcon(r)}<br />{r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <label style={{ fontSize: 13, color: t.label, display: "block", marginBottom: 6 }}>User / Employee ID</label>
        <input value={userId} onChange={e => { setUserId(e.target.value); setError(""); }} placeholder="Enter your ID"
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14, marginBottom: 14, outline: "none", transition: "all 0.3s" }} />

        <label style={{ fontSize: 13, color: t.label, display: "block", marginBottom: 6 }}>Password</label>
        <div style={{ position: "relative" }}>
          <input type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter your password" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 44px 12px 14px", borderRadius: 8, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14, marginBottom: 14, outline: "none", transition: "all 0.3s" }} />
          <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 10, top: "40%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: t.subtext, padding: 0 }}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div style={{ background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <button onClick={handleLogin} style={{ width: "100%", padding: 14, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>
          Sign In as {roleLabel}
        </button>

        <div style={{ background: t.demoBox, border: `1px solid ${t.inputBorder}`, borderRadius: 10, padding: "12px 14px", transition: "all 0.3s" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.subtext, letterSpacing: 1, marginBottom: 8 }}>DEMO CREDENTIALS</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#1a9e8f" }}>ID: <strong>{creds.id}</strong> · Pass: <strong>{creds.pass}</strong></span>
            <button onClick={() => { setUserId(creds.id); setPassword(creds.pass); setError(""); }}
              style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${t.inputBorder}`, background: t.toggleBg, color: t.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Auto-fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}