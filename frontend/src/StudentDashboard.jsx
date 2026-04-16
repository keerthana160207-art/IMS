import { useState, useRef, useEffect, createContext, useContext } from "react";
import { api } from "./api";

export const StudentContext = createContext();

// ─── DATA ───────────────────────────────────────────────────────────────────

const defaultStudent = {
  name: "Arjun Ravi",
  id: "21CSE042",
  dept: "CSE",
  cgpa: 8.4,
  attendance: 86,
  subjects: 5,
  assignments: 3,
};

const defaultSubjectAttendance = [
  { name: "Data Struct.", pct: 86, color: "#1a9e8f" },
  { name: "Mathematics", pct: 90, color: "#1a9e8f" },
  { name: "OS Concepts", pct: 76, color: "#f0a500" },
  { name: "Database Sys.", pct: 92, color: "#1a9e8f" },
];

const defaultTodaysClasses = [
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
  { id: "lms", label: "LMS", icon: "📖", section: "ACADEMICS" },
  { id: "calendar", label: "Calendar", icon: "🗓️", section: "ACADEMICS" },
  { id: "feedback", label: "Feedback", icon: "⭐", section: "ACADEMICS" },
  { id: "fees", label: "Fee Payment", icon: "💰", section: "ACADEMICS" },
  { id: "seating", label: "Exam Seating", icon: "🪑", section: "EXAMS" },
  { id: "certificates", label: "Certificates", icon: "🏆", section: "TOOLS" },
  { id: "requests", label: "Leave & OD", icon: "📋", section: "TOOLS" },
  { id: "imsbot", label: "IMS Bot", icon: "🤖", section: "TOOLS" },
];

const defaultAttendanceSubjects = [
  { name: "Data Structures", present: 33, total: 38, pct: 86 },
  { name: "Mathematics III", present: 34, total: 38, pct: 90 },
  { name: "OS Concepts", present: 29, total: 38, pct: 76 },
  { name: "Database Systems", present: 35, total: 38, pct: 92 },
  { name: "English Comm.", present: 27, total: 38, pct: 71 },
];

const defaultTimetableData = {
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
  { subject: "OS Concepts", type: "Internal", score: 28, total: 50, pct: 56, grade: "C", color: "#ef4444" },
  { subject: "Database Systems", type: "Quiz", score: 9, total: 10, pct: 90, grade: "A+", color: "#1a9e8f" },
  { subject: "English Comm.", type: "Assignment", score: 14, total: 20, pct: 70, grade: "B+", color: "#f59e0b" },
];

const gradePoints = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0 };

