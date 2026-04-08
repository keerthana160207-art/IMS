import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const SESSION_DURATION = 60 * 60; // 60 minutes in seconds

const subjects    = ["Data Structures", "DS Lab", "Algorithms", "Mathematics III"];
const allSections = ["CSE-A", "CSE-B", "CSE-C"];

const rosterData = {
  "CSE-A": [
    { name: "Arjun Ravi", id: "21CSE001" },
    { name: "Kiran Raj",  id: "21CSE003" },
    { name: "Meena S.",   id: "21CSE006" },
    { name: "Rohit P.",   id: "21CSE007" },
    { name: "Sneha K.",   id: "21CSE008" },
  ],
  "CSE-B": [
    { name: "Priya Nair", id: "21CSE002" },
    { name: "Ravi Kumar", id: "21CSE005" },
    { name: "Arun M.",    id: "21CSE009" },
    { name: "Divya R.",   id: "21CSE010" },
    { name: "Suresh T.",  id: "21CSE011" },
  ],
  "CSE-C": [
    { name: "Anjali M.",  id: "21CSE004" },
    { name: "Vikram B.",  id: "21CSE012" },
    { name: "Nisha L.",   id: "21CSE013" },
    { name: "Praveen C.", id: "21CSE014" },
    { name: "Lakshmi D.", id: "21CSE015" },
  ],
};

