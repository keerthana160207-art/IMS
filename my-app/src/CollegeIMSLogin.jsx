import { useState } from "react";

const roles = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "faculty", label: "Faculty", icon: "🏫" },
  { id: "admin", label: "Admin", icon: "⚙️" },
];

const demoCredentials = {
  student: { id: "21CSE042", pass: "student123" },
  faculty: { id: "FAC001", pass: "faculty123" },
  admin: { id: "ADMIN01", pass: "admin123" },
};

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleAutoFill = () => {
    const creds = demoCredentials[role];
    setUserId(creds.id);
    setPassword(creds.pass);
    setError("");
  };

  const handleSubmit = () => {
    const creds = demoCredentials[role];
    if (userId === creds.id && password === creds.pass) {
      onLogin(role);
    } else {
      setError("Invalid ID or password. Try using Auto-fill.");
    }
  };

  const roleLabel = roles.find((r) => r.id === role)?.label;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>
            <span style={styles.logoText}>MS</span>
          </div>
          <div>
            <div style={styles.brandName}>CollegeIMS</div>
            <div style={styles.brandSub}>Smart Campus Portal</div>
          </div>
        </div>

        <h2 style={styles.heading}>Welcome back</h2>
        <p style={styles.subheading}>Sign in to access your personalized campus portal.</p>

        <div style={styles.tabRow}>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => { setRole(r.id); setError(""); }}
              style={{ ...styles.tab, ...(role === r.id ? styles.tabActive : {}) }}
            >
              <span style={styles.tabIcon}>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        <label style={styles.label}>User / Employee ID</label>
        <input
          style={styles.input}
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setError(""); }}
          placeholder="Enter your ID"
        />

        <label style={styles.label}>Password</label>
        <div style={styles.passWrapper}>
          <input
            style={{ ...styles.input, paddingRight: 44 }}
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter your password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <button onClick={handleSubmit} style={styles.signInBtn}>
          Sign In as {roleLabel}
        </button>

        <div style={styles.demoBox}>
          <div style={styles.demoTitle}>DEMO CREDENTIALS</div>
          <div style={styles.demoRow}>
            <span style={styles.demoText}>
              ID: <strong>{demoCredentials[role].id}</strong> · Pass:{" "}
              <strong>{demoCredentials[role].pass}</strong>
            </span>
            <button onClick={handleAutoFill} style={styles.autoFillBtn}>Auto-fill</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" },
  card: { background: "#162033", borderRadius: 16, padding: "36px 40px", width: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.5)", color: "#e0e8f0" },
  logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  logoBox: { width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg, #1a9e8f, #0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 1 },
  brandName: { fontSize: 20, fontWeight: 700, color: "#e0e8f0", letterSpacing: 0.5 },
  brandSub: { fontSize: 12, color: "#7a9ab5" },
  heading: { margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: "#e8f0fe" },
  subheading: { margin: "0 0 24px", fontSize: 13, color: "#7a9ab5" },
  tabRow: { display: "flex", gap: 8, marginBottom: 20 },
  tab: { flex: 1, padding: "10px 4px", border: "1px solid #263a52", borderRadius: 10, background: "transparent", color: "#7a9ab5", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500, transition: "all 0.2s" },
  tabActive: { background: "#1e3a52", borderColor: "#1a9e8f", color: "#e0e8f0" },
  tabIcon: { fontSize: 20 },
  label: { display: "block", fontSize: 13, color: "#9ab5cc", marginBottom: 6 },
  input: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: "1px solid #263a52", background: "#1a2c42", color: "#e0e8f0", fontSize: 14, marginBottom: 14, outline: "none" },
  passWrapper: { position: "relative" },
  eyeBtn: { position: "absolute", right: 10, top: "50%", transform: "translateY(-60%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7a9ab5", padding: 0 },
  errorBox: { background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 12 },
  signInBtn: { width: "100%", padding: "14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1a9e8f, #17b897)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4, marginBottom: 16, letterSpacing: 0.3 },
  demoBox: { background: "#1a2c42", border: "1px solid #263a52", borderRadius: 10, padding: "12px 14px" },
  demoTitle: { fontSize: 11, fontWeight: 600, color: "#5a7a95", letterSpacing: 1, marginBottom: 8 },
  demoRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  demoText: { fontSize: 13, color: "#1a9e8f" },
  autoFillBtn: { padding: "5px 12px", borderRadius: 6, border: "1px solid #263a52", background: "#263a52", color: "#e0e8f0", fontSize: 12, fontWeight: 600, cursor: "pointer" },
};