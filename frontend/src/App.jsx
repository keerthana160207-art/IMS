import { useState, useEffect } from "react";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "./AdminDashboard";
import LoginPage from "./CollegeIMSLogin";

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
      position: "fixed", top: 20, right: 24, zIndex: 1000,
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
  const [role, setRole] = useState("");
  const [isDark, setIsDark] = useState(true);
  const t = themes[isDark ? "dark" : "light"];

  useEffect(() => {
    const token = localStorage.getItem("ims_token");
    const userStr = localStorage.getItem("ims_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role.toLowerCase());
        setLoggedIn(true);
      } catch (e) {
        localStorage.removeItem("ims_token");
        localStorage.removeItem("ims_user");
      }
    }
  }, []);

  const handleLogin = (userRole) => {
    setRole(userRole.toLowerCase());
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("ims_token");
    localStorage.removeItem("ims_user");
    setLoggedIn(false);
    setRole("");
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <>
      {loggedIn && <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} t={t} />}
      {!loggedIn && (
        <div style={{ position: "fixed", top: 20, right: 24, zIndex: 100 }}>
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} t={t} />
        </div>
      )}
      
      {loggedIn && role === "student" ? (
        <StudentDashboard onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme} t={t} />
      ) : loggedIn && role === "faculty" ? (
        <FacultyDashboard onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme} t={t} />
      ) : loggedIn && role === "admin" ? (
        <AdminDashboard onLogout={handleLogout} isDark={isDark} toggleTheme={toggleTheme} t={t} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}