const mockHistory = {
  "21CSE001": { "Data Structures": { present: 18, total: 21 }, "DS Lab": { present: 10, total: 11 }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 5, total: 6 } },
  "21CSE003": { "Data Structures": { present: 20, total: 21 }, "DS Lab": { present: 11, total: 11 }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 6, total: 6 } },
  "21CSE006": { "Data Structures": { present: 15, total: 21 }, "DS Lab": { present: 8,  total: 11 }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 4, total: 6 } },
  "21CSE007": { "Data Structures": { present: 19, total: 21 }, "DS Lab": { present: 9,  total: 11 }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 5, total: 6 } },
  "21CSE008": { "Data Structures": { present: 16, total: 21 }, "DS Lab": { present: 10, total: 11 }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 3, total: 6 } },
  "21CSE002": { "Data Structures": { present: 14, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE005": { "Data Structures": { present: 18, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE009": { "Data Structures": { present: 12, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE010": { "Data Structures": { present: 20, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE011": { "Data Structures": { present: 17, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE004": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 13, total: 21 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE012": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 18, total: 21 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE013": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 15, total: 21 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE014": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 20, total: 21 }, "Mathematics III": { present: 0, total: 0 } },
  "21CSE015": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 10, total: 21 }, "Mathematics III": { present: 0, total: 0 } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const sessionKey = (subject, section, date) => `${subject}|${section}|${date}`;

const thStyle = (t) => ({ padding: "11px 18px", textAlign: "left", fontSize: 11, color: t.subtext, fontWeight: 700, letterSpacing: 1 });
const tdStyle = (t) => ({ padding: "13px 18px", fontSize: 13, color: t.text });

// ── Timer Ring ────────────────────────────────────────────────────────────────
function TimerRing({ seconds, total }) {
  const r = 28, circ = 2 * Math.PI * r;
  const pct = seconds / total;
  const color = pct > 0.5 ? "#1a9e8f" : pct > 0.25 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e3a52" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={circ - pct * circ}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
      />
      <text x="36" y="32" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">
        {formatTime(seconds).split(":")[0]}
      </text>
      <text x="36" y="45" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">
        {formatTime(seconds).split(":")[1]}
      </text>
    </svg>
  );
}

// ── Attendance Toggle Button ───────────────────────────────────────────────────
function AttendanceToggle({ status, onChange, locked }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={() => !locked && onChange("present")}
        disabled={locked}
        style={{
          padding: "6px 16px", borderRadius: 7, border: "none",
          fontWeight: 700, fontSize: 12, cursor: locked ? "not-allowed" : "pointer",
          background: status === "present" ? "#22c55e22" : "transparent",
          color: status === "present" ? "#22c55e" : "#4a6a80",
          border: status === "present" ? "1.5px solid #22c55e66" : "1.5px solid #2a4a60",
          opacity: locked && status !== "present" ? 0.4 : 1,
          transition: "all 0.15s",
        }}
      >✓ Present</button>
      <button
        onClick={() => !locked && onChange("absent")}
        disabled={locked}
        style={{
          padding: "6px 16px", borderRadius: 7, border: "none",
          fontWeight: 700, fontSize: 12, cursor: locked ? "not-allowed" : "pointer",
          background: status === "absent" ? "#ef444422" : "transparent",
          color: status === "absent" ? "#ef4444" : "#4a6a80",
          border: status === "absent" ? "1.5px solid #ef444466" : "1.5px solid #2a4a60",
          opacity: locked && status !== "absent" ? 0.4 : 1,
          transition: "all 0.15s",
        }}
      >✗ Absent</button>
    </div>
  );
}

// ── Main Attendance Page ──────────────────────────────────────────────────────
export default function AttendancePage({ t, attendanceLog, setAttendanceLog }) {
  const today = new Date().toISOString().split("T")[0];

  // Setup state
  const [subject, setSubject]   = useState(subjects[0]);
  const [section, setSection]   = useState(allSections[0]);
  const [search,  setSearch]    = useState("");

  // Session state
  const [sessions, setSessions] = useState({}); // key -> { startTime, timeLeft, locked, roll }
  const timerRef = useRef(null);

  const currentKey = sessionKey(subject, section, today);
  const currentSession = sessions[currentKey];
  const isActive  = !!currentSession && !currentSession.locked;
  const isLocked  = !!currentSession?.locked;
  const roster    = rosterData[section] || [];

  // Tick the active session(s) down every second
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessions(prev => {
        const next = { ...prev };
        let changed = false;
        for (const k of Object.keys(next)) {
          const s = next[k];
          if (!s.locked && s.timeLeft > 0) {
            next[k] = { ...s, timeLeft: s.timeLeft - 1 };
            changed = true;
          } else if (!s.locked && s.timeLeft <= 0) {
            next[k] = { ...s, locked: true };
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const startSession = () => {
    const roll = {};
    roster.forEach(s => { roll[s.id] = "unmarked"; });
    setSessions(prev => ({
      ...prev,
      [currentKey]: { startTime: Date.now(), timeLeft: SESSION_DURATION, locked: false, roll },
    }));
  };

  const setStudentStatus = (studentId, status) => {
    if (isLocked || !isActive) return;
    setSessions(prev => ({
      ...prev,
      [currentKey]: {
        ...prev[currentKey],
        roll: { ...prev[currentKey].roll, [studentId]: status },
      },
    }));
  };

  const markAll = (status) => {
    if (isLocked || !isActive) return;
    const newRoll = {};
    roster.forEach(s => { newRoll[s.id] = status; });
    setSessions(prev => ({
      ...prev,
      [currentKey]: { ...prev[currentKey], roll: newRoll },
    }));
  };

  const submitSession = () => {
    if (!currentSession) return;
    const roll = currentSession.roll;
    const records = roster.map(s => ({
      studentId: s.id,
      studentName: s.name,
      subject,
      section,
      date: today,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: roll[s.id] || "absent",
    }));
    setAttendanceLog(prev => {
      // Remove any prior records for same session key
      const filtered = prev.filter(r => sessionKey(r.subject, r.section, r.date) !== currentKey);
      return [...filtered, ...records];
    });
    // Lock the session
    setSessions(prev => ({ ...prev, [currentKey]: { ...prev[currentKey], locked: true } }));
  };

  // Derived stats for current session
  const roll       = currentSession?.roll || {};
  const presentCnt = Object.values(roll).filter(v => v === "present").length;
  const absentCnt  = Object.values(roll).filter(v => v === "absent").length;
  const unmarkedCnt= Object.values(roll).filter(v => v === "unmarked").length;
  const totalCnt   = roster.length;

  const filteredRoster = roster.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  // Historical attendance for records tab
  const [viewTab, setViewTab] = useState("take"); // "take" | "history"

  // Build attendance % from mockHistory + submitted logs for given student+subject
  const getAttendancePct = (studentId, sub) => {
    const hist = mockHistory[studentId]?.[sub] || { present: 0, total: 0 };
    const logRecords = attendanceLog.filter(r => r.studentId === studentId && r.subject === sub);
    const logPresent = logRecords.filter(r => r.status === "present").length;
    const total  = hist.total + logRecords.length;
    const present= hist.present + logPresent;
    if (total === 0) return null;
    return Math.round((present / total) * 100);
  };

  const getStatusStyle = (pct) => {
    if (pct === null) return { label: "N/A",  color: "#7a9ab5", bg: "#7a9ab522", border: "#7a9ab555" };
    if (pct >= 85)   return { label: "GOOD",  color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (pct >= 75)   return { label: "OK",    color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                  { label: "RISK",  color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  // Session history (submitted sessions)
  const submittedSessions = Object.keys(sessions).filter(k => sessions[k].locked);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📋 Manual Roll Call</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Attendance Tracking</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>
          Mark attendance during the 60-minute class window. Records are locked once time expires or submitted.
        </p>
      </div>

      {/* Tab Switch */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{ id: "take", label: "📋 Take Attendance" }, { id: "history", label: "📊 Attendance Records" }].map(tab => (
          <button key={tab.id} onClick={() => setViewTab(tab.id)} style={{
            padding: "9px 22px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            background: viewTab === tab.id ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: viewTab === tab.id ? "#fff" : t.subtext,
            border: `1px solid ${viewTab === tab.id ? "transparent" : t.border}`,
          }}>{tab.label}</button>
        ))}
      </div>

      {viewTab === "take" ? (
        <>
          {/* Class + Section Selectors */}
          <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 18 }}>Select Class Session</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 12, color: t.subtext, marginBottom: 6, fontWeight: 600 }}>Subject</div>
                <select value={subject} onChange={e => { setSubject(e.target.value); setSearch(""); }}
                  disabled={isActive}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none", opacity: isActive ? 0.6 : 1 }}>
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: t.subtext, marginBottom: 6, fontWeight: 600 }}>Section</div>
                <select value={section} onChange={e => { setSection(e.target.value); setSearch(""); }}
                  disabled={isActive}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none", opacity: isActive ? 0.6 : 1 }}>
                  {allSections.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: t.subtext, marginBottom: 6, fontWeight: 600 }}>Date</div>
                <div style={{ padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14 }}>{today}</div>
              </div>
              <div>
                {!currentSession ? (
                  <button onClick={startSession} style={{
                    padding: "10px 24px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 14,
                    background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", cursor: "pointer",
                  }}>▶ Start Session</button>
                ) : isLocked ? (
                  <div style={{ padding: "10px 18px", borderRadius: 8, background: "#ef444422", border: "1px solid #ef444466", color: "#ef4444", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                    🔒 Session Locked
                  </div>
                ) : (
                  <button onClick={submitSession} style={{
                    padding: "10px 20px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 14,
                    background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", cursor: "pointer",
                  }}>✓ Submit &amp; Lock</button>
                )}
              </div>
            </div>
          </div>

          {/* Active Session Panel */}
          {currentSession && (
            <>
              {/* Session Status Bar */}
              <div style={{
                background: isLocked ? "#ef444411" : "#1a9e8f11",
                border: `1px solid ${isLocked ? "#ef444433" : "#1a9e8f33"}`,
                borderRadius: 14, padding: "18px 24px", marginBottom: 20,
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <TimerRing seconds={currentSession.timeLeft} total={SESSION_DURATION} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>
                      {isLocked ? "🔒 Session Locked" : "🟢 Session Active"}
                    </div>
                    <div style={{ fontSize: 13, color: t.subtext, marginTop: 3 }}>
                      {subject} · {section} · {today}
                    </div>
                    {isLocked ? (
                      <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>
                        Attendance is finalized and cannot be edited.
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#1a9e8f", marginTop: 4 }}>
                        {formatTime(currentSession.timeLeft)} remaining — auto-locks when time expires
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    { label: "Present", value: presentCnt,  color: "#22c55e" },
                    { label: "Absent",  value: absentCnt,   color: "#ef4444" },
                    { label: "Pending", value: unmarkedCnt, color: "#f59e0b" },
                    { label: "Total",   value: totalCnt,    color: "#3b82f6" },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", background: t.input, borderRadius: 10, padding: "12px 18px", border: `1px solid ${t.border}` }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: t.subtext, marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions + search */}
              {!isLocked && (
                <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => markAll("present")} style={{ padding: "8px 18px", borderRadius: 8, border: "1.5px solid #22c55e66", background: "#22c55e22", color: "#22c55e", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    ✓ Mark All Present
                  </button>
                  <button onClick={() => markAll("absent")} style={{ padding: "8px 18px", borderRadius: 8, border: "1.5px solid #ef444466", background: "#ef444422", color: "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    ✗ Mark All Absent
                  </button>
                  <button onClick={() => markAll("unmarked")} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.subtext, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    ↺ Reset
                  </button>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", minWidth: 220 }}>
                    <span>🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
                      style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: "100%" }} />
                  </div>
                </div>
              )}

              {/* Roll Call Table */}
              <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Roll Call — {section}</div>
                  <div style={{ fontSize: 12, color: t.subtext }}>
                    {filteredRoster.length} student{filteredRoster.length !== 1 ? "s" : ""}
                    {isLocked && <span style={{ marginLeft: 10, color: "#ef4444", fontWeight: 700 }}>🔒 Locked</span>}
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: t.tableHead }}>
                      {["#", "STUDENT", "ID", "MARK ATTENDANCE", "STATUS"].map(h => (
                        <th key={h} style={thStyle(t)}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map((stu, i) => {
                      const status = roll[stu.id] || "unmarked";
                      const rowBg = status === "present" ? "#22c55e08"
                                  : status === "absent"  ? "#ef444408"
                                  : i % 2 === 0 ? "transparent" : t.rowBg;
                      return (
                        <tr key={stu.id} style={{ borderTop: `1px solid ${t.border}`, background: rowBg, transition: "background 0.2s" }}>
                          <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12, width: 40 }}>{i + 1}</td>
                          <td style={tdStyle(t)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: "50%",
                                background: status === "present" ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                          : status === "absent"  ? "linear-gradient(135deg,#ef4444,#dc2626)"
                                          : "linear-gradient(135deg,#1a9e8f,#0e6e9e)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
                                transition: "background 0.2s",
                              }}>{stu.name[0]}</div>
                              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{stu.name}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{stu.id}</td>
                          <td style={tdStyle(t)}>
                            <AttendanceToggle
                              status={status}
                              onChange={(val) => setStudentStatus(stu.id, val)}
                              locked={isLocked}
                            />
                          </td>
                          <td style={tdStyle(t)}>
                            {status === "unmarked" ? (
                              <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>⏳ Pending</span>
                            ) : (
                              <span style={{
                                background: status === "present" ? "#22c55e22" : "#ef444422",
                                color:      status === "present" ? "#22c55e"   : "#ef4444",
                                border:     `1px solid ${status === "present" ? "#22c55e55" : "#ef444455"}`,
                                borderRadius: 6, padding: "3px 12px", fontSize: 11, fontWeight: 700,
                              }}>
                                {status === "present" ? "✓ PRESENT" : "✗ ABSENT"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Progress bar footer */}
                <div style={{ padding: "14px 24px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1, background: t.border, borderRadius: 8, height: 8, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${(presentCnt / totalCnt) * 100}%`, height: "100%", background: "#22c55e", transition: "width 0.3s" }} />
                    <div style={{ width: `${(absentCnt / totalCnt) * 100}%`,  height: "100%", background: "#ef4444", transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 12, color: t.subtext, whiteSpace: "nowrap" }}>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>{presentCnt}P</span>
                    {" / "}
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>{absentCnt}A</span>
                    {" / "}
                    <span style={{ color: "#f59e0b", fontWeight: 700 }}>{unmarkedCnt} pending</span>
                  </div>
                  {!isLocked && unmarkedCnt === 0 && (
                    <button onClick={submitSession} style={{
                      padding: "7px 18px", borderRadius: 7, border: "none", fontWeight: 700, fontSize: 13,
                      background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", cursor: "pointer",
                    }}>✓ Submit &amp; Lock</button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* No session started yet */}
          {!currentSession && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 24px", color: t.subtext, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8 }}>No Active Session</div>
              <div style={{ fontSize: 14, maxWidth: 380, lineHeight: 1.6 }}>
                Select a subject and section above, then click <strong style={{ color: "#1a9e8f" }}>Start Session</strong> to begin marking attendance.
                The session will automatically lock after 60 minutes.
              </div>
            </div>
          )}
        </>
      ) : (
        /* ── History / Records Tab ─────────────────────────────────────────── */
        <div>
          {/* Section filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {allSections.map(sec => (
              <button key={sec} onClick={() => setSection(sec)} style={{
                padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
                background: section === sec ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
                color: section === sec ? "#fff" : t.subtext,
                border: `1px solid ${section === sec ? "transparent" : t.border}`,
              }}>{sec}</button>
            ))}
          </div>

          {/* Per-subject attendance summary */}
          {subjects.map(sub => {
            const rosterForSec = rosterData[section] || [];
            // Only show subjects relevant to this section (based on mockHistory having data)
            const hasData = rosterForSec.some(s => (mockHistory[s.id]?.[sub]?.total || 0) > 0 ||
              attendanceLog.some(r => r.studentId === s.id && r.subject === sub));
            if (!hasData) return null;

            return (
              <div key={sub} style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{sub} — {section}</div>
                  <div style={{ fontSize: 12, color: t.subtext }}>{rosterForSec.length} students</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: t.tableHead }}>
                      {["STUDENT", "ID", "PRESENT", "TOTAL", "ATTEND. %", "PROGRESS", "STATUS"].map(h => (
                        <th key={h} style={thStyle(t)}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rosterForSec.map((stu, i) => {
                      const hist       = mockHistory[stu.id]?.[sub] || { present: 0, total: 0 };
                      const logRecs    = attendanceLog.filter(r => r.studentId === stu.id && r.subject === sub);
                      const logPresent = logRecs.filter(r => r.status === "present").length;
                      const present    = hist.present + logPresent;
                      const total      = hist.total + logRecs.length;
                      const pct        = total === 0 ? null : Math.round((present / total) * 100);
                      const st         = getStatusStyle(pct);

                      return (
                        <tr key={stu.id} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                          <td style={tdStyle(t)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{stu.name[0]}</div>
                              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{stu.name}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{stu.id}</td>
                          <td style={{ ...tdStyle(t), fontWeight: 700, color: "#22c55e" }}>{total === 0 ? "—" : present}</td>
                          <td style={{ ...tdStyle(t), color: t.subtext }}>{total === 0 ? "—" : total}</td>
                          <td style={{ ...tdStyle(t), fontWeight: 800, fontSize: 15, color: st.color }}>
                            {pct !== null ? `${pct}%` : "—"}
                          </td>
                          <td style={{ ...tdStyle(t), minWidth: 130 }}>
                            {total > 0 ? (
                              <div style={{ background: t.border, borderRadius: 6, height: 8, overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: st.color, borderRadius: 6, transition: "width 0.6s" }} />
                              </div>
                            ) : <span style={{ color: t.subtext, fontSize: 12 }}>No data</span>}
                          </td>
                          <td style={tdStyle(t)}>
                            <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Submitted sessions log */}
          {attendanceLog.length > 0 && (
            <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden", marginTop: 8 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>📁 Submitted Records — {section}</div>
                <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>All finalized attendance entries for this section</div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.tableHead }}>
                    {["STUDENT", "ID", "SUBJECT", "DATE", "TIME", "STATUS"].map(h => (
                      <th key={h} style={thStyle(t)}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceLog.filter(r => r.section === section).map((row, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                      <td style={tdStyle(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: row.status === "present" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#ef4444,#dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{row.studentName?.[0] || "?"}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{row.studentName}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{row.studentId}</td>
                      <td style={tdStyle(t)}>{row.subject}</td>
                      <td style={{ ...tdStyle(t), color: t.subtext }}>{row.date}</td>
                      <td style={{ ...tdStyle(t), color: t.subtext }}>{row.time}</td>
                      <td style={tdStyle(t)}>
                        <span style={{
                          background: row.status === "present" ? "#22c55e22" : "#ef444422",
                          color:      row.status === "present" ? "#22c55e"   : "#ef4444",
                          border:     `1px solid ${row.status === "present" ? "#22c55e55" : "#ef444455"}`,
                          borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700,
                        }}>
                          {row.status === "present" ? "✓ PRESENT" : "✗ ABSENT"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {attendanceLog.filter(r => r.section === section).length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: t.subtext }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🗂️</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>No submitted records yet for {section}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Take and submit an attendance session to see records here.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