const calendarEvents = {
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

// ─── LMS DATA ────────────────────────────────────────────────────────────────

const lmsCourses = [
  {
    id: 1, name: "Data Structures", code: "CSE301", teacher: "Dr. Ravi K.", color: "#1a9e8f",
    notes: [
      { id: 1, title: "Unit 1 - Arrays & Linked Lists", file: "unit1_arrays.pdf", size: "2.4 MB", date: "2026-03-10", type: "pdf" },
      { id: 2, title: "Unit 2 - Trees & Graphs", file: "unit2_trees.pdf", size: "3.1 MB", date: "2026-03-18", type: "pdf" },
      { id: 3, title: "Unit 3 - Sorting Algorithms", file: "unit3_sorting.pptx", size: "5.7 MB", date: "2026-03-25", type: "pptx" },
      { id: 4, title: "Lab Manual - DS", file: "ds_lab_manual.pdf", size: "1.8 MB", date: "2026-04-01", type: "pdf" },
    ],
    assignments: [
      { id: 1, title: "Assignment 1 - Linked List Implementation", due: "2026-04-12", marks: 20, status: "submitted", submittedFile: "arjun_ds_a1.pdf" },
      { id: 2, title: "Assignment 2 - BST Operations", due: "2026-04-20", marks: 20, status: "pending", submittedFile: null },
    ],
  },
  {
    id: 2, name: "Mathematics III", code: "MA301", teacher: "Dr. Priya S.", color: "#3b82f6",
    notes: [
      { id: 1, title: "Unit 1 - Laplace Transforms", file: "laplace.pdf", size: "1.9 MB", date: "2026-03-08", type: "pdf" },
      { id: 2, title: "Unit 2 - Fourier Series", file: "fourier.pdf", size: "2.2 MB", date: "2026-03-20", type: "pdf" },
      { id: 3, title: "Formula Sheet", file: "formula_sheet.pdf", size: "0.5 MB", date: "2026-04-02", type: "pdf" },
    ],
    assignments: [
      { id: 1, title: "Assignment 1 - Laplace Problems", due: "2026-04-10", marks: 15, status: "submitted", submittedFile: "arjun_ma_a1.pdf" },
      { id: 2, title: "Assignment 2 - Fourier Analysis", due: "2026-04-25", marks: 15, status: "pending", submittedFile: null },
    ],
  },
  {
    id: 3, name: "OS Concepts", code: "CSE302", teacher: "Dr. Kumar", color: "#a855f7",
    notes: [
      { id: 1, title: "Unit 1 - Process Management", file: "os_unit1.pdf", size: "2.8 MB", date: "2026-03-05", type: "pdf" },
      { id: 2, title: "Unit 2 - Memory Management", file: "os_unit2.pdf", size: "3.4 MB", date: "2026-03-19", type: "pdf" },
    ],
    assignments: [
      { id: 1, title: "Assignment 1 - Scheduling Algorithms", due: "2026-04-15", marks: 25, status: "pending", submittedFile: null },
    ],
  },
  {
    id: 4, name: "Database Systems", code: "CSE303", teacher: "Prof. Ahmed", color: "#22c55e",
    notes: [
      { id: 1, title: "Unit 1 - ER Diagrams & SQL", file: "db_unit1.pdf", size: "3.0 MB", date: "2026-03-12", type: "pdf" },
      { id: 2, title: "Unit 2 - Normalization", file: "db_unit2.pdf", size: "2.6 MB", date: "2026-03-28", type: "pdf" },
      { id: 3, title: "SQL Lab Exercises", file: "sql_lab.pdf", size: "1.2 MB", date: "2026-04-05", type: "pdf" },
    ],
    assignments: [
      { id: 1, title: "DB Design Project - Phase 1", due: "2026-04-18", marks: 30, status: "submitted", submittedFile: "arjun_db_project.pdf" },
    ],
  },
  {
    id: 5, name: "English Comm.", code: "ENG301", teacher: "Prof. Rao", color: "#f59e0b",
    notes: [
      { id: 1, title: "Technical Writing Guide", file: "tech_writing.pdf", size: "1.4 MB", date: "2026-03-10", type: "pdf" },
      { id: 2, title: "Presentation Skills Notes", file: "presentation.pptx", size: "4.2 MB", date: "2026-03-22", type: "pptx" },
    ],
    assignments: [
      { id: 1, title: "Technical Report Writing", due: "2026-04-14", marks: 20, status: "pending", submittedFile: null },
    ],
  },
];

// ─── SEATING DATA ────────────────────────────────────────────────────────────

const examSeatingData = [
  {
    id: 1,
    examName: "CAT 2 - Data Structures",
    examCode: "CSE301-CAT2",
    subject: "Data Structures",
    date: "2026-04-10",
    time: "10:00 AM – 11:30 AM",
    hallNumber: "Block A - Hall 3",
    seatNumber: "A3-24",
    studentName: defaultStudent.name,
    registerNumber: defaultStudent.id,
    className: "III CSE - B",
    invigilator: "Dr. Priya S.",
    instructions: "Bring your ID card and hall ticket. No electronic devices allowed.",
    released: true,
    releaseTime: "09:40 AM",
  },
  {
    id: 2,
    examName: "Semester Exam - Data Structures",
    examCode: "CSE301-SEM",
    subject: "Data Structures",
    date: "2026-05-18",
    time: "09:00 AM – 12:00 PM",
    hallNumber: "Block C - Hall 1",
    seatNumber: "C1-07",
    studentName: defaultStudent.name,
    registerNumber: defaultStudent.id,
    className: "III CSE - B",
    invigilator: "Prof. Ahmed",
    instructions: "Bring your ID card, hall ticket, and drawing instruments if needed. Blue/black pen only.",
    released: false,
    releaseTime: "08:40 AM",
  },
  {
    id: 3,
    examName: "Semester Exam - Mathematics III",
    examCode: "MA301-SEM",
    subject: "Mathematics III",
    date: "2026-05-20",
    time: "09:00 AM – 12:00 PM",
    hallNumber: "Block C - Hall 2",
    seatNumber: "C2-15",
    studentName: defaultStudent.name,
    registerNumber: defaultStudent.id,
    className: "III CSE - B",
    invigilator: "Dr. Ravi K.",
    instructions: "Scientific calculators allowed. Bring ID and hall ticket.",
    released: false,
    releaseTime: "08:40 AM",
  },
  {
    id: 4,
    examName: "Semester Exam - OS Concepts",
    examCode: "CSE302-SEM",
    subject: "OS Concepts",
    date: "2026-05-22",
    time: "09:00 AM – 12:00 PM",
    hallNumber: "Block B - Hall 4",
    seatNumber: "B4-31",
    studentName: defaultStudent.name,
    registerNumber: defaultStudent.id,
    className: "III CSE - B",
    invigilator: "Dr. Kumar",
    instructions: "Closed book exam. No calculators. Bring ID card.",
    released: false,
    releaseTime: "08:40 AM",
  },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

function generateNotifications(attendanceSubjects, marksData, examSeatingData) {
  const notifs = [];
  attendanceSubjects.forEach(sub => {
    if (sub.pct < 75) {
      notifs.push({
        id: `att-${sub.name}`,
        type: "danger",
        icon: "⚠️",
        title: "Low Attendance Alert",
        message: `Your attendance in ${sub.name} is ${sub.pct}% — below the required 75%. You need to attend more classes to avoid detention.`,
        time: "Today",
        read: false,
      });
    }
  });
  marksData.forEach(m => {
    if (m.pct < 60) {
      notifs.push({
        id: `marks-${m.subject}`,
        type: "warning",
        icon: "📉",
        title: "Low Internal Marks",
        message: `Your internal score in ${m.subject} is ${m.score}/${m.total} (${m.pct}%) — below 60%. Please meet your faculty for guidance.`,
        time: "Today",
        read: false,
      });
    }
  });
  examSeatingData.filter(e => e.released).forEach(e => {
    notifs.push({
      id: `seat-${e.id}`,
      type: "info",
      icon: "🪑",
      title: "Seating Arrangement Released",
      message: `Seating for ${e.examName} has been uploaded. Your seat: ${e.seatNumber} in ${e.hallNumber}.`,
      time: "1 hour ago",
      read: false,
    });
  });
  notifs.push({
    id: "lms-note",
    type: "success",
    icon: "📖",
    title: "New Study Material Uploaded",
    message: "Dr. Ravi K. has uploaded Unit 3 - Sorting Algorithms notes for Data Structures.",
    time: "2 hours ago",
    read: true,
  });
  notifs.push({
    id: "assign-due",
    type: "warning",
    icon: "📝",
    title: "Assignment Due Soon",
    message: "Data Structures Assignment 2 - BST Operations is due on Apr 20. Submit via LMS.",
    time: "3 hours ago",
    read: true,
  });
  return notifs;
}

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

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

// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────

function NotificationBell() {
  const { notifications, setNotifications } = useContext(StudentContext);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const typeColors = { danger: "#ef4444", warning: "#f59e0b", info: "#3b82f6", success: "#22c55e" };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", fontSize: 22, padding: 4 }}>
        🔔
        {unread > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: 48, width: 380, background: "#162033", border: "1px solid #1e3a52", borderRadius: 14, zIndex: 1000, boxShadow: "0 8px 32px #00000066", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e3a52", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Notifications {unread > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 10, padding: "1px 8px", fontSize: 11, marginLeft: 6 }}>{unread} new</span>}</div>
            {unread > 0 && <button onClick={markAllRead} style={{ background: "none", border: "none", color: "#1a9e8f", fontSize: 12, cursor: "pointer" }}>Mark all read</button>}
          </div>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {notifications.map((n, i) => (
              <div key={n.id} onClick={() => {
                  if (!n.read && n.id && !`${n.id}`.startsWith('att-') && !`${n.id}`.startsWith('lms-') && !`${n.id}`.startsWith('marks-') && !`${n.id}`.startsWith('assign-') && !`${n.id}`.startsWith('seat-')) {
                      api.markNotificationRead(n.id).catch(e => console.error(e));
                  }
                  setNotifications(notifications.map((x, xi) => xi === i ? { ...x, read: true } : x));
              }}
                style={{ padding: "14px 18px", borderBottom: "1px solid #1e3a5222", background: n.read ? "transparent" : "#1a2c42", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: typeColors[n.type] }}>{n.title}</div>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: typeColors[n.type], flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ab5cc", lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: "#5a7a95", marginTop: 4 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function AttendancePage() {
  const { attendanceSubjects } = useContext(StudentContext);
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📊 Attendance Tracker</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>My Attendance</h1>
      </div>
      {attendanceSubjects.filter(s => s.pct < 75).map(s => (
        <div key={s.name} style={{ background: "#ef444415", border: "1px solid #ef444455", borderRadius: 10, padding: "12px 18px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 14 }}>Low Attendance: {s.name}</div>
            <div style={{ color: "#ef9999", fontSize: 12 }}>Current: {s.pct}% — You need to attend at least {Math.ceil((0.75 * s.total - s.present) / 0.25)} more classes to reach 75%</div>
          </div>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { icon: "✅", value: "86%", label: "OVERALL", sub: "↑ Above minimum 75%", color: "#22c55e", grad: "linear-gradient(135deg,#0d3d2e,#162033)" },
          { icon: "📋", value: "190", label: "TOTAL CLASSES", sub: "↑ 5 subjects", color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#162033)" },
          { icon: "❌", value: "28", label: "ABSENT", sub: "↑ Days missed", color: "#ef4444", grad: "linear-gradient(135deg,#3d0d0d,#162033)" },
          { icon: "⚠️", value: "1", label: "LOW ATTEND.", sub: "↑ Subject below 75%", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#162033)" },
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
              {["SUBJECT", "PRESENT/TOTAL", "PERCENTAGE", "CLASSES NEEDED", "STATUS"].map(h => (
                <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceSubjects.map((sub, i) => {
              const st = getStatus(sub.pct);
              const needed = sub.pct < 75 ? Math.ceil((0.75 * sub.total - sub.present) / 0.25) : 0;
              return (
                <tr key={i} style={{ borderTop: "1px solid #1e3a52" }}>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600 }}>{sub.name}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, color: "#9ab5cc" }}>{sub.present} / {sub.total}</td>
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: st.color }}>{sub.pct}%</td>
                  <td style={{ padding: "16px 24px", fontSize: 13, color: needed > 0 ? "#ef4444" : "#22c55e" }}>
                    {needed > 0 ? `Need ${needed} more` : "On track ✓"}
                  </td>
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
  const { timetableData } = useContext(StudentContext);
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
  const { student } = useContext(StudentContext);
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
      {marksData.filter(m => m.pct < 60).map(m => (
        <div key={m.subject} style={{ background: "#f59e0b15", border: "1px solid #f59e0b55", borderRadius: 10, padding: "12px 18px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>📉</span>
          <div>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>Low Internal Marks: {m.subject}</div>
            <div style={{ color: "#f59e0baa", fontSize: 12 }}>Score: {m.score}/{m.total} ({m.pct}%) — Below 60%. Please meet your faculty for improvement guidance.</div>
          </div>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { icon: "🏆", value: student.cgpa, label: "CURRENT CGPA", sub: "↑ Semester 6", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#162033)" },
          { icon: "📚", value: student.subjects, label: "SUBJECTS", sub: "↑ This semester", color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#162033)" },
          { icon: "🎯", value: "92%", label: "BEST SCORE", sub: "↑ Database Systems", color: "#1a9e8f", grad: "linear-gradient(135deg,#0d3d2e,#162033)" },
          { icon: "🚨", value: "1", label: "LOW MARKS", sub: "↑ OS Concepts <60%", color: "#ef4444", grad: "linear-gradient(135deg,#3d0d0d,#162033)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "22px 20px", border: "1px solid #1e3a52" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{c.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 0.5 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: c.color, marginTop: 8 }}>{c.sub}</div>
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
                  <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 600 }}>
                    {row.pct < 60 && <span style={{ fontSize: 12, marginRight: 6 }}>🚨</span>}
                    {row.subject}
                  </td>
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
        </div>
      )}
    </div>
  );
}

// ─── LMS PAGE ─────────────────────────────────────────────────────────────────

function LMSPage() {
  const [courses, setCourses] = useState(lmsCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const course = courses.find(c => c.id === selectedCourse);

  const handleAssignmentUpload = (assignmentId, file) => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setCourses(courses.map(c => c.id === selectedCourse ? {
        ...c,
        assignments: c.assignments.map(a => a.id === assignmentId ? { ...a, status: "submitted", submittedFile: file.name } : a)
      } : c));
      setUploading(false);
      setUploadSuccess(assignmentId);
      setTimeout(() => setUploadSuccess(null), 3000);
    }, 1200);
  };

  const fileIcon = (type) => type === "pptx" ? "📊" : "📄";
  const daysLeft = (due) => {
    const diff = Math.ceil((new Date(due) - new Date()) / 86400000);
    return diff;
  };

  if (!selectedCourse) {
    const totalNotes = courses.reduce((a, c) => a + c.notes.length, 0);
    const totalAssignments = courses.reduce((a, c) => a + c.assignments.length, 0);
    const pendingAssignments = courses.reduce((a, c) => a + c.assignments.filter(x => x.status === "pending").length, 0);

    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📖 Learning Management System</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>My Courses</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 28 }}>
          {[
            { icon: "📚", value: courses.length, label: "ENROLLED COURSES", color: "#1a9e8f" },
            { icon: "📄", value: totalNotes, label: "STUDY MATERIALS", color: "#3b82f6" },
            { icon: "⏳", value: pendingAssignments, label: "PENDING SUBMIT.", color: "#f59e0b" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#162033", borderRadius: 14, padding: "22px 20px", border: "1px solid #1e3a52", display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 11, color: "#7a9ab5", letterSpacing: 0.5 }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {courses.map(c => {
            const pending = c.assignments.filter(a => a.status === "pending").length;
            return (
              <div key={c.id} onClick={() => setSelectedCourse(c.id)} style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24, cursor: "pointer", transition: "border-color 0.2s", borderLeft: `4px solid ${c.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#7a9ab5", marginTop: 2 }}>{c.code} • {c.teacher}</div>
                  </div>
                  {pending > 0 && <span style={{ background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b55", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{pending} due</span>}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "#9ab5cc" }}>📄 {c.notes.length} notes</div>
                  <div style={{ fontSize: 12, color: "#9ab5cc" }}>📝 {c.assignments.length} assignments</div>
                </div>
                <div style={{ marginTop: 14, background: "#1a2c42", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#7a9ab5" }}>View Course Materials</span>
                  <span style={{ fontSize: 16 }}>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={() => setSelectedCourse(null)} style={{ background: "#1a2c42", border: "1px solid #1e3a52", color: "#e0e8f0", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14 }}>← Back</button>
        <div>
          <div style={{ fontSize: 13, color: "#1a9e8f" }}>📖 LMS — {course.code}</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{course.name}</h1>
          <div style={{ fontSize: 12, color: "#7a9ab5" }}>{course.teacher}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{ id: "notes", label: "📄 Study Materials" }, { id: "assignments", label: "📝 Assignments" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: activeTab === t.id ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#1a2c42", color: activeTab === t.id ? "#fff" : "#7a9ab5", fontWeight: activeTab === t.id ? 700 : 500, fontSize: 14, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "notes" && (
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e3a52", fontSize: 16, fontWeight: 700 }}>Study Materials — {course.name}</div>
          {course.notes.map((note, i) => (
            <div key={note.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderTop: i > 0 ? "1px solid #1e3a52" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: course.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{fileIcon(note.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{note.title}</div>
                <div style={{ fontSize: 12, color: "#7a9ab5", marginTop: 2 }}>{note.file} • {note.size} • Uploaded {note.date}</div>
              </div>
              <button style={{ background: "#1a9e8f22", border: "1px solid #1a9e8f55", color: "#1a9e8f", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>⬇ Download</button>
            </div>
          ))}
          {course.notes.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#7a9ab5" }}>No materials uploaded yet</div>}
        </div>
      )}

      {activeTab === "assignments" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {course.assignments.map(a => {
            const dl = daysLeft(a.due);
            const urgent = dl <= 3 && dl >= 0;
            const overdue = dl < 0;
            return (
              <div key={a.id} style={{ background: "#162033", borderRadius: 14, border: `1px solid ${overdue ? "#ef444455" : urgent ? "#f59e0b55" : "#1e3a52"}`, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "#7a9ab5", marginTop: 4 }}>Max Marks: {a.marks} • Due: {a.due}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {(urgent || overdue) && a.status !== "submitted" && (
                      <span style={{ background: overdue ? "#ef444422" : "#f59e0b22", color: overdue ? "#ef4444" : "#f59e0b", border: `1px solid ${overdue ? "#ef444455" : "#f59e0b55"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                        {overdue ? "OVERDUE" : `${dl}d left`}
                      </span>
                    )}
                    <span style={{ background: a.status === "submitted" ? "#22c55e22" : "#f59e0b22", color: a.status === "submitted" ? "#22c55e" : "#f59e0b", border: `1px solid ${a.status === "submitted" ? "#22c55e55" : "#f59e0b55"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                      {a.status === "submitted" ? "SUBMITTED" : "PENDING"}
                    </span>
                  </div>
                </div>
                {a.status === "submitted" ? (
                  <div style={{ background: "#22c55e15", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>✅</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>Submitted successfully</div>
                      <div style={{ fontSize: 12, color: "#9ab5cc", marginTop: 2 }}>File: {a.submittedFile}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 10 }}>Upload your assignment (PDF, DOC, ZIP)</div>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#1a9e8f,#17b897)", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      📤 Choose File & Submit
                      <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={e => e.target.files[0] && handleAssignmentUpload(a.id, e.target.files[0])} style={{ display: "none" }} />
                    </label>
                    {uploading && <div style={{ marginTop: 10, color: "#1a9e8f", fontSize: 13 }}>Uploading...</div>}
                    {uploadSuccess === a.id && <div style={{ marginTop: 10, color: "#22c55e", fontSize: 13 }}>✅ Uploaded successfully!</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────

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
        </div>
      </div>
    </div>
  );
}

// ─── EXAM SEATING PAGE ────────────────────────────────────────────────────────

function ExamSeatingPage() {
  const { student } = useContext(StudentContext);
  const [selectedExam, setSelectedExam] = useState(null);
  const now = new Date();

  const isViewable = (exam) => {
    if (!exam.released) return false;
    return true;
  };

  const exam = examSeatingData.find(e => e.id === selectedExam);

  if (selectedExam && exam && isViewable(exam)) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <button onClick={() => setSelectedExam(null)} style={{ background: "#1a2c42", border: "1px solid #1e3a52", color: "#e0e8f0", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14 }}>← Back</button>
          <div>
            <div style={{ fontSize: 13, color: "#1a9e8f" }}>🪑 Exam Seating Arrangement</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{exam.examName}</h1>
          </div>
        </div>

        {/* Hall Ticket Card */}
        <div style={{ background: "#162033", border: "2px solid #1a9e8f44", borderRadius: 18, overflow: "hidden", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg,#0d3d2e,#1a2c42)", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px dashed #1a9e8f44" }}>
            <div>
              <div style={{ fontSize: 11, color: "#1a9e8f", letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>COLLEGE OF ENGINEERING — EXAM ADMIT CARD</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{exam.examName}</div>
              <div style={{ fontSize: 13, color: "#7a9ab5", marginTop: 2 }}>Exam Code: {exam.examCode}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#7a9ab5", marginBottom: 4 }}>STATUS</div>
              <div style={{ background: "#22c55e22", border: "1px solid #22c55e55", color: "#22c55e", borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>CONFIRMED</div>
            </div>
          </div>

          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
              {[
                { label: "Student Name", value: student.name },
                { label: "Register Number", value: student.id },
                { label: "Class", value: exam.className },
                { label: "Department", value: "Computer Science & Engineering" },
                { label: "Exam Date", value: new Date(exam.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                { label: "Exam Time", value: exam.time },
              ].map((field, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: "#7a9ab5", letterSpacing: 0.5, marginBottom: 4 }}>{field.label.toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{field.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { icon: "🏛️", label: "Hall Number", value: exam.hallNumber, color: "#3b82f6" },
                { icon: "🪑", label: "Seat Number", value: exam.seatNumber, color: "#1a9e8f" },
                { icon: "👨‍🏫", label: "Invigilator", value: exam.invigilator, color: "#a855f7" },
              ].map((item, i) => (
                <div key={i} style={{ background: item.color + "15", border: `1px solid ${item.color}44`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, color: item.color, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f59e0b15", border: "1px solid #f59e0b44", borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>📋 INSTRUCTIONS</div>
              <div style={{ fontSize: 13, color: "#d4a853", lineHeight: 1.6 }}>{exam.instructions}</div>
            </div>
          </div>

          <div style={{ background: "#0d1b2a", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#5a7a95" }}>Seating released at: {exam.releaseTime} on {exam.date}</div>
            <button style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, color: "#fff", padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🖨️ Print</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🪑 Examination</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Exam Seating Arrangement</h1>
        <p style={{ fontSize: 14, color: "#7a9ab5", margin: "8px 0 0" }}>Seating is visible 20 minutes before the exam time once released by admin.</p>
      </div>

      <div style={{ background: "#1a9e8f15", border: "1px solid #1a9e8f44", borderRadius: 10, padding: "14px 18px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>🪑</span>
        <div style={{ fontSize: 13, color: "#9ab5cc" }}>
          <strong style={{ color: "#1a9e8f" }}>CAT 2 - Data Structures</strong> seating arrangement has been released! Your seat is <strong style={{ color: "#1a9e8f" }}>A3-24</strong> in Block A Hall 3. Exam at 10:00 AM today.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {examSeatingData.map(exam => {
          const viewable = isViewable(exam);
          return (
            <div key={exam.id} style={{ background: "#162033", borderRadius: 14, border: `1px solid ${viewable ? "#1a9e8f55" : "#1e3a52"}`, padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: viewable ? "#1a9e8f22" : "#1e3a5244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🪑</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{exam.examName}</div>
                <div style={{ fontSize: 12, color: "#7a9ab5", marginTop: 3 }}>{exam.examCode} • {exam.date} • {exam.time}</div>
                {viewable && (
                  <div style={{ fontSize: 13, color: "#1a9e8f", marginTop: 6 }}>
                    Hall: <strong>{exam.hallNumber}</strong> &nbsp;|&nbsp; Seat: <strong>{exam.seatNumber}</strong>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                {viewable ? (
                  <button onClick={() => setSelectedExam(exam.id)} style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View Seat Card</button>
                ) : (
                  <div>
                    <div style={{ background: "#1e3a5244", border: "1px solid #1e3a52", borderRadius: 8, color: "#5a7a95", padding: "10px 20px", fontSize: 13 }}>🔒 Not Released</div>
                    <div style={{ fontSize: 11, color: "#5a7a95", marginTop: 6 }}>Available {exam.releaseTime} on exam day</div>
                  </div>
                )}
              </div>
              <div>
                <span style={{ background: viewable ? "#22c55e22" : "#1e3a5244", color: viewable ? "#22c55e" : "#5a7a95", border: `1px solid ${viewable ? "#22c55e55" : "#1e3a52"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                  {viewable ? "RELEASED" : "PENDING"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── FEEDBACK PAGE ────────────────────────────────────────────────────────────

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

  const handleSubmit = () => {
    if (!selectedFaculty) { alert("Please select a faculty member"); return; }
    if (Object.keys(ratings).length !== feedbackQuestions.length) { alert("Please answer all questions"); return; }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setSelectedFaculty(null); setRatings({}); setAdditionalComment(""); }, 3000);
  };

  const avg = () => { const v = Object.values(ratings); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : 0; };

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
            {facultyList.map((f) => (
              <button key={f.id} onClick={() => setSelectedFaculty(f)} style={{ background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 10, padding: 16, textAlign: "left", cursor: "pointer" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a9e8f" }}>{f.name}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{f.course}</div>
                <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 2 }}>{f.department} Department</div>
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
            <button onClick={() => setSelectedFaculty(null)} style={{ background: "#ef444422", border: "1px solid #ef444455", color: "#ef4444", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Change</button>
          </div>
          <div style={{ padding: 24 }}>
            {feedbackQuestions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: idx < feedbackQuestions.length - 1 ? "1px solid #1e3a52" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{idx + 1}. {q}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {ratingOptions.map(opt => (
                    <button key={opt.value} onClick={() => setRatings({ ...ratings, [idx]: opt.value })} style={{ padding: "7px 14px", borderRadius: 8, border: ratings[idx] === opt.value ? `2px solid ${opt.color}` : "1px solid #1e3a52", background: ratings[idx] === opt.value ? opt.color + "22" : "transparent", color: ratings[idx] === opt.value ? opt.color : "#9ab5cc", fontWeight: ratings[idx] === opt.value ? 700 : 400, cursor: "pointer" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <textarea value={additionalComment} onChange={e => setAdditionalComment(e.target.value)} placeholder="Additional comments..." rows={3} style={{ width: "100%", background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 10, padding: 12, color: "#e0e8f0", fontSize: 13, resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ background: "#1a9e8f22", padding: "8px 16px", borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#7a9ab5" }}>Avg: </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#1a9e8f" }}>{avg()}</span>
                <span style={{ fontSize: 12, color: "#7a9ab5" }}>/5</span>
              </div>
              <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Submit Feedback</button>
            </div>
            {submitted && <div style={{ marginTop: 16, background: "#22c55e22", border: "1px solid #22c55e55", borderRadius: 10, padding: 12, textAlign: "center", color: "#22c55e" }}>✅ Feedback submitted successfully!</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FEE PAYMENT PAGE ─────────────────────────────────────────────────────────

function FeePaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  const feeDetails = { tuitionFee: 85000, hostelFee: 45000, libraryFee: 5000, sportsFee: 2000, totalFee: 137000, paidAmount: 89000, pendingAmount: 48000, dueDate: "2026-03-25" };

  const handlePayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) { alert("Enter a valid amount"); return; }
    setPaymentStatus("processing");
    setTimeout(() => { setPaymentStatus("success"); setTimeout(() => setPaymentStatus(null), 3000); }, 2000);
  };

  const inputSt = { width: "100%", background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 8, padding: 12, color: "#e0e8f0", fontSize: 13, marginTop: 8, outline: "none" };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>💰 Fee Management</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Fee Payment</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Fee Summary</div>
          {[["Tuition Fee", feeDetails.tuitionFee], ["Hostel Fee", feeDetails.hostelFee], ["Library Fee", feeDetails.libraryFee], ["Sports Fee", feeDetails.sportsFee]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #1e3a52", marginBottom: 8 }}>
              <span style={{ color: "#9ab5cc" }}>{l}</span><span style={{ fontWeight: 600 }}>₹{v.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "2px solid #1a9e8f", marginBottom: 12, fontSize: 16, fontWeight: 700 }}>
            <span>Total</span><span style={{ color: "#1a9e8f" }}>₹{feeDetails.totalFee.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: "#9ab5cc" }}>Paid</span><span style={{ color: "#22c55e", fontWeight: 700 }}>₹{feeDetails.paidAmount.toLocaleString()}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><span style={{ color: "#9ab5cc" }}>Pending</span><span style={{ color: "#ef4444", fontWeight: 800, fontSize: 18 }}>₹{feeDetails.pendingAmount.toLocaleString()}</span></div>
          <div style={{ background: "#ef444422", borderRadius: 8, textAlign: "center", padding: 10, fontSize: 12, color: "#ef4444" }}>⚠️ Due: {new Date(feeDetails.dueDate).toLocaleDateString()}</div>
        </div>
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Make Payment</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[{ id: "card", label: "💳 Card" }, { id: "netbanking", label: "🏦 NetBanking" }, { id: "neft", label: "🏧 NEFT" }].map(m => (
              <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, border: paymentMethod === m.id ? "2px solid #1a9e8f" : "1px solid #1e3a52", background: paymentMethod === m.id ? "#1a9e8f22" : "#1a2c42", color: "#e0e8f0", cursor: "pointer", fontSize: 12 }}>{m.label}</button>
            ))}
          </div>
          {paymentMethod === "card" && (
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="Card Number" style={inputSt} />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <input type="text" placeholder="MM/YY" style={{ ...inputSt, flex: 1, marginTop: 0 }} />
                <input type="text" placeholder="CVV" style={{ ...inputSt, flex: 1, marginTop: 0 }} />
              </div>
              <input type="text" placeholder="Cardholder Name" style={inputSt} />
            </div>
          )}
          {paymentMethod === "netbanking" && (
            <select style={{ ...inputSt, marginBottom: 16 }}>
              <option>Select Bank</option><option>SBI</option><option>HDFC</option><option>ICICI</option>
            </select>
          )}
          {paymentMethod === "neft" && (
            <div style={{ background: "#1a2c42", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
              <div style={{ color: "#7a9ab5", marginBottom: 8 }}>Bank Details for NEFT</div>
              <div>A/C: 123456789012 | IFSC: ICIC0001234 | UPI: collegeims@icici</div>
              <input type="text" placeholder="UTR/Transaction Reference" style={{ ...inputSt, marginTop: 10 }} />
            </div>
          )}
          <input type="number" placeholder="Enter Amount (₹)" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={{ ...inputSt, marginBottom: 16 }} />
          <button onClick={handlePayment} disabled={paymentStatus === "processing"} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: paymentStatus === "processing" ? "#7a9ab5" : "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            {paymentStatus === "processing" ? "Processing..." : `Pay ₹${paymentAmount || "0"}`}
          </button>
          {paymentStatus === "success" && <div style={{ marginTop: 14, background: "#22c55e22", border: "1px solid #22c55e55", borderRadius: 8, padding: 10, textAlign: "center", color: "#22c55e" }}>✅ Payment successful! Receipt sent.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── CERTIFICATES PAGE ────────────────────────────────────────────────────────

function CertificatesPage() {
  const [certs, setCerts] = useState([
    { id: 1, name: "Hackathon 2025 - Winner.pdf", date: "2025-11-20", type: "Achievement", size: "1.2 MB" },
    { id: 2, name: "Python Programming Certificate.pdf", date: "2025-09-15", type: "Course", size: "0.8 MB" },
    { id: 3, name: "Internship Completion - ABC Corp.pdf", date: "2025-07-30", type: "Internship", size: "2.1 MB" },
  ]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setTimeout(() => {
      setCerts([...files.map((f, idx) => ({ id: certs.length + idx + 1, name: f.name, date: new Date().toISOString().split("T")[0], type: "Uploaded", size: (f.size / 1048576).toFixed(1) + " MB" })), ...certs]);
      setUploading(false);
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🏆 Achievements</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>My Certificates</h1>
      </div>
      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: uploading ? 12 : 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Upload Certificate</div>
          <label style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff" }}>
            📤 Upload File
            <input type="file" multiple accept=".pdf,.jpg,.png" onChange={handleUpload} style={{ display: "none" }} />
          </label>
        </div>
        {uploading && <div style={{ color: "#1a9e8f", fontSize: 13 }}>Uploading...</div>}
      </div>
      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a2c42" }}>
              {["CERTIFICATE NAME", "TYPE", "DATE", "SIZE", "ACTION"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id} style={{ borderTop: "1px solid #1e3a52" }}>
                <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 500 }}>📄 {c.name}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{c.type}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{new Date(c.date).toLocaleDateString()}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{c.size}</td>
                <td style={{ padding: "14px 20px" }}>
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

// ─── LEAVE & OD PAGE ──────────────────────────────────────────────────────────

function LeaveAndODPage() {
  const [requestType, setRequestType] = useState("leave");
  const [formData, setFormData] = useState({ startDate: "", endDate: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, type: "Leave", dates: "Mar 10 - Mar 12, 2026", status: "Approved", reason: "Medical emergency" },
    { id: 2, type: "OD", dates: "Mar 5, 2026", status: "Pending", reason: "Placement drive" },
  ]);

  const inputSt = { width: "100%", background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 8, padding: 12, color: "#e0e8f0", fontSize: 13, marginTop: 8, outline: "none" };

  const handleSubmit = () => {
    if (!formData.startDate || !formData.reason) { alert("Fill required fields"); return; }
    setRequests([{ id: requests.length + 1, type: requestType === "leave" ? "Leave" : "OD", dates: formData.endDate ? `${formData.startDate} - ${formData.endDate}` : formData.startDate, status: "Pending", reason: formData.reason }, ...requests]);
    setSubmitted(true);
    setFormData({ startDate: "", endDate: "", reason: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📋 Leave & On-Duty</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Leave & OD Management</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[{ id: "leave", label: "📝 Leave" }, { id: "od", label: "🎯 On-Duty" }].map(t => (
              <button key={t.id} onClick={() => setRequestType(t.id)} style={{ flex: 1, padding: 10, borderRadius: 8, border: requestType === t.id ? "2px solid #1a9e8f" : "1px solid #1e3a52", background: requestType === t.id ? "#1a9e8f22" : "#1a2c42", color: "#e0e8f0", cursor: "pointer", fontWeight: requestType === t.id ? 700 : 400, fontSize: 14 }}>{t.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 4 }}>Start Date *</div>
          <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={inputSt} />
          {requestType === "leave" && (<><div style={{ fontSize: 13, color: "#7a9ab5", marginTop: 12, marginBottom: 4 }}>End Date</div><input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={inputSt} /></>)}
          <div style={{ fontSize: 13, color: "#7a9ab5", marginTop: 12, marginBottom: 4 }}>Reason *</div>
          <textarea value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} rows={3} style={{ ...inputSt, resize: "vertical" }} placeholder="Reason..." />
          <button onClick={handleSubmit} style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Submit Request</button>
          {submitted && <div style={{ marginTop: 12, background: "#22c55e22", border: "1px solid #22c55e55", borderRadius: 8, padding: 10, textAlign: "center", color: "#22c55e" }}>✅ Submitted successfully!</div>}
        </div>
        <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📄 No Due Certificate</div>
          <div style={{ fontSize: 13, color: "#7a9ab5", marginBottom: 20 }}>Generate for semester completion or withdrawal.</div>
          <button onClick={() => alert("No Due Certificate generated! (PDF download in production)")} style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Generate No Due Form</button>
        </div>
      </div>
      <div style={{ background: "#162033", borderRadius: 14, border: "1px solid #1e3a52", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e3a52", fontSize: 16, fontWeight: 700 }}>Request History</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a2c42" }}>
              {["TYPE", "DATES", "REASON", "STATUS"].map(h => <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, color: "#7a9ab5", fontWeight: 700, letterSpacing: 1 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} style={{ borderTop: "1px solid #1e3a52" }}>
                <td style={{ padding: "14px 20px", fontSize: 13 }}>{r.type}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{r.dates}</td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "#9ab5cc" }}>{r.reason}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ background: r.status === "Approved" ? "#22c55e22" : "#f59e0b22", color: r.status === "Approved" ? "#22c55e" : "#f59e0b", border: `1px solid ${r.status === "Approved" ? "#22c55e55" : "#f59e0b55"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── IMS BOT PAGE ─────────────────────────────────────────────────────────────

function IMSBotPage() {
  const initTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [messages, setMessages] = useState([{
    role: "bot",
    text: "👋 Hi Arjun! I'm the **IMS Bot**, your AI campus assistant.\n\n⚠️ Quick alerts: Your English Comm attendance is at 71% (below 75%), and OS Concepts internal marks are 56% (below 60%). Let me know if you need help with anything!",
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
    "My seating for CAT 2?",
    "Pending assignments?",
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
      // For demo purposes, simulate bot response
      setTimeout(() => {
        let botReply = "";
        const lq = userText.toLowerCase();
        if (lq.includes("attendance")) {
          botReply = "📊 Your overall attendance is **86%**. However, English Comm is at **71%** (below 75%). You need to attend more classes for that subject!";
        } else if (lq.includes("timetable") || lq.includes("today")) {
          botReply = "📅 **Today's Timetable** (Monday):\n• 09:00-10:00: Data Structures - A101\n• 10:00-11:00: Mathematics III - A102 (Current)\n• 11:15-12:15: Physics Lab - Lab-3\n• 14:00-15:00: OS Concepts - B201";
        } else if (lq.includes("exam") || lq.includes("next exam")) {
          botReply = "📝 Your next exam is **CAT 2 - Data Structures** on April 10, 2026 at 10:00 AM. Your seat is **A3-24** in Block A Hall 3.";
        } else if (lq.includes("seating")) {
          botReply = "🪑 Your seating for CAT 2 Data Structures: **Block A Hall 3, Seat A3-24** at 10:00 AM on April 10, 2026.";
        } else if (lq.includes("assignment") || lq.includes("pending")) {
          botReply = "📝 **Pending Assignments:**\n• DS Assignment 2 - BST Operations (Due Apr 20)\n• Maths Assignment 2 - Fourier Analysis (Due Apr 25)\n• OS Assignment 1 - Scheduling Algorithms (Due Apr 15)\n• English Technical Report (Due Apr 14)";
        } else if (lq.includes("cgpa")) {
          botReply = "🎓 Your current CGPA is **8.4** for Semester 6. Your overall CGPA across all semesters is approximately 8.2.";
        } else {
          botReply = "I can help you with:\n• Attendance tracking\n• Timetable\n• Exam dates and seating\n• Assignment deadlines\n• CGPA and marks\n• And more! What would you like to know?";
        }
        setMessages(prev => [...prev, { role: "bot", text: botReply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        setLoading(false);
      }, 800);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Connection error. Please try again.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setLoading(false);
    }
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
      <div style={{ background: "#162033", borderRadius: "14px 14px 0 0", border: "1px solid #1e3a52", borderBottom: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>IMS Bot</div>
            <div style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> Online · AI Powered
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ background: "#1a9e8f22", color: "#1a9e8f", border: "1px solid #1a9e8f44", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>AI Assistant</span>
          <button onClick={() => setMessages([{ role: "bot", text: "👋 Hi Arjun! I'm the **IMS Bot**. How can I help?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }])}
            style={{ background: "#1a2c42", border: "1px solid #263a52", color: "#e0e8f0", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>Clear</button>
        </div>
      </div>

      <div style={{ background: "#131f30", borderLeft: "1px solid #1e3a52", borderRight: "1px solid #1e3a52", padding: "10px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {quickQuestions.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)} style={{ background: "#1a2c42", border: "1px solid #263a52", color: "#9ab5cc", borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>{q}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: "#0f1a28", borderLeft: "1px solid #1e3a52", borderRight: "1px solid #1e3a52", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end" }}>
            {msg.role === "bot" && <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>}
            <div style={{ maxWidth: "70%" }}>
              <div style={{ background: msg.role === "user" ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#162033", border: msg.role === "bot" ? "1px solid #1e3a52" : "none", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.6, color: "#e0e8f0" }}>
                {formatText(msg.text)}
              </div>
              <div style={{ fontSize: 11, color: "#5a7a95", marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
            </div>
            {msg.role === "user" && <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>AR</div>}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div style={{ background: "#162033", border: "1px solid #1e3a52", borderRadius: "14px 14px 14px 4px", padding: "14px 18px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a9e8f", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: "#162033", border: "1px solid #1e3a52", borderTop: "none", borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask about attendance, exams, LMS, seating..."
          style={{ flex: 1, background: "#0f1a28", border: "1px solid #1e3a52", borderRadius: 10, padding: "12px 16px", color: "#e0e8f0", fontSize: 14, outline: "none" }} />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: 10, border: "none", background: input.trim() && !loading ? "linear-gradient(135deg,#1a9e8f,#17b897)" : "#1a2c42", color: "#fff", fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const [id, setId] = useState("21CSE042");
  const [pass, setPass] = useState("password");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (id === "21CSE042" && pass === "password") {
      onLogin();
    } else {
      setError("Invalid credentials. Use ID: 21CSE042 / Password: password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", color: "#e0e8f0" }}>
      <div style={{ background: "#162033", border: "1px solid #1e3a52", borderRadius: 18, padding: "40px 44px", width: 380, boxShadow: "0 20px 60px #00000066" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px" }}>🎓</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>CollegeIMS</div>
          <div style={{ fontSize: 13, color: "#7a9ab5", marginTop: 4 }}>Smart Campus Portal</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "#7a9ab5", display: "block", marginBottom: 6 }}>STUDENT ID</label>
          <input value={id} onChange={e => setId(e.target.value)} style={{ width: "100%", background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 8, padding: "12px", color: "#e0e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: "#7a9ab5", display: "block", marginBottom: 6 }}>PASSWORD</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: "#1a2c42", border: "1px solid #1e3a52", borderRadius: 8, padding: "12px", color: "#e0e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {error && <div style={{ background: "#ef444422", border: "1px solid #ef444455", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 16 }}>{error}</div>}
        <button onClick={handleLogin} style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Login to Portal</button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#5a7a95" }}>Demo: ID 21CSE042 / password</div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

function StudentDashboard({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [student, setStudent] = useState(defaultStudent);
  const [attendanceSubjects, setAttendanceSubjects] = useState(defaultAttendanceSubjects);
  const [timetableData, setTimetableData] = useState(defaultTimetableData);
  const [subjectAttendance, setSubjectAttendance] = useState(defaultSubjectAttendance);
  const [todaysClasses, setTodaysClasses] = useState(defaultTodaysClasses);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('ims_user') || '{}');
    if (user.userId || user.id) {
       setStudent(prev => ({ 
         ...prev, 
         name: user.username || user.fullName || user.name || "Student", 
         id: user.employeeIdOrRollNumber || user.username, 
         dept: user.department || user.dept 
       }));
      
      const userId = user.userId || user.id;

      // 1. Fetch Attendance
      api.getStudentSummary(userId).then(res => {
        const attData = res.map(s => ({
          name: s.subjectName,
          present: s.present,
          total: s.totalClasses,
          pct: Math.round(s.percentage) || 100
        }));
        if(attData.length > 0) {
          setAttendanceSubjects(attData);
          
          const overallPct = attData.length > 0 ? Math.round(attData.reduce((acc, curr) => acc + curr.pct, 0) / attData.length) : 100;
          setStudent(prev => ({ ...prev, attendance: overallPct }));

          const subjAtt = attData.map(a => ({
            name: a.name.length > 15 ? a.name.substring(0,12) + "..." : a.name,
            pct: a.pct,
            color: a.pct >= 85 ? "#1a9e8f" : a.pct >= 75 ? "#f0a500" : "#ef4444"
          }));
          setSubjectAttendance(subjAtt);
        }
      }).catch(err => console.error("Attendance err", err));

      // 2. Fetch Timetable
      if (user.dept && user.year && user.section) {
        api.getTimetableBySection(user.dept, user.year, user.section).then(res => {
          if (res && res.length > 0) {
            const mappedTt = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] };
            res.forEach(t => {
              const dayShort = t.dayOfWeek.substring(0, 3);
              if (mappedTt[dayShort]) {
                mappedTt[dayShort].push({
                  time: `${t.startTime.substring(0,5)}–${t.endTime.substring(0,5)}`,
                  subject: t.subject.subjectName,
                  teacher: t.faculty.user.name,
                  room: t.roomNumber,
                  now: false
                });
              }
            });
            // sort each day by time
            Object.keys(mappedTt).forEach(k => {
               mappedTt[k].sort((a,b) => a.time.localeCompare(b.time));
            });
            setTimetableData(mappedTt);

            const todayName = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
            if (mappedTt[todayName]) {
               const dayClasses = mappedTt[todayName];
               // check "now" logic
               const currentHour = new Date().getHours();
               const currentMin = new Date().getMinutes();
               const currentMins = currentHour * 60 + currentMin;
               const updated = dayClasses.map(c => {
                  const [start, end] = c.time.split("–");
                  const startMins = parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
                  const endMins = parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);
                  return { ...c, now: (currentMins >= startMins && currentMins <= endMins) };
               });
               setTodaysClasses(updated);
            } else {
               setTodaysClasses([]);
            }
          }
        }).catch(err => console.error("Timetable err", err));
      }

      // 3. Fetch Notifications
      api.getNotifications(userId).then(res => {
         let mappedNotifs = [];
         if (res && res.length > 0) {
           mappedNotifs = res.map(n => ({
             id: n.id,
             type: n.type === "LOW_ATTENDANCE" ? "danger" : n.type === "ANNOUNCEMENT" ? "info" : "warning",
             icon: n.type === "LOW_ATTENDANCE" ? "⚠️" : "🔔",
             title: n.type.replace("_", " "),
             message: n.message,
             time: new Date(n.createdAt || Date.now()).toLocaleDateString(),
             read: n.isRead
           }));
         }
         
         // Generate dynamic attendance warnings based on fetched real state
         api.getStudentSummary(userId).then(attRes => {
            const attSubjs = attRes.map(s => ({
              name: s.subjectName,
              pct: Math.round(s.percentage) || 100,
              present: s.present,
              total: s.totalClasses
            }));
            const localAttNotifs = generateNotifications(attSubjs, marksData, examSeatingData);
            setNotifications([...mappedNotifs, ...localAttNotifs.filter(n => n.id.startsWith("att-"))]);
         }).catch(() => setNotifications(mappedNotifs));
         
      }).catch(err => {
         api.getStudentSummary(userId).then(attRes => {
            const attSubjs = attRes.map(s => ({
              name: s.subjectName,
              pct: Math.round(s.percentage) || 100,
              present: s.present,
              total: s.totalClasses
            }));
            setNotifications(generateNotifications(attSubjs, marksData, examSeatingData));
         }).catch(() => {
            setNotifications(generateNotifications(defaultAttendanceSubjects, marksData, examSeatingData));
         });
      });
    }
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const sections = ["MAIN", "ACADEMICS", "EXAMS", "TOOLS"];
  const unread = notifications.filter(n => !n.read).length;

  return (
    <StudentContext.Provider value={{ student, attendanceSubjects, timetableData, todaysClasses, subjectAttendance, notifications, setNotifications }}>
    <div style={s.shell}>
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 228 : 64 }}>
        <div style={s.sidebarLogo}>
          <div style={s.logoBox}><span style={s.logoText}>IMS</span></div>
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
                {item.id === "seating" && sidebarOpen && <span style={{ ...s.aiBadge, background: "#22c55e" }}>1</span>}
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
              <input placeholder="Search..." style={s.searchInput} />
            </div>
            <NotificationBell />
            <div style={s.avatarBox}>
              <div style={s.avatar}>{student.name.substring(0,2).toUpperCase()}</div>
              <div><div style={s.avatarName}>{student.name}</div><div style={s.avatarRole}>Student — {student.dept}</div></div>
            </div>
          </div>
        </header>

        <div style={s.content}>
          {(active === "dashboard") && unread > 0 && (
            <div style={{ background: "linear-gradient(135deg,#ef444415,#f59e0b10)", border: "1px solid #ef444444", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>🔔</span>
                <div style={{ fontSize: 13, color: "#e0e8f0" }}>You have <strong style={{ color: "#ef4444" }}>{unread} unread alerts</strong> — including low attendance and marks warnings. Click the bell to view.</div>
              </div>
            </div>
          )}

          {active === "dashboard" && (
            <>
              <div style={s.greetRow}>
                <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📅 {today}</div>
                <h1 style={s.greetText}>{greeting}, {student.name.split(" ")[0]}! 👋</h1>
                <p style={s.greetSub}>Here's your academic snapshot for today.</p>
              </div>
              <div style={s.statGrid}>
                {[
                  { icon: "🎯", value: student.cgpa, label: "CGPA", sub: "↑ +0.2 this sem", color: "#1a9e8f" },
                  { icon: "✅", value: `${student.attendance}%`, label: "AVG ATTEND.", sub: "↑ Above 75% threshold", color: "#22c55e" },
                  { icon: "📚", value: student.subjects, label: "SUBJECTS", sub: "↑ Current semester", color: "#3b82f6" },
                  { icon: "📝", value: student.assignments, label: "ASSIGNMENTS DUE", sub: "↑ This week", color: "#f59e0b" },
                ].map((c, i) => (
                  <div key={i} style={s.statCard}>
                    <div style={{ ...s.statIcon, background: c.color + "22" }}>{c.icon}</div>
                    <div style={{ ...s.statValue, color: c.color }}>{c.value}</div>
                    <div style={s.statLabel}>{c.label}</div>
                    <div style={s.statSub}>{c.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {attendanceSubjects.filter(s => s.pct < 75).map(s => (
                  <div key={s.name} style={{ background: "#ef444415", border: "1px solid #ef444455", borderRadius: 10, padding: "12px 18px", display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                      <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>Low Attendance: {s.name}</div>
                      <div style={{ color: "#ef9999", fontSize: 12 }}>Only {s.pct}% — below 75% requirement</div>
                    </div>
                  </div>
                ))}
                {marksData.filter(m => m.pct < 60).map(m => (
                  <div key={m.subject} style={{ background: "#f59e0b15", border: "1px solid #f59e0b55", borderRadius: 10, padding: "12px 18px", display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>📉</span>
                    <div>
                      <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13 }}>Low Marks: {m.subject}</div>
                      <div style={{ color: "#f59e0baa", fontSize: 12 }}>{m.pct}% internal — below 60%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.bottomGrid}>
                <div style={s.panel}>
                  <div style={s.panelHeader}>
                    <div><div style={s.panelTitle}>Subject Attendance</div><div style={s.panelSub}>All enrolled subjects</div></div>
                    <span style={s.allGoodBadge}>Overview</span>
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
                    <span style={{ ...s.dot, background: "#1a9e8f" }} /> ≥85%
                    <span style={{ ...s.dot, background: "#f0a500", marginLeft: 12 }} /> 75–84%
                    <span style={{ ...s.dot, background: "#ef4444", marginLeft: 12 }} /> &lt;75%
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginTop: 24 }}>
                {[
                  { icon: "📖", label: "LMS & Notes", sub: "Study materials", id: "lms", color: "#1a9e8f" },
                  { icon: "🪑", label: "Exam Seating", sub: "1 seating ready", id: "seating", color: "#22c55e" },
                  { icon: "📝", label: "Submit Assignment", sub: "3 pending", id: "lms", color: "#f59e0b" },
                  { icon: "🤖", label: "Ask IMS Bot", sub: "AI assistant", id: "imsbot", color: "#3b82f6" },
                ].map((q, i) => (
                  <button key={i} onClick={() => setActive(q.id)} style={{ background: "#162033", border: "1px solid #1e3a52", borderRadius: 12, padding: 18, cursor: "pointer", textAlign: "left", borderTop: `3px solid ${q.color}` }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>{q.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e0e8f0" }}>{q.label}</div>
                    <div style={{ fontSize: 11, color: q.color, marginTop: 3 }}>{q.sub}</div>
                  </button>
                ))}
              </div>
            </>
          )}
          {active === "attendance" && <AttendancePage />}
          {active === "timetable" && <TimetablePage />}
          {active === "marks" && <MarksPage />}
          {active === "lms" && <LMSPage />}
          {active === "calendar" && <CalendarPage />}
          {active === "feedback" && <FeedbackPage />}
          {active === "fees" && <FeePaymentPage />}
          {active === "seating" && <ExamSeatingPage />}
          {active === "certificates" && <CertificatesPage />}
          {active === "requests" && <LeaveAndODPage />}
          {active === "imsbot" && <IMSBotPage />}
        </div>
      </div>
    </div>
    </StudentContext.Provider>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const s = {
  shell: { display: "flex", minHeight: "100vh", width: "100vw", background: "#0d1b2a", fontFamily: "'Segoe UI', sans-serif", color: "#e0e8f0", overflow: "hidden" },
  sidebar: { background: "#101e2e", borderRight: "1px solid #1e3a52", display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s", overflow: "hidden", minHeight: "100vh", position: "relative", flexShrink: 0 },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, padding: "0 16px 24px" },
  logoBox: { minWidth: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 12 },
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
  searchInput: { background: "none", border: "none", outline: "none", color: "#e0e8f0", fontSize: 13, width: 180 },
  avatarBox: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 },
  avatarName: { fontSize: 13, fontWeight: 600 },
  avatarRole: { fontSize: 11, color: "#7a9ab5" },
  content: { padding: 32, flex: 1, overflowY: "auto" },
  greetRow: { marginBottom: 24 },
  greetText: { fontSize: 30, fontWeight: 700, margin: "0 0 6px" },
  greetSub: { fontSize: 14, color: "#7a9ab5", margin: 0 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 24 },
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
export default StudentDashboard;

// ─── APP ──────────────────────────────────────────────────────────────────────
