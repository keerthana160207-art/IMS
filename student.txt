import { useState, useRef, useEffect } from "react";

const student = {
  name: "Arjun Ravi",
  id: "21CSE042",
  dept: "CSE",
  cgpa: 8.4,
  attendance: 86,
  subjects: 5,
  assignments: 3,
};

const subjectAttendance = [
  { name: "Data Struct.", pct: 86, color: "#1a9e8f" },
  { name: "Mathematics", pct: 90, color: "#1a9e8f" },
  { name: "OS Concepts", pct: 76, color: "#f0a500" },
  { name: "Database Sys.", pct: 92, color: "#1a9e8f" },
];

const todaysClasses = [
  { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.", room: "A101", now: false },
  { time: "10:00–11:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102", now: true },
  { time: "11:15–12:15", subject: "Physics Lab", teacher: "Prof. James", room: "Lab-3", now: false },
  { time: "14:00–15:00", subject: "OS Concepts", teacher: "Dr. Kumar", room: "B201", now: false },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", section: "MAIN" },
  { id: "attendance", label: "Attendance", icon: "✅", section: "MAIN" },
  { id: "timetable", label: "Timetable", icon: "📅", section: "MAIN" },
  { id: "marks", label: "Marks & Grades", icon: "📊", section: "ACADEMICS" },
  { id: "calendar", label: "Calendar", icon: "🗓️", section: "ACADEMICS" },
  { id: "feedback", label: "Feedback", icon: "⭐", section: "ACADEMICS" },
  { id: "fees", label: "Fee Payment", icon: "💰", section: "ACADEMICS" },
  { id: "certificates", label: "Certificates", icon: "🏆", section: "TOOLS" },
  { id: "requests", label: "Leave & OD", icon: "📋", section: "TOOLS" },
  { id: "imsbot", label: "IMS Bot", icon: "🤖", section: "TOOLS" },
];

const attendanceSubjects = [
  { name: "Data Struct.", present: 33, total: 38, pct: 86 },
  { name: "Mathematics", present: 34, total: 38, pct: 90 },
  { name: "OS Concepts", present: 29, total: 38, pct: 76 },
  { name: "Database Sys.", present: 35, total: 38, pct: 92 },
  { name: "English Comm.", present: 27, total: 38, pct: 70 },
];

const timetableData = {
  Mon: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.", room: "A101" },
    { time: "10:00–11:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
    { time: "11:15–12:15", subject: "Physics Lab", teacher: "Prof. James", room: "Lab-3" },
    { time: "14:00–15:00", subject: "OS Concepts", teacher: "Dr. Kumar", room: "B201" },
  ],
  Tue: [
    { time: "09:00–10:00", subject: "English Comm.", teacher: "Prof. Rao", room: "C101" },
    { time: "11:00–12:00", subject: "Database Systems", teacher: "Prof. Ahmed", room: "A103" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
  Wed: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.", room: "A101" },
    { time: "10:00–11:00", subject: "OS Concepts", teacher: "Dr. Kumar", room: "B201" },
    { time: "13:00–14:00", subject: "Physics Lab", teacher: "Prof. James", room: "Lab-3" },
  ],
  Thu: [
    { time: "10:00–11:00", subject: "English Comm.", teacher: "Prof. Rao", room: "C101" },
    { time: "11:15–12:15", subject: "Database Systems", teacher: "Prof. Ahmed", room: "A103" },
    { time: "14:00–15:00", subject: "Data Structures", teacher: "Dr. Ravi K.", room: "A101" },
  ],
  Fri: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.", room: "A101" },
    { time: "10:00–11:00", subject: "Database Systems", teacher: "Prof. Ahmed", room: "A103" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const marksData = [
  { subject: "Data Structures", type: "Internal", score: 43, total: 50, pct: 86, grade: "A", color: "#1a9e8f" },
  { subject: "Mathematics III", type: "Assignment", score: 18, total: 20, pct: 90, grade: "A+", color: "#3b82f6" },
  { subject: "OS Concepts", type: "Internal", score: 38, total: 50, pct: 76, grade: "B+", color: "#a855f7" },
  { subject: "Database Systems", type: "Quiz", score: 9, total: 10, pct: 90, grade: "A+", color: "#1a9e8f" },
  { subject: "English Comm.", type: "Assignment", score: 14, total: 20, pct: 70, grade: "B+", color: "#f59e0b" },
];

const gradePoints = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0 };

const calendarEvents = {
  "2026-03-11": [{ title: "CAT 1 - Data Structures", type: "cat", color: "#ef4444" }],
  "2026-03-14": [{ title: "Holi", type: "festival", color: "#f59e0b" }],
  "2026-03-18": [{ title: "CAT 1 - Mathematics III", type: "cat", color: "#ef4444" }],
  "2026-03-20": [{ title: "Lab Exam - Physics Lab", type: "lab", color: "#a855f7" }],
  "2026-03-25": [{ title: "CAT 1 - OS Concepts", type: "cat", color: "#ef4444" }],
  "2026-03-29": [{ title: "Good Friday (Holiday)", type: "holiday", color: "#22c55e" }],
  "2026-04-01": [{ title: "College Annual Day", type: "event", color: "#3b82f6" }],
  "2026-04-05": [{ title: "Lab Exam - Database Lab", type: "lab", color: "#a855f7" }],
  "2026-04-10": [{ title: "CAT 2 - Data Structures", type: "cat", color: "#ef4444" }],
  "2026-04-14": [{ title: "Dr. Ambedkar Jayanti (Holiday)", type: "holiday", color: "#22c55e" }],
  "2026-04-15": [{ title: "Mid-Sem Exam Begins", type: "semester", color: "#f97316" }],
  "2026-04-18": [{ title: "Project Submission Due", type: "event", color: "#3b82f6" }],
  "2026-04-22": [{ title: "Cultural Fest", type: "event", color: "#3b82f6" }],
  "2026-04-28": [{ title: "Industry Visit", type: "event", color: "#3b82f6" }],
  "2026-05-01": [{ title: "Labour Day (Holiday)", type: "holiday", color: "#22c55e" }],
  "2026-05-05": [{ title: "CAT 2 - Mathematics III", type: "cat", color: "#ef4444" }],
  "2026-05-12": [{ title: "Lab Exam - Networks Lab", type: "lab", color: "#a855f7" }],
  "2026-05-18": [{ title: "Sem Exam - Data Structures", type: "semester", color: "#f97316" }],
  "2026-05-20": [{ title: "Sem Exam - Mathematics III", type: "semester", color: "#f97316" }],
  "2026-05-22": [{ title: "Sem Exam - OS Concepts", type: "semester", color: "#f97316" }],
  "2026-05-25": [{ title: "Sem Exam - Database Systems", type: "semester", color: "#f97316" }],
  "2026-05-27": [{ title: "Sem Exam - English Comm.", type: "semester", color: "#f97316" }],
  "2026-06-05": [{ title: "Results Announced", type: "event", color: "#3b82f6" }],
  "2026-06-15": [{ title: "New Semester Begins", type: "event", color: "#1a9e8f" }],
  "2026-06-17": [{ title: "Eid al-Adha (Holiday)", type: "holiday", color: "#22c55e" }],
};

const eventLegend = [
  { type: "cat", label: "CAT Exam", color: "#ef4444" },
  { type: "semester", label: "Semester Exam", color: "#f97316" },
  { type: "lab", label: "Lab Exam", color: "#a855f7" },
  { type: "holiday", label: "Holiday", color: "#22c55e" },
  { type: "festival", label: "Festival", color: "#f59e0b" },
  { type: "event", label: "College Event", color: "#3b82f6" },
];

const facultyList = [
  { id: 1, name: "Dr. Ravi K.", course: "Data Structures", department: "CSE" },
  { id: 2, name: "Dr. Priya S.", course: "Mathematics III", department: "Mathematics" },
  { id: 3, name: "Prof. James", course: "Physics Lab", department: "Physics" },
  { id: 4, name: "Dr. Kumar", course: "OS Concepts", department: "CSE" },
  { id: 5, name: "Prof. Rao", course: "English Comm.", department: "English" },
  { id: 6, name: "Prof. Ahmed", course: "Database Systems", department: "CSE" },
];

const feedbackQuestions = [
  "Clarity of communication and explanation of concepts",
  "Knowledge and expertise in the subject matter",
  "Pacing and effectiveness of lectures",
  "Availability for doubt clarification and guidance",
  "Fairness and transparency in evaluation",
  "Quality of assignments and learning materials",
  "Punctuality and regularity in taking classes",
  "Use of technology and teaching aids",
  "Encouragement of student participation and interaction",
  "Overall teaching effectiveness and mentorship",
];

const systemPrompt = `You are IMS Bot, a friendly AI campus assistant for CollegeIMS - Smart Campus Portal. Keep responses concise and helpful.

Student Data:
- Name: Arjun Ravi | ID: 21CSE042 | Dept: CSE | Semester: 6 | CGPA: 8.4
- Overall Attendance: 86%
- Subject Attendance: Data Structures 86%, Mathematics III 90%, OS Concepts 76%, Database Systems 92%, English Comm 70%

Today's Timetable (Monday):
- 09:00-10:00: Data Structures - Dr. Ravi K. - A101
- 10:00-11:00: Mathematics III - Dr. Priya S. - A102 (NOW)
- 11:15-12:15: Physics Lab - Prof. James - Lab-3
- 14:00-15:00: OS Concepts - Dr. Kumar - B201

Upcoming Exams:
- CAT 1 Data Structures: Mar 11 | CAT 1 Maths: Mar 18 | Lab Exam Physics: Mar 20
- CAT 1 OS Concepts: Mar 25 | Mid-Sem Begins: Apr 15
- Sem Exams: May 18-27

Upcoming Events: Good Friday Mar 29, Annual Day Apr 1, Cultural Fest Apr 22, Industry Visit Apr 28, TCS Placement Drive Apr 5

Announcements: Library books due Mar 20, Hostel fee due Mar 15, Sports Day registration open till Mar 12

Assignments: 3 due this week - DB Quiz due Friday, English Comm assignment due Thursday

Be friendly, use emojis occasionally, keep answers short and clear.`;

function getStatus(pct) {
  if (pct >= 85) return { label: "GOOD", color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
  if (pct >= 75) return { label: "OKAY", color: "#f0a500", bg: "#f0a50022", border: "#f0a50055" };
  return { label: "LOW", color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
}

function CircleProgress({ pct, color }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#1e3a52" strokeWidth="7" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 45 45)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x="45" y="49" textAnchor="middle" fill={color} fontSize="14" fontWeight="700">{pct}%</text>
    </svg>
  );
}

// FIXED: Corrected AttendancePage with proper table closing tags
function AttendancePage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📊 Attendance Tracker</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>My Attendance</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { icon: "✅", value: "86%", label: "OVERALL", sub: "↑ Above minimum 75%", color: "#22c55e", grad: "linear-gradient(135deg,#0d3d2e,#162033)" },
          { icon: "📋", value: "180", label: "TOTAL CLASSES", sub: "↑ 5 subjects", color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#162033)" },
          { icon: "❌", value: "25", label: "ABSENT", sub: "↑ Days missed", color: "#ef4444", grad: "linear-gradient(135deg,#3d0d0d,#162033)" },
          { icon: "⚠️", value: "1", label: "LOW ATTEND.", sub: "↑ Subject below 80%", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#162033)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "22px 20px", border: "1px solid #1e3a52" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{c.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 0.5 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#22c55e", marginTop: 8 }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e3a52" }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Subject Breakdown</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a2c42" }}>
              {["SUBJECT", "PRESENT/TOTAL", "PERCENTAGE", "STATUS"].map(h => (
                <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceSubjects.map((sub, i) => {
              const st = getStatus(sub.pct);
              return (
                <tr key={i} style={{ borderTop: "1px solid #1e3a52" }}>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600 }}>{sub.name}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: "#9ab5cc" }}>{sub.present} / {sub.total}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: st.color }}>{sub.pct}%</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 6, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimetablePage() {
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
  const defaultDay = days.includes(todayName) ? todayName : "Mon";
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const classes = timetableData[selectedDay] || [];
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📅 Weekly Schedule</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Timetable</h1>
      </div>
      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {days.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: selectedDay === day ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#1a2c42", color: selectedDay === day ? "#fff" : "#7a9ab5", fontWeight: selectedDay === day ? 700 : 500, fontSize: 14, cursor: "pointer" }}>
              {day}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {classes.map((cls, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 10, background: "#1a2c42", border: "1px solid #1e3a52" }}>
              <div style={{ fontSize: 13, color: "#7a9ab5", minWidth: 110 }}>{cls.time}</div>
              <div style={{ width: 3, height: 32, background: "#1a9e8f", borderRadius: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{cls.subject}</div>
                <div style={{ fontSize: 12, color: "#7a9ab5", marginTop: 2 }}>{cls.teacher}</div>
              </div>
              <div style={{ fontSize: 13, color: "#7a9ab5" }}>{cls.room}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarksPage() {
  const defaultSemesters = Array.from({ length: 8 }, (_, i) => ({
    sem: i + 1,
    subjects: [
      { name: "Subject 1", credits: 4, grade: "A" },
      { name: "Subject 2", credits: 4, grade: "A+" },
      { name: "Subject 3", credits: 3, grade: "B+" },
      { name: "Subject 4", credits: 3, grade: "A" },
      { name: "Subject 5", credits: 2, grade: "B+" },
    ],
  }));

  const [semesters, setSemesters] = useState(defaultSemesters);
  const [activeTab, setActiveTab] = useState("scores");
  const [activeSem, setActiveSem] = useState(1);

  const calcGPA = (subjects) => {
    const totalCredits = subjects.reduce((a, s) => a + s.credits, 0);
    const totalPoints = subjects.reduce((a, s) => a + s.credits * (gradePoints[s.grade] || 0), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const overallCGPA = () => calcGPA(semesters.flatMap(s => s.subjects));

  const updateSubject = (si, subi, field, value) => {
    setSemesters(semesters.map((sem, i) => i === si ? {
      ...sem, subjects: sem.subjects.map((sub, j) => j === subi ? { ...sub, [field]: field === "credits" ? Number(value) : value } : sub)
    } : sem));
  };

  const addSubject = (si) => setSemesters(semesters.map((sem, i) => i === si ? { ...sem, subjects: [...sem.subjects, { name: "New Subject", credits: 3, grade: "A" }] } : sem));
  const removeSubject = (si, subi) => setSemesters(semesters.map((sem, i) => i === si ? { ...sem, subjects: sem.subjects.filter((_, j) => j !== subi) } : sem));

  const gradeColor = (g) => {
    if (g === "O" || g === "A+") return "#22c55e";
    if (g === "A") return "#1a9e8f";
    if (g === "B+") return "#3b82f6";
    if (g === "B") return "#f59e0b";
    if (g === "C") return "#f0a500";
    return "#ef4444";
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🎓 Academic Performance</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Marks & Grades</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { icon: "🏆", value: student.cgpa, label: "CURRENT CGPA", sub: "↑ Semester 6", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#162033)" },
          { icon: "📚", value: student.subjects, label: "SUBJECTS", sub: "↑ This semester", color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#162033)" },
          { icon: "🎯", value: "92%", label: "BEST SCORE", sub: "↑ Database Systems", color: "#1a9e8f", grad: "linear-gradient(135deg,#0d3d2e,#162033)" },
          { icon: "🚀", value: "0", label: "ARREARS", sub: "↑ Clean record", color: "#22c55e", grad: "linear-gradient(135deg,#0d3d1e,#162033)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "22px 20px", border: "1px solid #1e3a52" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{c.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 0.5 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#22c55e", marginTop: 8 }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "scores", label: "📋 Assessment Scores" }, { id: "cgpa", label: "🧮 CGPA Calculator" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: activeTab === t.id ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#1a2c42", color: activeTab === t.id ? "#fff" : "#7a9ab5", fontWeight: activeTab === t.id ? 700 : 500, fontSize: 14, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>
      {activeTab === "scores" && (
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e3a52", fontSize: 16, fontWeight: 700 }}>Assessment Scores</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1a2c42" }}>
                {["SUBJECT", "TYPE", "SCORE", "PROGRESS", "PERCENT", "GRADE"].map(h => (
                  <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marksData.map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid #1e3a52" }}>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600 }}>{row.subject}</td>
                  <td style={{ padding: "16px 24px", fontSize: 13, color: "#9ab5cc" }}>{row.type}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600 }}>{row.score}/{row.total}</td>
                  <td style={{ padding: "16px 24px", minWidth: 160 }}>
                    <div style={{ background: "#1e3a52", borderRadius: 6, height: 8, overflow: "hidden" }}>
                      <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: 6 }} />
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: row.color }}>{row.pct}%</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ background: row.color + "22", color: row.color, border: `1px solid ${row.color}55`, borderRadius: 6, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{row.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "cgpa" && (
        <div>
          <div style={{ background: "linear-gradient(135deg,#0d3d2e,#162033)", borderRadius: 14, border: "1px solid #1a9e8f44", padding: "20px 28px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 4 }}>Overall CGPA (All 8 Semesters)</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#1a9e8f" }}>{overallCGPA()}</div>
            </div>
            <div style={{ fontSize: 48 }}>🎓</div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {semesters.map((sem, i) => (
              <button key={i} onClick={() => setActiveSem(i + 1)} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: activeSem === i + 1 ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#1a2c42", color: activeSem === i + 1 ? "#fff" : "#7a9ab5", fontWeight: activeSem === i + 1 ? 700 : 500, fontSize: 13, cursor: "pointer" }}>
                Sem {i + 1} <span style={{ fontSize: 11, opacity: 0.8 }}>({calcGPA(sem.subjects)})</span>
              </button>
            ))}
          </div>
          {semesters.map((sem, si) => activeSem === si + 1 && (
            <div key={si} style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e3a52", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Semester {si + 1}</div>
                  <div style={{ fontSize: 12, color: "#7a9ab5" }}>GPA: <span style={{ color: "#1a9e8f", fontWeight: 700 }}>{calcGPA(sem.subjects)}</span></div>
                </div>
                <button onClick={() => addSubject(si)} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#1a9e8f", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Subject</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1a2c42" }}>
                    {["SUBJECT NAME", "CREDITS", "GRADE", "GRADE POINTS", ""].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((sub, subi) => (
                    <tr key={subi} style={{ borderTop: "1px solid #1e3a52" }}>
                      <td style={{ padding: "12px 20px" }}>
                        <input value={sub.name} onChange={e => updateSubject(si, subi, "name", e.target.value)} style={{ background: "#1a2c42", border: "1px solid #263a52", borderRadius: 6, padding: "6px 10px", color: "#e0e8f0", fontSize: 13, width: "100%" }} />
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <input type="number" min="1" max="6" value={sub.credits} onChange={e => updateSubject(si, subi, "credits", e.target.value)} style={{ background: "#1a2c42", border: "1px solid #263a52", borderRadius: 6, padding: "6px 10px", color: "#e0e8f0", fontSize: 13, width: 70 }} />
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <select value={sub.grade} onChange={e => updateSubject(si, subi, "grade", e.target.value)} style={{ background: "#1a2c42", border: "1px solid #263a52", borderRadius: 6, padding: "6px 10px", color: gradeColor(sub.grade), fontSize: 13, fontWeight: 700 }}>
                          {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 700, color: gradeColor(sub.grade) }}>{gradePoints[sub.grade] || 0}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <button onClick={() => removeSubject(si, subi)} style={{ background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e3a52", fontSize: 16, fontWeight: 700 }}>All Semesters Summary</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1a2c42" }}>
                  {["SEMESTER", "SUBJECTS", "TOTAL CREDITS", "GPA"].map(h => (
                    <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semesters.map((sem, i) => {
                  const gpa = parseFloat(calcGPA(sem.subjects));
                  const gpaColor = gpa >= 8.5 ? "#22c55e" : gpa >= 7 ? "#1a9e8f" : gpa >= 6 ? "#f59e0b" : "#ef4444";
                  return (
                    <tr key={i} style={{ borderTop: "1px solid #1e3a52", cursor: "pointer", background: activeSem === i + 1 ? "#1a2c42" : "transparent" }} onClick={() => setActiveSem(i + 1)}>
                      <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 600 }}>Semester {i + 1}</td>
                      <td style={{ padding: "14px 24px", fontSize: 14, color: "#9ab5cc" }}>{sem.subjects.length}</td>
                      <td style={{ padding: "14px 24px", fontSize: 14, color: "#9ab5cc" }}>{sem.subjects.reduce((a, s) => a + s.credits, 0)}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ background: gpaColor + "22", color: gpaColor, border: `1px solid ${gpaColor}55`, borderRadius: 6, padding: "3px 12px", fontSize: 13, fontWeight: 700 }}>{gpa.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const getDateKey = (day) => `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const upcomingEvents = Object.entries(calendarEvents).filter(([d]) => d >= todayKey).sort(([a], [b]) => a.localeCompare(b)).slice(0, 6).map(([date, evs]) => ({ date, ...evs[0] }));
  const monthEvents = Object.entries(calendarEvents).filter(([d]) => d.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`)).sort(([a], [b]) => a.localeCompare(b)).map(([date, evs]) => ({ date, ...evs[0] }));
  const formatDate = (ds) => new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatShort = (ds) => { const d = new Date(ds + "T00:00:00"); return { month: d.toLocaleDateString("en-US", { month: "short" }), day: d.getDate() }; };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🗓️ Academic Calendar</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Calendar</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <div>
          <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{monthNames[currentMonth]} {currentYear}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#1a2c42", color: "#e0e8f0", cursor: "pointer", fontSize: 16 }}>‹</button>
                <button onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }} style={{ padding: "0 12px", height: 32, borderRadius: 8, border: "none", background: "#1a9e8f22", color: "#1a9e8f", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Today</button>
                <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#1a2c42", color: "#e0e8f0", cursor: "pointer", fontSize: 16 }}>›</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 8 }}>
              {dayNames.map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 12, color: "#7a9ab5", fontWeight: 700, padding: "6px 0" }}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = getDateKey(day);
                const events = calendarEvents[dateKey] || [];
                const isToday = dateKey === todayKey;
                return (
                  <div key={day} style={{ minHeight: 52, borderRadius: 8, padding: "4px 6px", background: isToday ? "linear-gradient(135deg,#1a9e8f,#17b897)" : events.length > 0 ? "#1a2c42" : "transparent", border: isToday ? "none" : events.length > 0 ? "1px solid #1e3a52" : "1px solid transparent" }}>
                    <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : "#e0e8f0", marginBottom: 2 }}>{day}</div>
                    {events.slice(0, 2).map((ev, ei) => <div key={ei} style={{ width: 6, height: 6, borderRadius: "50%", background: ev.color, display: "inline-block", marginRight: 2 }} />)}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#9ab5cc" }}>LEGEND</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {eventLegend.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ab5cc" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />{l.label}
                </div>
              ))}
            </div>
          </div>
          {monthEvents.length > 0 && (
            <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a52", fontSize: 15, fontWeight: 700 }}>{monthNames[currentMonth]} Events</div>
              {monthEvents.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: i > 0 ? "1px solid #1e3a52" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 14 }}>{ev.title}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#7a9ab5" }}>{formatDate(ev.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a52", fontSize: 15, fontWeight: 700 }}>Upcoming Events</div>
            {upcomingEvents.map((ev, i) => {
              const { month, day } = formatShort(ev.date);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderTop: i > 0 ? "1px solid #1e3a52" : "none" }}>
                  <div style={{ background: ev.color + "22", border: `1px solid ${ev.color}44`, borderRadius: 10, padding: "6px 10px", minWidth: 52, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: ev.color, fontWeight: 700 }}>{month}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: ev.color, lineHeight: 1.2 }}>{day}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 2 }}>{eventLegend.find(l => l.type === ev.type)?.label}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.color }} />
                </div>
              );
            })}
          </div>
          <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>This Month Summary</div>
            {eventLegend.map((l, i) => {
              const count = monthEvents.filter(e => e.type === l.type).length;
              return count > 0 ? (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9ab5cc" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />{l.label}
                  </div>
                  <span style={{ background: l.color + "22", color: l.color, border: `1px solid ${l.color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{count}</span>
                </div>
              ) : null;
            })}
            {monthEvents.length === 0 && <div style={{ fontSize: 13, color: "#7a9ab5", textAlign: "center" }}>No events this month</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackPage() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [additionalComment, setAdditionalComment] = useState("");

  const ratingOptions = [
    { value: 1, label: "Poor", color: "#ef4444" },
    { value: 2, label: "Fair", color: "#f59e0b" },
    { value: 3, label: "Good", color: "#3b82f6" },
    { value: 4, label: "Very Good", color: "#1a9e8f" },
    { value: 5, label: "Excellent", color: "#22c55e" },
  ];

  const handleRating = (questionIndex, value) => {
    setRatings({ ...ratings, [questionIndex]: value });
  };

  const handleSubmit = () => {
    if (!selectedFaculty) {
      alert("Please select a faculty member");
      return;
    }
    if (Object.keys(ratings).length !== feedbackQuestions.length) {
      alert("Please answer all questions");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedFaculty(null);
      setRatings({});
      setAdditionalComment("");
    }, 3000);
  };

  const calculateAverage = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>⭐ Faculty Feedback</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Course & Faculty Evaluation</h1>
      </div>

      {!selectedFaculty ? (
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select Faculty to Evaluate</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {facultyList.map((faculty) => (
              <button
                key={faculty.id}
                onClick={() => setSelectedFaculty(faculty)}
                style={{ background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 10, padding: "16px", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a9e8f" }}>{faculty.name}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{faculty.course}</div>
                <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 2 }}>{faculty.department} Department</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", background: "#1a2c42", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedFaculty.name}</div>
              <div style={{ fontSize: 13, color: "#7a9ab5" }}>{selectedFaculty.course} • {selectedFaculty.department}</div>
            </div>
            <button onClick={() => setSelectedFaculty(null)} style={{ background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Change Faculty</button>
          </div>

          <div style={{ padding: 24 }}>
            {feedbackQuestions.map((question, idx) => (
              <div key={idx} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: idx < feedbackQuestions.length - 1 ? "1px solid #1e3a52" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{idx + 1}. {question}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {ratingOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleRating(idx, opt.value)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: ratings[idx] === opt.value ? `2px solid ${opt.color}` : "1px solid #1e3a52",
                        background: ratings[idx] === opt.value ? opt.color + "22" : "transparent",
                        color: ratings[idx] === opt.value ? opt.color : "#9ab5cc",
                        fontWeight: ratings[idx] === opt.value ? 700 : 400,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Additional Comments (Optional)</div>
              <textarea
                value={additionalComment}
                onChange={(e) => setAdditionalComment(e.target.value)}
                placeholder="Share your feedback about the course, teaching methods, or any suggestions..."
                rows={4}
                style={{ width: "100%", background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 10, padding: "12px", color: "#e0e8f0", fontSize: 13, resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <div style={{ background: "#1a9e8f22", padding: "8px 16px", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#7a9ab5" }}>Average Rating: </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#1a9e8f" }}>{calculateAverage()}</span>
                <span style={{ fontSize: 12, color: "#7a9ab5" }}> / 5</span>
              </div>
              <button
                onClick={handleSubmit}
                style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
              >
                Submit Feedback
              </button>
            </div>

            {submitted && (
              <div style={{ marginTop: 20, background: "#22c55e22", border: "1px solid #22c55e55", borderRadius: 10, padding: "12px", textAlign: "center", color: "#22c55e" }}>
                ✅ Thank you! Your feedback for {selectedFaculty.name} has been submitted successfully.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeePaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  const feeDetails = {
    tuitionFee: 85000,
    hostelFee: 45000,
    libraryFee: 5000,
    sportsFee: 2000,
    totalFee: 137000,
    paidAmount: 89000,
    pendingAmount: 48000,
    lastPaymentDate: "2026-02-15",
    dueDate: "2026-03-25",
  };

  const handlePayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (parseFloat(paymentAmount) > feeDetails.pendingAmount) {
      alert(`Amount cannot exceed pending fee: ₹${feeDetails.pendingAmount.toLocaleString()}`);
      return;
    }
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => setPaymentStatus(null), 3000);
    }, 2000);
  };

  const paymentInputStyle = {
    width: "100%",
    background: "#1a2c42",
    border: "1px solid #1e3a52",
    borderRadius: 8,
    padding: "12px",
    color: "#e0e8f0",
    fontSize: 13,
    marginTop: 8,
    outline: "none",
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>💰 Fee Management</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Fee Payment</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Fee Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #1e3a52" }}>
              <span>Tuition Fee</span>
              <span style={{ fontWeight: 600 }}>₹{feeDetails.tuitionFee.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #1e3a52" }}>
              <span>Hostel Fee</span>
              <span style={{ fontWeight: 600 }}>₹{feeDetails.hostelFee.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #1e3a52" }}>
              <span>Library Fee</span>
              <span>₹{feeDetails.libraryFee.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #1e3a52" }}>
              <span>Sports Fee</span>
              <span>₹{feeDetails.sportsFee.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "2px solid #1a9e8f", fontSize: 16, fontWeight: 700 }}>
              <span>Total Fee</span>
              <span style={{ color: "#1a9e8f" }}>₹{feeDetails.totalFee.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span>Amount Paid</span>
              <span style={{ color: "#22c55e", fontWeight: 600 }}>₹{feeDetails.paidAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Pending Amount</span>
              <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 18 }}>₹{feeDetails.pendingAmount.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: 12, padding: "10px", background: "#ef444422", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#ef4444" }}>⚠️ Due Date: {new Date(feeDetails.dueDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Make Payment</div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 8 }}>Select Payment Method</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { id: "card", label: "💳 Card Payment" },
                { id: "netbanking", label: "🏦 Net Banking" },
                { id: "neft", label: "🏧 NEFT Transfer" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 8,
                    border: paymentMethod === method.id ? "2px solid #1a9e8f" : "1px solid #1e3a52",
                    background: paymentMethod === method.id ? "#1a9e8f22" : "#1a2c42",
                    color: "#e0e8f0",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === "card" && (
            <div style={{ marginBottom: 20 }}>
              <input type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" style={paymentInputStyle} />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <input type="text" placeholder="MM/YY" style={{ ...paymentInputStyle, flex: 1 }} />
                <input type="text" placeholder="CVV" style={{ ...paymentInputStyle, flex: 1 }} />
              </div>
              <input type="text" placeholder="Cardholder Name" style={paymentInputStyle} />
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <div style={{ marginBottom: 20 }}>
              <select style={paymentInputStyle}>
                <option>Select Bank</option>
                <option>SBI - State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Canara Bank</option>
              </select>
            </div>
          )}

          {paymentMethod === "neft" && (
            <div style={{ marginBottom: 20, padding: "12px", background: "#1a2c42", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "#7a9ab5", marginBottom: 8 }}>Bank Details for NEFT Transfer</div>
              <div style={{ fontSize: 13 }}>
                <div>Bank: ICICI Bank</div>
                <div>Account Name: CollegeIMS - Student Fee</div>
                <div>Account No: 123456789012</div>
                <div>IFSC Code: ICIC0001234</div>
                <div>UPI ID: collegeims@icici</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <input type="text" placeholder="Transaction Reference ID / UTR No." style={paymentInputStyle} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <input
              type="number"
              placeholder="Enter Amount (₹)"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              style={paymentInputStyle}
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentStatus === "processing"}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "none",
              background: paymentStatus === "processing" ? "#7a9ab5" : "linear-gradient(135deg,#1a9e8f,#17b897)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: paymentStatus === "processing" ? "not-allowed" : "pointer",
            }}
          >
            {paymentStatus === "processing" ? "Processing..." : `Pay ₹${paymentAmount || "0"}`}
          </button>

          {paymentStatus === "success" && (
            <div style={{ marginTop: 16, background: "#22c55e22", border: "1px solid #22c55e55", borderRadius: 8, padding: "12px", textAlign: "center", color: "#22c55e" }}>
              ✅ Payment successful! Receipt has been sent to your email.
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20, background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Transactions</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e3a52" }}>
              <th style={{ textAlign: "left", padding: "10px", color: "#7a9ab5" }}>Date</th>
              <th style={{ textAlign: "left", padding: "10px", color: "#7a9ab5" }}>Description</th>
              <th style={{ textAlign: "right", padding: "10px", color: "#7a9ab5" }}>Amount</th>
              <th style={{ textAlign: "center", padding: "10px", color: "#7a9ab5" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #1e3a52" }}>
              <td style={{ padding: "10px" }}>2026-02-15</td>
              <td style={{ padding: "10px" }}>Tuition Fee (Sem 6) - Partial</td>
              <td style={{ textAlign: "right", padding: "10px" }}>₹45,000</td>
              <td style={{ textAlign: "center", padding: "10px", color: "#22c55e" }}>Success</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1e3a52" }}>
              <td style={{ padding: "10px" }}>2026-01-10</td>
              <td style={{ padding: "10px" }}>Hostel Fee (Sem 6)</td>
              <td style={{ textAlign: "right", padding: "10px" }}>₹25,000</td>
              <td style={{ textAlign: "center", padding: "10px", color: "#22c55e" }}>Success</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #1e3a52" }}>
              <td style={{ padding: "10px" }}>2025-12-05</td>
              <td style={{ padding: "10px" }}>Library Fee + Sports Fee</td>
              <td style={{ textAlign: "right", padding: "10px" }}>₹7,000</td>
              <td style={{ textAlign: "center", padding: "10px", color: "#22c55e" }}>Success</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CertificatesPage() {
  const [certificates, setCertificates] = useState([
    { id: 1, name: "Hackathon 2025 - Winner.pdf", date: "2025-11-20", type: "Achievement", size: "1.2 MB" },
    { id: 2, name: "Python Programming Certificate.pdf", date: "2025-09-15", type: "Course", size: "0.8 MB" },
    { id: 3, name: "Internship Completion - ABC Corp.pdf", date: "2025-07-30", type: "Internship", size: "2.1 MB" },
  ]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      const newCertificates = files.map((file, idx) => ({
        id: certificates.length + idx + 1,
        name: file.name,
        date: new Date().toISOString().split("T")[0],
        type: "Uploaded",
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      }));
      setCertificates([...newCertificates, ...certificates]);
      setUploading(false);
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🏆 Certificates & Achievements</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>My Certificates</h1>
      </div>

      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Upload New Certificate</div>
          <label style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            📤 Upload File
            <input type="file" multiple accept=".pdf,.jpg,.png,.jpeg" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        </div>
        {uploading && <div style={{ textAlign: "center", color: "#1a9e8f" }}>Uploading certificate(s)...</div>}
      </div>

      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a2c42" }}>
              <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Certificate Name</th>
              <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Type</th>
              <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Date</th>
              <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Size</th>
              <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 12, color: "#7a9ab5" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} style={{ borderTop: "1px solid #1e3a52" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 500 }}>📄 {cert.name}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{cert.type}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{new Date(cert.date).toLocaleDateString()}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{cert.size}</td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  <button style={{ background: "#1a9e8f22", border: "1px solid #1a9e8f55", color: "#1a9e8f", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaveAndODPage() {
  const [requestType, setRequestType] = useState("leave");
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [existingRequests, setExistingRequests] = useState([
    { id: 1, type: "Leave", dates: "Mar 10 - Mar 12, 2026", status: "Approved", reason: "Medical emergency" },
    { id: 2, type: "OD", dates: "Mar 5, 2026", status: "Pending", reason: "Placement drive" },
  ]);

  const paymentInputStyle = {
    width: "100%",
    background: "#1a2c42",
    border: "1px solid #1e3a52",
    borderRadius: 8,
    padding: "12px",
    color: "#e0e8f0",
    fontSize: 13,
    marginTop: 8,
    outline: "none",
  };

  const handleSubmit = () => {
    if (!formData.startDate || !formData.reason) {
      alert("Please fill all required fields");
      return;
    }
    setSubmitted(true);
    const newRequest = {
      id: existingRequests.length + 1,
      type: requestType === "leave" ? "Leave" : "OD",
      dates: formData.endDate ? `${formData.startDate} - ${formData.endDate}` : formData.startDate,
      status: "Pending",
      reason: formData.reason,
    };
    setExistingRequests([newRequest, ...existingRequests]);
    setFormData({ startDate: "", endDate: "", reason: "", document: null });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const generateNoDueForm = () => {
    const noDueData = {
      studentName: student.name,
      studentId: student.id,
      department: student.dept,
      semester: "6",
      date: new Date().toLocaleDateString(),
      clearances: {
        library: "Cleared",
        hostel: "Pending",
        accounts: "Cleared",
        department: "Cleared",
      },
    };
    alert(`📄 No Due Certificate Generated!\n\nStudent: ${noDueData.studentName}\nID: ${noDueData.studentId}\nDept: ${noDueData.department}\n\nLibrary: ${noDueData.clearances.library}\nHostel: ${noDueData.clearances.hostel}\nAccounts: ${noDueData.clearances.accounts}\nDepartment: ${noDueData.clearances.department}\n\n(Would be downloaded as PDF in production)`);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📋 Leave & On-Duty Requests</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Leave & OD Management</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => setRequestType("leave")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: requestType === "leave" ? "2px solid #1a9e8f" : "1px solid #1e3a52",
                background: requestType === "leave" ? "#1a9e8f22" : "#1a2c42",
                color: "#e0e8f0",
                cursor: "pointer",
                fontWeight: requestType === "leave" ? 700 : 400,
              }}
            >
              📝 Leave Application
            </button>
            <button
              onClick={() => setRequestType("od")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: requestType === "od" ? "2px solid #1a9e8f" : "1px solid #1e3a52",
                background: requestType === "od" ? "#1a9e8f22" : "#1a2c42",
                color: "#e0e8f0",
                cursor: "pointer",
                fontWeight: requestType === "od" ? 700 : 400,
              }}
            >
              🎯 On-Duty Request
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 6 }}>Start Date *</div>
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} style={paymentInputStyle} />
          </div>

          {requestType === "leave" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 6 }}>End Date</div>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} style={paymentInputStyle} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 6 }}>Reason *</div>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder={requestType === "leave" ? "e.g., Medical emergency, Family function..." : "e.g., Placement drive, Conference, Workshop..."}
              rows={3}
              style={{ ...paymentInputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 6 }}>Supporting Document (Optional)</div>
            <input type="file" onChange={(e) => setFormData({ ...formData, document: e.target.files[0] })} style={{ ...paymentInputStyle, padding: "8px" }} />
          </div>

          <button
            onClick={handleSubmit}
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Submit {requestType === "leave" ? "Leave" : "OD"} Request
          </button>

          {submitted && (
            <div style={{ marginTop: 16, background: "#22c55e22", border: "1px solid #22c55e55", borderRadius: 8, padding: "10px", textAlign: "center", color: "#22c55e" }}>
              ✅ Request submitted successfully!
            </div>
          )}
        </div>

        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📄 No Due Certificate</div>
          <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 20 }}>
            Generate your no-due certificate for semester completion or course withdrawal.
          </div>
          <button
            onClick={generateNoDueForm}
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Generate No Due Form
          </button>
        </div>
      </div>

      <div style={{ marginTop: 20, background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a52", fontSize: 16, fontWeight: 700 }}>Request History</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a2c42" }}>
              <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Type</th>
              <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Dates</th>
              <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, color: "#7a9ab5" }}>Reason</th>
              <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, color: "#7a9ab5" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {existingRequests.map((req) => (
              <tr key={req.id} style={{ borderTop: "1px solid #1e3a52" }}>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500 }}>{req.type}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{req.dates}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{req.reason}</td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  <span style={{
                    background: req.status === "Approved" ? "#22c55e22" : req.status === "Pending" ? "#f59e0b22" : "#ef444422",
                    color: req.status === "Approved" ? "#22c55e" : req.status === "Pending" ? "#f59e0b" : "#ef4444",
                    border: `1px solid ${req.status === "Approved" ? "#22c55e55" : req.status === "Pending" ? "#f59e0b55" : "#ef444455"}`,
                    borderRadius: 6, padding: "3px 12px", fontSize: 11, fontWeight: 700,
                  }}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IMSBotPage() {
  const initTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [messages, setMessages] = useState([{
    role: "bot",
    text: "👋 Hi! I'm the **IMS Bot**, your AI campus assistant.\n\nI can help with attendance, timetable, exam dates, announcements and more. What would you like to know?",
    time: initTime,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const quickQuestions = [
    "What's my attendance?",
    "Today's timetable?",
    "When is the next exam?",
    "Any announcements?",
    "What's my CGPA?",
  ];

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { role: "user", text: userText, time }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages.slice(1).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text.replace(/\*\*(.*?)\*\*/g, "$1"),
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "YOUR_API_KEY_HERE" },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const botReply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: "bot", text: botReply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Connection error. Please try again.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setLoading(false);
  };

  const formatText = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: "16px 20px", marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>IMS Bot</div>
            <div style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> Online · Ready to help
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ background: "#1a9e8f22", color: "#1a9e8f", border: "1px solid #1a9e8f44", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>AI POWERED</span>
          <button onClick={() => setMessages([{ role: "bot", text: "👋 Hi! I'm the **IMS Bot**, your AI campus assistant.\n\nI can help with attendance, timetable, exam dates, announcements and more. What would you like to know?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }])}
            style={{ background: "#1a2c42", border: "1px solid #263a52", color: "#e0e8f0", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>Clear</button>
        </div>
      </div>

      <div style={{ background: "#131f30", borderLeft: "1px solid #1e3a52", borderRight: "1px solid #1e3a52", padding: "10px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {quickQuestions.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)} style={{ background: "#1a2c42", border: "1px solid #263a52", color: "#9ab5cc", borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{q}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: "#0f1a28", borderLeft: "1px solid #1e3a52", borderRight: "1px solid #1e3a52", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end" }}>
            {msg.role === "bot" && (
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
            )}
            <div style={{ maxWidth: "70%" }}>
              <div style={{ background: msg.role === "user" ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#162033", border: msg.role === "bot" ? "1px solid #1e3a52" : "none", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.6, color: "#e0e8f0" }}>
                {formatText(msg.text)}
              </div>
              <div style={{ fontSize: 11, color: "#5a7a95", marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
            </div>
            {msg.role === "user" && (
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>AR</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div style={{ background: "#162033", border: "1px solid #1e3a52", borderRadius: "14px 14px 14px 4px", padding: "14px 18px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a9e8f", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: "#162033", border: "1px solid #1e3a52", borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask about attendance, timetable, exams..."
          style={{ flex: 1, background: "#0f1a28", border: "1px solid #1e3a52", borderRadius: 10, padding: "12px 16px", color: "#e0e8f0", fontSize: 14, outline: "none" }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: 10, border: "none", background: input.trim() && !loading ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#1a2c42", color: "#fff", fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
      </div>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

export default function StudentDashboard({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const sections = ["MAIN", "ACADEMICS", "TOOLS"];

  return (
    <div style={s.shell}>
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 220 : 64 }}>
        <div style={s.sidebarLogo}>
          <div style={s.logoBox}><span style={s.logoText}>MS</span></div>
          {sidebarOpen && <div><div style={s.brandName}>CollegeIMS</div><div style={s.brandSub}>Smart Campus Portal</div></div>}
        </div>
        {sidebarOpen && (
          <div style={s.studentBadge}>
            <div style={s.greenDot} />
            <div><div style={s.studentName}>{student.name}</div><div style={s.studentId}>{student.id}</div></div>
          </div>
        )}
        {sections.map(sec => (
          <div key={sec}>
            {sidebarOpen && <div style={s.navSection}>{sec}</div>}
            {navItems.filter(n => n.section === sec).map(item => (
              <button key={item.id} onClick={() => setActive(item.id)}
                style={{ ...s.navItem, ...(active === item.id ? s.navItemActive : {}), justifyContent: sidebarOpen ? "flex-start" : "center" }}>
                <span style={s.navIcon}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {item.id === "imsbot" && sidebarOpen && <span style={s.aiBadge}>AI</span>}
              </button>
            ))}
          </div>
        ))}
        <button onClick={onLogout} style={{ ...s.navItem, ...s.logoutBtn, justifyContent: sidebarOpen ? "flex-start" : "center", marginTop: "auto" }}>
          <span style={s.navIcon}>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.toggleBtn}>{sidebarOpen ? "←" : "→"}</button>
      </aside>

      <div style={s.main}>
        <header style={s.topbar}>
          <div>
            <div style={s.pageTitle}>{navItems.find(n => n.id === active)?.label || "Dashboard"}</div>
            <div style={s.breadcrumb}>Home / {navItems.find(n => n.id === active)?.label || "Dashboard"}</div>
          </div>
          <div style={s.topRight}>
            <div style={s.searchBox}>
              <span>🔍</span>
              <input placeholder="Search students, courses..." style={s.searchInput} />
            </div>
            <div style={{ fontSize: 20, cursor: "pointer" }}>🔔</div>
            <div style={s.avatarBox}>
              <div style={s.avatar}>AR</div>
              <div><div style={s.avatarName}>{student.name}</div><div style={s.avatarRole}>Student — {student.dept}</div></div>
            </div>
          </div>
        </header>

        <div style={s.content}>
          {active === "dashboard" && (
            <>
              <div style={s.greetRow}>
                <div style={s.greetDate}>📅 {today}</div>
                <h1 style={s.greetText}>{greeting}, {student.name.split(" ")[0]}! 👋</h1>
                <p style={s.greetSub}>Here's your academic snapshot for today.</p>
              </div>
              <div style={s.statGrid}>
                {[
                  { icon: "🎯", value: student.cgpa, label: "CGPA", sub: "↑ +0.2 this sem", color: "#1a9e8f" },
                  { icon: "✅", value: `${student.attendance}%`, label: "AVG ATTEND.", sub: "↑ Above 75% threshold", color: "#22c55e" },
                  { icon: "📚", value: student.subjects, label: "SUBJECTS", sub: "↑ Current semester", color: "#3b82f6" },
                  { icon: "📝", value: student.assignments, label: "ASSIGNMENTS", sub: "↑ Due this week", color: "#f59e0b" },
                ].map((c, i) => (
                  <div key={i} style={s.statCard}>
                    <div style={{ ...s.statIcon, background: c.color + "22" }}>{c.icon}</div>
                    <div style={{ ...s.statValue, color: c.color }}>{c.value}</div>
                    <div style={s.statLabel}>{c.label}</div>
                    <div style={s.statSub}>{c.sub}</div>
                  </div>
                ))}
              </div>
              <div style={s.bottomGrid}>
                <div style={s.panel}>
                  <div style={s.panelHeader}>
                    <div><div style={s.panelTitle}>Subject Attendance</div><div style={s.panelSub}>All enrolled subjects</div></div>
                    <span style={s.allGoodBadge}>ALL GOOD</span>
                  </div>
                  <div style={s.circleRow}>
                    {subjectAttendance.map((sub, i) => (
                      <div key={i} style={s.circleItem}>
                        <CircleProgress pct={sub.pct} color={sub.color} />
                        <div style={s.circleName}>{sub.name}</div>
                      </div>
                    ))}
                  </div>
                  <div style={s.legend}>
                    <span style={{ ...s.dot, background: "#1a9e8f" }} /> ≥85% SAFE
                    <span style={{ ...s.dot, background: "#f0a500", marginLeft: 12 }} /> 75–84% CAUTION
                    <span style={{ ...s.dot, background: "#ef4444", marginLeft: 12 }} /> &lt;75% CRITICAL
                  </div>
                </div>
                <div style={s.panel}>
                  <div style={s.panelHeader}>
                    <div><div style={s.panelTitle}>Today's Classes</div><div style={s.panelSub}>Mon schedule</div></div>
                    <button style={s.fullViewBtn} onClick={() => setActive("timetable")}>Full View</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {todaysClasses.map((cls, i) => (
                      <div key={i} style={{ ...s.classRow, ...(cls.now ? s.classRowNow : {}) }}>
                        <div style={s.classTime}>{cls.time}</div>
                        <div style={s.classDivider} />
                        <div style={{ flex: 1 }}>
                          <div style={s.classSubject}>{cls.subject}</div>
                          <div style={s.classTeacher}>{cls.teacher}</div>
                        </div>
                        <div style={s.classRoom}>{cls.room}</div>
                        {cls.now && <span style={s.nowBadge}>NOW</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {active === "attendance" && <AttendancePage />}
          {active === "timetable" && <TimetablePage />}
          {active === "marks" && <MarksPage />}
          {active === "calendar" && <CalendarPage />}
          {active === "feedback" && <FeedbackPage />}
          {active === "fees" && <FeePaymentPage />}
          {active === "certificates" && <CertificatesPage />}
          {active === "requests" && <LeaveAndODPage />}
          {active === "imsbot" && <IMSBotPage />}
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", width: "100vw", background: "#0d1b2a", fontFamily: "'Segoe UI', sans-serif", color: "#e0e8f0", overflow: "hidden" },
  sidebar: { background: "#101e2e", borderRight: "1px solid #1e3a52", display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s", overflow: "hidden", minHeight: "100vh", position: "relative", flexShrink: 0 },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, padding: "0 16px 24px" },
  logoBox: { minWidth: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 13 },
  brandName: { fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" },
  brandSub: { fontSize: 11, color: "#7a9ab5", whiteSpace: "nowrap" },
  studentBadge: { display: "flex", alignItems: "center", gap: 8, background: "#1a2c42", margin: "0 12px 20px", borderRadius: 8, padding: "10px 12px" },
  greenDot: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 },
  studentName: { fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" },
  studentId: { fontSize: 11, color: "#7a9ab5" },
  navSection: { fontSize: 10, color: "#4a6a85", fontWeight: 700, letterSpacing: 1, padding: "12px 20px 4px" },
  navItem: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px", border: "none", background: "none", color: "#7a9ab5", cursor: "pointer", fontSize: 14, borderLeft: "3px solid transparent", transition: "all 0.15s" },
  navItemActive: { background: "#1a2c42", color: "#e0e8f0", borderLeft: "3px solid #1a9e8f" },
  navIcon: { fontSize: 17, minWidth: 22, textAlign: "center" },
  aiBadge: { marginLeft: "auto", background: "#1a9e8f", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 },
  logoutBtn: { color: "#ef4444" },
  toggleBtn: { position: "absolute", bottom: 16, right: 8, background: "#1e3a52", border: "none", color: "#7a9ab5", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 13 },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid #1e3a52", background: "#101e2e" },
  pageTitle: { fontSize: 22, fontWeight: 700 },
  breadcrumb: { fontSize: 12, color: "#7a9ab5" },
  topRight: { display: "flex", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 8, padding: "8px 14px" },
  searchInput: { background: "none", border: "none", outline: "none", color: "#e0e8f0", fontSize: 13, width: 200 },
  avatarBox: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 },
  avatarName: { fontSize: 13, fontWeight: 600 },
  avatarRole: { fontSize: 11, color: "#7a9ab5" },
  content: { padding: 32, flex: 1, overflowY: "auto" },
  greetRow: { marginBottom: 28 },
  greetDate: { fontSize: 13, color: "#1a9e8f", marginBottom: 6 },
  greetText: { fontSize: 30, fontWeight: 700, margin: "0 0 6px" },
  greetSub: { fontSize: 14, color: "#7a9ab5", margin: 0 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 },
  statCard: { background: "#162033", borderRadius: 14, padding: "22px 20px", border: "1px solid #1e3a52" },
  statIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 },
  statValue: { fontSize: 36, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 0.5 },
  statSub: { fontSize: 12, color: "#22c55e", marginTop: 8 },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  panel: { background: "#162033", borderRadius: 14, padding: 24, border: "1px solid #1e3a52" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  panelTitle: { fontSize: 16, fontWeight: 700 },
  panelSub: { fontSize: 12, color: "#7a9ab5" },
  allGoodBadge: { background: "#1a9e8f22", color: "#1a9e8f", border: "1px solid #1a9e8f55", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 },
  circleRow: { display: "flex", justifyContent: "space-around", marginBottom: 16 },
  circleItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  circleName: { fontSize: 11, color: "#9ab5cc", textAlign: "center" },
  legend: { fontSize: 11, color: "#7a9ab5", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" },
  dot: { display: "inline-block", width: 8, height: 8, borderRadius: "50%" },
  fullViewBtn: { background: "#1e3a52", border: "1px solid #263a52", color: "#e0e8f0", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" },
  classRow: { display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 10, background: "#1a2c42" },
  classRowNow: { border: "1px solid #1a9e8f66" },
  classTime: { fontSize: 12, color: "#7a9ab5", minWidth: 95 },
  classDivider: { width: 2, height: 30, background: "#1a9e8f", borderRadius: 2 },
  classSubject: { fontSize: 14, fontWeight: 600 },
  classTeacher: { fontSize: 11, color: "#7a9ab5", marginTop: 2 },
  classRoom: { fontSize: 12, color: "#7a9ab5" },
  nowBadge: { background: "#1a9e8f", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4 },
};