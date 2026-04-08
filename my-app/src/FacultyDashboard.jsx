import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeToggle } from "./App";
import AttendancePage from "./AttendancePage";

const faculty = {
  name: "Dr. Priya Suresh", id: "FAC-007", dept: "Mathematics",
  students: 187, subjects: 3, avgAttend: 83, atRisk: 12,
};

const navItems = [
  { id: "dashboard",     label: "Dashboard",         icon: "🏠", section: "MAIN" },
  { id: "attendance",    label: "Attendance",         icon: "📋", section: "MAIN", badge: "Live" },
  { id: "records",       label: "Attendance Records", icon: "📊", section: "MAIN" },
  { id: "marks",         label: "Internal Marks",     icon: "📝", section: "TEACHING" },
  { id: "timetable",     label: "Timetable",          icon: "📅", section: "TEACHING" },
  { id: "courseplanner", label: "Course Planner",     icon: "📖", section: "TEACHING" },
  { id: "lms",           label: "LMS Uploader",       icon: "📚", section: "TEACHING" },
  { id: "certificates",  label: "Certificates",       icon: "🎓", section: "STUDENTS" },
  { id: "leaveRequests", label: "Leave/OD Requests",  icon: "📝", section: "STUDENTS" },
  { id: "announcements", label: "Announcements",      icon: "📢", section: "TOOLS" },
  { id: "imsbot",        label: "IMS Bot",            icon: "🤖", section: "TOOLS" },
];

const todaysClasses = [
  { order: "1st", subject: "Data Structures", time: "09:00–10:00", section: "CSE-B", room: "A101", status: "ONGOING" },
  { order: "2nd", subject: "DS Lab",          time: "10:00–11:00", section: "CSE-A", room: "Lab-1", status: "COUNT", count: "28/30" },
  { order: "3rd", subject: "Algorithms",      time: "11:15–12:15", section: "CSE-C", room: "A103", status: "UPCOMING" },
  { order: "4th", subject: "Data Structures", time: "14:00–15:00", section: "CSE-A", room: "B201", status: "UPCOMING" },
];

const attendanceStats = [
  { subject: "Data Structures", sections: "Sections: CSE A,B,C", pct: 86, color: "#1a9e8f" },
  { subject: "DS Lab",          sections: "Sections: CSE A,B",   pct: 91, color: "#1a9e8f" },
  { subject: "Algorithms",      sections: "Sections: CSE C",     pct: 79, color: "#f0a500" },
];

const studentOverview = [
  { name: "Arjun Ravi", id: "21CSE001", attend: 88, cgpa: 8.4, status: "OK",   section: "CSE-A" },
  { name: "Priya Nair", id: "21CSE002", attend: 72, cgpa: 7.9, status: "WARN", section: "CSE-B" },
  { name: "Kiran Raj",  id: "21CSE003", attend: 91, cgpa: 9.1, status: "OK",   section: "CSE-A" },
  { name: "Anjali M.",  id: "21CSE004", attend: 63, cgpa: 6.8, status: "RISK", section: "CSE-C" },
  { name: "Ravi Kumar", id: "21CSE005", attend: 85, cgpa: 8.0, status: "OK",   section: "CSE-B" },
];

const announcements = [
  { id: 1, tag: "URGENT", tagColor: "#ef4444", tagBg: "#ef444422", border: "#ef4444", title: "Mid-Semester Examinations", body: "Mid-semester exams from April 15–22. Check hall ticket on portal.", date: "Apr 8", author: "Exam Cell", pinned: true },
  { id: 2, tag: "EVENT", tagColor: "#3b82f6", tagBg: "#3b82f622", border: "#3b82f6", title: "Annual Cultural Fest 'Raga 24'", body: "Register for cultural events before April 20th. All students are encouraged to participate.", date: "Apr 7", author: "Cultural Committee", pinned: false },
  { id: 3, tag: "ACADEMIC", tagColor: "#1a9e8f", tagBg: "#1a9e8f22", border: "#1a9e8f", title: "Assignment Submission Reminder", body: "Database Systems project due April 18 at 11:59 PM. Submit via LMS portal.", date: "Apr 6", author: "Dr. Priya Suresh", pinned: false },
];

const subjects    = ["Data Structures", "DS Lab", "Algorithms", "Mathematics III"];
const allSections = ["CSE-A", "CSE-B", "CSE-C"];

// ── Timetable Data ────────────────────────────────────────────────────────────
const timetableData = {
  Mon: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "10:00–11:00", subject: "DS Lab",          teacher: "Dr. Priya S.", room: "Lab-1" },
    { time: "11:15–12:15", subject: "Algorithms",      teacher: "Prof. James",  room: "A103" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
  Tue: [
    { time: "09:00–10:00", subject: "Database Systems",teacher: "Prof. Ahmed",  room: "A103" },
    { time: "11:00–12:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
  Wed: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "10:00–11:00", subject: "Algorithms",      teacher: "Prof. James",  room: "B201" },
    { time: "13:00–14:00", subject: "DS Lab",          teacher: "Dr. Priya S.", room: "Lab-1" },
  ],
  Thu: [
    { time: "10:00–11:00", subject: "Database Systems",teacher: "Prof. Ahmed",  room: "A103" },
    { time: "11:15–12:15", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
    { time: "14:00–15:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
  ],
  Fri: [
    { time: "09:00–10:00", subject: "Data Structures", teacher: "Dr. Ravi K.",  room: "A101" },
    { time: "10:00–11:00", subject: "Database Systems",teacher: "Prof. Ahmed",  room: "A103" },
    { time: "14:00–15:00", subject: "Mathematics III", teacher: "Dr. Priya S.", room: "A102" },
  ],
};

// ── Course Planner Data ───────────────────────────────────────────────────────
const coursePlannerData = {
  "Data Structures": {
    "CSE-A": [
      { week: 1, topic: "Introduction to DS", resources: ["PPT", "Video"], status: "completed" },
      { week: 2, topic: "Arrays & Linked Lists", resources: ["Assignment"], status: "completed" },
      { week: 3, topic: "Stacks & Queues", resources: ["Quiz"], status: "ongoing" },
      { week: 4, topic: "Trees", resources: ["Lab Exercise"], status: "upcoming" },
    ],
    "CSE-B": [
      { week: 1, topic: "Introduction to DS", resources: ["PPT", "Video"], status: "completed" },
      { week: 2, topic: "Arrays & Linked Lists", resources: ["Assignment"], status: "ongoing" },
      { week: 3, topic: "Stacks & Queues", resources: ["Quiz"], status: "upcoming" },
      { week: 4, topic: "Trees", resources: ["Lab Exercise"], status: "upcoming" },
    ],
    "CSE-C": [
      { week: 1, topic: "Introduction to DS", resources: ["PPT"], status: "ongoing" },
      { week: 2, topic: "Arrays & Linked Lists", resources: ["Assignment"], status: "upcoming" },
      { week: 3, topic: "Stacks & Queues", resources: ["Quiz"], status: "upcoming" },
      { week: 4, topic: "Trees", resources: ["Lab Exercise"], status: "upcoming" },
    ],
  },
  "Algorithms": {
    "CSE-C": [
      { week: 1, topic: "Algorithm Analysis", resources: ["PPT"], status: "completed" },
      { week: 2, topic: "Sorting Algorithms", resources: ["Assignment"], status: "ongoing" },
      { week: 3, topic: "Searching Algorithms", resources: ["Quiz"], status: "upcoming" },
      { week: 4, topic: "Dynamic Programming", resources: ["Lab Exercise"], status: "upcoming" },
    ],
  },
};

// ── LMS Content Data ──────────────────────────────────────────────────────────
const lmsContentData = {
  "Data Structures": {
    "CSE-A": [
      { id: 1, title: "Lecture 1: Introduction", type: "video", url: "#", uploaded: "2024-04-01", size: "45MB" },
      { id: 2, title: "Assignment 1: Linked Lists", type: "assignment", url: "#", uploaded: "2024-04-03", size: "2MB" },
      { id: 3, title: "Quiz 1: Stacks & Queues", type: "quiz", url: "#", uploaded: "2024-04-05", size: "1MB" },
    ],
    "CSE-B": [
      { id: 1, title: "Lecture 1: Introduction", type: "video", url: "#", uploaded: "2024-04-01", size: "45MB" },
      { id: 2, title: "Lab Exercise 1", type: "lab", url: "#", uploaded: "2024-04-02", size: "3MB" },
    ],
  },
};

// ── Student Certificates Data ─────────────────────────────────────────────────
const studentCertificates = [
  { id: 1, studentId: "21CSE001", studentName: "Arjun Ravi", title: "Python Programming", issuer: "Coursera", date: "2024-03-15", status: "pending", type: "Course", fileUrl: "#" },
  { id: 2, studentId: "21CSE001", studentName: "Arjun Ravi", title: "Hackathon Winner", issuer: "College", date: "2024-02-10", status: "pending", type: "Achievement", fileUrl: "#" },
  { id: 3, studentId: "21CSE003", studentName: "Kiran Raj", title: "Machine Learning", issuer: "Google", date: "2024-03-20", status: "pending", type: "Course", fileUrl: "#" },
  { id: 4, studentId: "21CSE005", studentName: "Ravi Kumar", title: "Web Development", issuer: "Udemy", date: "2024-03-10", status: "verified", type: "Course", fileUrl: "#" },
];

// ── Leave/OD Requests Data ────────────────────────────────────────────────────
const leaveRequestsData = [
  { id: 1, studentId: "21CSE001", studentName: "Arjun Ravi", type: "OD", fromDate: "2024-04-10", toDate: "2024-04-12", reason: "Hackathon participation", status: "pending", section: "CSE-A" },
  { id: 2, studentId: "21CSE002", studentName: "Priya Nair", type: "Leave", fromDate: "2024-04-15", toDate: "2024-04-17", reason: "Medical emergency", status: "pending", section: "CSE-B" },
  { id: 3, studentId: "21CSE004", studentName: "Anjali M.", type: "OD", fromDate: "2024-04-08", toDate: "2024-04-08", reason: "Sports meet", status: "approved", section: "CSE-C" },
  { id: 4, studentId: "21CSE006", studentName: "Meena S.", type: "Leave", fromDate: "2024-04-20", toDate: "2024-04-22", reason: "Family function", status: "pending", section: "CSE-A" },
];

// ── Student Marks + CGPA Data ─────────────────────────────────────────────────
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

const marksData = {
  "21CSE001": { cat1: 43, cat2: 45, assignment: 18, lab: 24, total: 130, cgpa: 8.4 },
  "21CSE003": { cat1: 47, cat2: 48, assignment: 19, lab: 25, total: 139, cgpa: 9.1 },
  "21CSE006": { cat1: 38, cat2: 40, assignment: 15, lab: 22, total: 115, cgpa: 7.6 },
  "21CSE007": { cat1: 44, cat2: 46, assignment: 17, lab: 23, total: 130, cgpa: 8.2 },
  "21CSE008": { cat1: 36, cat2: 38, assignment: 14, lab: 20, total: 108, cgpa: 7.2 },
  "21CSE002": { cat1: 30, cat2: 32, assignment: 12, lab: 18, total: 92,  cgpa: 6.1 },
  "21CSE005": { cat1: 42, cat2: 44, assignment: 16, lab: 22, total: 124, cgpa: 8.0 },
  "21CSE009": { cat1: 28, cat2: 30, assignment: 11, lab: 17, total: 86,  cgpa: 5.7 },
  "21CSE010": { cat1: 48, cat2: 49, assignment: 20, lab: 25, total: 142, cgpa: 9.4 },
  "21CSE011": { cat1: 35, cat2: 37, assignment: 14, lab: 20, total: 106, cgpa: 7.0 },
  "21CSE004": { cat1: 25, cat2: 27, assignment: 10, lab: 15, total: 77,  cgpa: 5.1 },
  "21CSE012": { cat1: 41, cat2: 43, assignment: 17, lab: 23, total: 124, cgpa: 8.2 },
  "21CSE013": { cat1: 33, cat2: 35, assignment: 13, lab: 19, total: 100, cgpa: 6.7 },
  "21CSE014": { cat1: 46, cat2: 47, assignment: 19, lab: 24, total: 136, cgpa: 9.0 },
  "21CSE015": { cat1: 22, cat2: 24, assignment: 9,  lab: 14, total: 69,  cgpa: 4.6 },
};

const mockHistory = {
  "21CSE001": { "Data Structures": { present: 18, total: 21 }, "DS Lab": { present: 10, total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE003": { "Data Structures": { present: 20, total: 21 }, "DS Lab": { present: 11, total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE006": { "Data Structures": { present: 15, total: 21 }, "DS Lab": { present: 8,  total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE007": { "Data Structures": { present: 19, total: 21 }, "DS Lab": { present: 9,  total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE008": { "Data Structures": { present: 16, total: 21 }, "DS Lab": { present: 10, total: 11 }, "Algorithms": { present: 0, total: 0 } },
  "21CSE002": { "Data Structures": { present: 14, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE005": { "Data Structures": { present: 18, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE009": { "Data Structures": { present: 12, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE010": { "Data Structures": { present: 20, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE011": { "Data Structures": { present: 17, total: 21 }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 0, total: 0 } },
  "21CSE004": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 13, total: 21 } },
  "21CSE012": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 18, total: 21 } },
  "21CSE013": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 15, total: 21 } },
  "21CSE014": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 20, total: 21 } },
  "21CSE015": { "Data Structures": { present: 0,  total: 0  }, "DS Lab": { present: 0,  total: 0  }, "Algorithms": { present: 10, total: 21 } },
};

const thStyle = (t) => ({ padding: "11px 18px", textAlign: "left", fontSize: 11, color: t.subtext, fontWeight: 700, letterSpacing: 1 });
const tdStyle = (t) => ({ padding: "13px 18px", fontSize: 13, color: t.text });

// ── TIMETABLE PAGE ────────────────────────────────────────────────────────────
function TimetablePage({ t }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
  const [selectedDay, setSelectedDay] = useState(days.includes(todayName) ? todayName : "Mon");
  const classes = timetableData[selectedDay] || [];

  const subjectColor = (sub) => {
    if (sub.includes("Data")) return "#1a9e8f";
    if (sub.includes("Math")) return "#3b82f6";
    if (sub.includes("Algorithm")) return "#a855f7";
    if (sub.includes("Database")) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📅 Weekly Schedule</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Timetable</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Your weekly class schedule.</p>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 28 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {days.map(day => (
            <button key={day} onClick={() => setSelectedDay(day)} style={{
              padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
              background: selectedDay === day ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
              color: selectedDay === day ? "#fff" : t.subtext,
              border: `1px solid ${selectedDay === day ? "transparent" : t.border}`,
            }}>{day}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {classes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: t.subtext }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>No classes today!</div>
            </div>
          ) : classes.map((cls, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 12, background: t.rowBg, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 13, color: t.subtext, minWidth: 110, fontWeight: 500 }}>{cls.time}</div>
              <div style={{ width: 4, height: 40, background: subjectColor(cls.subject), borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{cls.subject}</div>
                <div style={{ fontSize: 12, color: t.subtext, marginTop: 3 }}>{cls.teacher}</div>
              </div>
              <div style={{ background: subjectColor(cls.subject) + "22", color: subjectColor(cls.subject), border: `1px solid ${subjectColor(cls.subject)}55`, borderRadius: 8, padding: "5px 14px", fontSize: 13, fontWeight: 700 }}>
                {cls.room}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>Weekly Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
            {days.map(day => (
              <div key={day} onClick={() => setSelectedDay(day)} style={{ background: selectedDay === day ? "#1a9e8f22" : t.input, border: `1px solid ${selectedDay === day ? "#1a9e8f" : t.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: selectedDay === day ? "#1a9e8f" : t.subtext, marginBottom: 4 }}>{day}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: selectedDay === day ? "#1a9e8f" : t.text }}>{timetableData[day]?.length || 0}</div>
                <div style={{ fontSize: 10, color: t.subtext }}>classes</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COURSE PLANNER PAGE ───────────────────────────────────────────────────────
function CoursePlannerPage({ t }) {
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");
  const [selectedSection, setSelectedSection] = useState("CSE-A");
  
  const planner = coursePlannerData[selectedSubject]?.[selectedSection] || [];

  const statusColors = {
    completed: { bg: "#22c55e22", color: "#22c55e", label: "Completed" },
    ongoing: { bg: "#f59e0b22", color: "#f59e0b", label: "Ongoing" },
    upcoming: { bg: "#3b82f622", color: "#3b82f6", label: "Upcoming" },
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📖 Academic Planning</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Course Planner</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Weekly course plan with topics and resources.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none" }}>
          {Object.keys(coursePlannerData).map(sub => <option key={sub}>{sub}</option>)}
        </select>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none" }}>
          {allSections.map(sec => <option key={sec}>{sec}</option>)}
        </select>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{selectedSubject} - {selectedSection}</div>
          <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Weekly breakdown of topics and resources</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.tableHead }}>
                <th style={thStyle(t)}>WEEK</th>
                <th style={thStyle(t)}>TOPIC</th>
                <th style={thStyle(t)}>RESOURCES</th>
                <th style={thStyle(t)}>STATUS</th>
               </tr>
            </thead>
            <tbody>
              {planner.map((item, i) => {
                const st = statusColors[item.status];
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                    <td style={{ ...tdStyle(t), fontWeight: 700 }}>Week {item.week}</td>
                    <td style={tdStyle(t)}>{item.topic}</td>
                    <td style={tdStyle(t)}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {item.resources.map((res, idx) => (
                          <span key={idx} style={{ background: t.input, padding: "2px 8px", borderRadius: 4, fontSize: 11, color: t.subtext }}>{res}</span>
                        ))}
                      </div>
                    </td>
                    <td style={tdStyle(t)}>
                      <span style={{ background: st.bg, color: st.color, padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── LMS UPLOADER PAGE ─────────────────────────────────────────────────────────
function LMSPage({ t }) {
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");
  const [selectedSection, setSelectedSection] = useState("CSE-A");
  const [showUpload, setShowUpload] = useState(false);
  const [newContent, setNewContent] = useState({ title: "", type: "video", file: null });

  const content = lmsContentData[selectedSubject]?.[selectedSection] || [];

  const handleUpload = () => {
    alert(`Content "${newContent.title}" uploaded successfully!`);
    setShowUpload(false);
    setNewContent({ title: "", type: "video", file: null });
  };

  const downloadAttendance = () => {
    const csv = "Student ID,Name,Attendance %\n" + studentOverview.map(s => `${s.id},${s.name},${s.attend}%`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${selectedSection}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadStudentRecords = () => {
    const records = rosterData[selectedSection].map(s => {
      const marks = marksData[s.id] || {};
      return `${s.id},${s.name},${marks.cat1 || 0},${marks.cat2 || 0},${marks.assignment || 0},${marks.lab || 0},${marks.total || 0},${marks.cgpa || 0}`;
    });
    const csv = "Student ID,Name,CAT1,CAT2,Assignment,Lab,Total,CGPA\n" + records.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_records_${selectedSection}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type) => {
    const icons = { video: "🎥", assignment: "📝", quiz: "📊", lab: "🔬" };
    return icons[type] || "📄";
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📚 Learning Management</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>LMS Uploader</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Upload course materials and manage content.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>📥 Download Reports</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={downloadAttendance} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>📊 Download Attendance</button>
            <button onClick={downloadStudentRecords} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>📋 Download Student Records</button>
          </div>
        </div>

        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>📤 Upload Content</div>
          <button onClick={() => setShowUpload(!showUpload)} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>+ New Upload</button>
        </div>
      </div>

      {showUpload && (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>Upload New Content</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="text" placeholder="Content Title" value={newContent.title} onChange={e => setNewContent({ ...newContent, title: e.target.value })} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }} />
            <select value={newContent.type} onChange={e => setNewContent({ ...newContent, type: e.target.value })} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}>
              <option value="video">Video</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="lab">Lab Exercise</option>
            </select>
            <input type="file" onChange={e => setNewContent({ ...newContent, file: e.target.files[0] })} style={{ padding: "8px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleUpload} style={{ padding: "10px 20px", borderRadius: 8, background: "#1a9e8f", color: "#fff", border: "none", cursor: "pointer" }}>Upload</button>
              <button onClick={() => setShowUpload(false)} style={{ padding: "10px 20px", borderRadius: 8, background: t.input, color: t.text, border: `1px solid ${t.border}`, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14 }}>
          {Object.keys(lmsContentData).map(sub => <option key={sub}>{sub}</option>)}
        </select>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14 }}>
          {allSections.map(sec => <option key={sec}>{sec}</option>)}
        </select>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Course Content - {selectedSubject} ({selectedSection})</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {content.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderTop: i > 0 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ fontSize: 28 }}>{getTypeIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{item.title}</div>
                <div style={{ fontSize: 11, color: t.subtext }}>Uploaded: {item.uploaded} • {item.size}</div>
              </div>
              <button style={{ padding: "6px 16px", borderRadius: 6, background: t.input, border: `1px solid ${t.border}`, color: t.text, cursor: "pointer" }}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CERTIFICATES PAGE ─────────────────────────────────────────────────────────
function CertificatesPage({ t }) {
  const [certificates, setCertificates] = useState(studentCertificates);
  const [filter, setFilter] = useState("all");

  const handleVerify = (id) => {
    setCertificates(certs => certs.map(c => c.id === id ? { ...c, status: "verified" } : c));
    alert("Certificate verified successfully!");
  };

  const handleReject = (id) => {
    setCertificates(certs => certs.filter(c => c.id !== id));
    alert("Certificate rejected and removed.");
  };

  const filteredCerts = certificates.filter(c => filter === "all" || c.status === filter);

  const stats = {
    total: certificates.length,
    pending: certificates.filter(c => c.status === "pending").length,
    verified: certificates.filter(c => c.status === "verified").length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🎓 Student Achievements</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Certificate Verification</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Review and verify student certificates.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "linear-gradient(135deg,#0d3d2e,#0d1b2a)", borderRadius: 12, padding: 20, textAlign: "center", border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1a9e8f" }}>{stats.total}</div>
          <div style={{ fontSize: 12, color: t.subtext }}>Total Certificates</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#3d2a00,#0d1b2a)", borderRadius: 12, padding: 20, textAlign: "center", border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#f59e0b" }}>{stats.pending}</div>
          <div style={{ fontSize: 12, color: t.subtext }}>Pending Verification</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#0d3d1e,#0d1b2a)", borderRadius: 12, padding: 20, textAlign: "center", border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#22c55e" }}>{stats.verified}</div>
          <div style={{ fontSize: 12, color: t.subtext }}>Verified</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["all", "pending", "verified"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: 8, background: filter === f ? "#1a9e8f" : t.input, color: filter === f ? "#fff" : t.text, border: "none", cursor: "pointer", fontWeight: 600 }}>{f.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.tableHead }}>
                <th style={thStyle(t)}>STUDENT</th>
                <th style={thStyle(t)}>CERTIFICATE TITLE</th>
                <th style={thStyle(t)}>ISSUER</th>
                <th style={thStyle(t)}>DATE</th>
                <th style={thStyle(t)}>TYPE</th>
                <th style={thStyle(t)}>STATUS</th>
                <th style={thStyle(t)}>ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {filteredCerts.map((cert, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={tdStyle(t)}>
                    <div>
                      <div style={{ fontWeight: 600, color: t.text }}>{cert.studentName}</div>
                      <div style={{ fontSize: 11, color: t.subtext }}>{cert.studentId}</div>
                    </div>
                   </td>
                  <td style={tdStyle(t)}>{cert.title}</td>
                  <td style={tdStyle(t)}>{cert.issuer}</td>
                  <td style={tdStyle(t)}>{cert.date}</td>
                  <td style={tdStyle(t)}><span style={{ background: t.input, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{cert.type}</span></td>
                  <td style={tdStyle(t)}>
                    <span style={{ background: cert.status === "verified" ? "#22c55e22" : "#f59e0b22", color: cert.status === "verified" ? "#22c55e" : "#f59e0b", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{cert.status.toUpperCase()}</span>
                  </td>
                  <td style={tdStyle(t)}>
                    {cert.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleVerify(cert.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>Verify</button>
                        <button onClick={() => handleReject(cert.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>Reject</button>
                      </div>
                    )}
                    {cert.status === "verified" && <span style={{ color: "#22c55e" }}>✓ Verified</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── LEAVE/OD REQUESTS PAGE ────────────────────────────────────────────────────
function LeaveRequestsPage({ t }) {
  const [requests, setRequests] = useState(leaveRequestsData);
  const [filter, setFilter] = useState("all");

  const handleApprove = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: "approved" } : r));
    alert("Request approved!");
  };

  const handleReject = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    alert("Request rejected!");
  };

  const filteredRequests = requests.filter(r => filter === "all" || r.status === filter);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📋 Student Requests</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Leave & OD Requests</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Review and approve student leave and OD applications.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "linear-gradient(135deg,#0d3d2e,#0d1b2a)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1a9e8f" }}>{stats.total}</div>
          <div style={{ fontSize: 11, color: t.subtext }}>Total Requests</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#3d2a00,#0d1b2a)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>{stats.pending}</div>
          <div style={{ fontSize: 11, color: t.subtext }}>Pending</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#0d3d1e,#0d1b2a)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#22c55e" }}>{stats.approved}</div>
          <div style={{ fontSize: 11, color: t.subtext }}>Approved</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#3d0d0d,#0d1b2a)", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#ef4444" }}>{stats.rejected}</div>
          <div style={{ fontSize: 11, color: t.subtext }}>Rejected</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 20px", borderRadius: 8, background: filter === f ? "#1a9e8f" : t.input, color: filter === f ? "#fff" : t.text, border: "none", cursor: "pointer", fontWeight: 600 }}>{f.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.tableHead }}>
                <th style={thStyle(t)}>STUDENT</th>
                <th style={thStyle(t)}>TYPE</th>
                <th style={thStyle(t)}>FROM</th>
                <th style={thStyle(t)}>TO</th>
                <th style={thStyle(t)}>REASON</th>
                <th style={thStyle(t)}>SECTION</th>
                <th style={thStyle(t)}>STATUS</th>
                <th style={thStyle(t)}>ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={tdStyle(t)}>
                    <div>
                      <div style={{ fontWeight: 600, color: t.text }}>{req.studentName}</div>
                      <div style={{ fontSize: 11, color: t.subtext }}>{req.studentId}</div>
                    </div>
                   </td>
                  <td style={tdStyle(t)}><span style={{ background: req.type === "OD" ? "#3b82f622" : "#f59e0b22", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{req.type}</span></td>
                  <td style={tdStyle(t)}>{req.fromDate}</td>
                  <td style={tdStyle(t)}>{req.toDate}</td>
                  <td style={tdStyle(t)}>{req.reason}</td>
                  <td style={tdStyle(t)}>{req.section}</td>
                  <td style={tdStyle(t)}>
                    <span style={{ background: req.status === "approved" ? "#22c55e22" : req.status === "rejected" ? "#ef444422" : "#f59e0b22", color: req.status === "approved" ? "#22c55e" : req.status === "rejected" ? "#ef4444" : "#f59e0b", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{req.status.toUpperCase()}</span>
                  </td>
                  <td style={tdStyle(t)}>
                    {req.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleApprove(req.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>Approve</button>
                        <button onClick={() => handleReject(req.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11 }}>Reject</button>
                      </div>
                    )}
                    {req.status !== "pending" && <span style={{ color: req.status === "approved" ? "#22c55e" : "#ef4444" }}>{req.status === "approved" ? "✓ Approved" : "✗ Rejected"}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── ENHANCED ANNOUNCEMENTS PAGE ───────────────────────────────────────────────
function AnnouncementsPage({ t }) {
  const [announcementsList, setAnnouncementsList] = useState(announcements);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ tag: "ACADEMIC", title: "", body: "", author: faculty.name });

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.body) return;
    const newId = Math.max(...announcementsList.map(a => a.id)) + 1;
    const announcement = {
      id: newId,
      tag: newAnnouncement.tag,
      tagColor: { ACADEMIC: "#1a9e8f", URGENT: "#ef4444", EVENT: "#3b82f6" }[newAnnouncement.tag] || "#1a9e8f",
      tagBg: { ACADEMIC: "#1a9e8f22", URGENT: "#ef444422", EVENT: "#3b82f622" }[newAnnouncement.tag] || "#1a9e8f22",
      border: { ACADEMIC: "#1a9e8f", URGENT: "#ef4444", EVENT: "#3b82f6" }[newAnnouncement.tag] || "#1a9e8f",
      title: newAnnouncement.title,
      body: newAnnouncement.body,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      author: newAnnouncement.author,
      pinned: false,
    };
    setAnnouncementsList([announcement, ...announcementsList]);
    setShowNewForm(false);
    setNewAnnouncement({ tag: "ACADEMIC", title: "", body: "", author: faculty.name });
    alert("Announcement posted successfully!");
  };

  const handleDelete = (id) => {
    setAnnouncementsList(announcementsList.filter(a => a.id !== id));
  };

  const handlePin = (id) => {
    setAnnouncementsList(announcementsList.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  };

  const sortedAnnouncements = [...announcementsList].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📢 Faculty Communications</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Announcements</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Post and manage announcements for students.</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setShowNewForm(!showNewForm)} style={{ padding: "12px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>
          + New Announcement
        </button>
      </div>

      {showNewForm && (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 16 }}>Create Announcement</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <select value={newAnnouncement.tag} onChange={e => setNewAnnouncement({ ...newAnnouncement, tag: e.target.value })} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}>
              <option value="ACADEMIC">📚 Academic</option>
              <option value="URGENT">⚠️ Urgent</option>
              <option value="EVENT">🎉 Event</option>
            </select>
            <input type="text" placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }} />
            <textarea placeholder="Body content" rows="4" value={newAnnouncement.body} onChange={e => setNewAnnouncement({ ...newAnnouncement, body: e.target.value })} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleAddAnnouncement} style={{ padding: "10px 20px", borderRadius: 8, background: "#1a9e8f", color: "#fff", border: "none", cursor: "pointer" }}>Post</button>
              <button onClick={() => setShowNewForm(false)} style={{ padding: "10px 20px", borderRadius: 8, background: t.input, color: t.text, border: `1px solid ${t.border}`, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        {sortedAnnouncements.map((a, i) => (
          <div key={a.id} style={{ padding: "20px 24px", borderTop: i > 0 ? `1px solid ${t.border}` : "none", borderLeft: `3px solid ${a.border}`, position: "relative" }}>
            {a.pinned && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 12, color: "#f59e0b" }}>📌 Pinned</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ background: a.tagBg, color: a.tagColor, border: `1px solid ${a.tagColor}55`, borderRadius: 6, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{a.tag}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{a.title}</span>
            </div>
            <div style={{ fontSize: 13, color: t.subtext, lineHeight: 1.5, marginBottom: 10 }}>{a.body}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 11, color: t.sectionLabel }}>Posted by {a.author} • {a.date}</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => handlePin(a.id)} style={{ padding: "4px 12px", borderRadius: 6, background: t.input, border: `1px solid ${t.border}`, color: t.text, cursor: "pointer", fontSize: 11 }}>{a.pinned ? "Unpin" : "Pin"}</button>
                <button onClick={() => handleDelete(a.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "#ef444422", border: "1px solid #ef4444", color: "#ef4444", cursor: "pointer", fontSize: 11 }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── IMS BOT PAGE ──────────────────────────────────────────────────────────────
function IMSBotPage({ t, announcements }) {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I'm IMS Bot. How can I help you today?\n\nI can answer questions about:\n• Attendance rules and policies\n• Exam schedules and dates\n• Assignment deadlines\n• Leave application process\n• Certificate verification\n• Course content and resources" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Attendance related
    if (msg.includes("attendance") || msg.includes("attend")) {
      if (msg.includes("minimum") || msg.includes("required")) {
        return "The minimum required attendance is 75% for eligibility to write end-semester examinations. Students with attendance below 75% may be detained.";
      }
      if (msg.includes("check") || msg.includes("view")) {
        return "You can view attendance records in the Attendance section of your dashboard. Each subject's attendance percentage is shown with color coding: Green (≥85%), Orange (75-84%), Red (<75%).";
      }
      if (msg.includes("improve")) {
        return "To improve attendance, ensure regular class participation. Medical leaves with valid certificates will be considered. Contact your class teacher for special cases.";
      }
      return "Attendance is tracked per subject. Minimum 75% attendance required. Check your attendance records in the Attendance section.";
    }
    
    // Exam related
    if (msg.includes("exam") || msg.includes("mid") || msg.includes("semester")) {
      if (msg.includes("schedule") || msg.includes("date")) {
        return "Mid-semester examinations: April 15–22, 2024\nEnd-semester examinations: May 10–25, 2024\nHall tickets will be available 7 days before exams.";
      }
      if (msg.includes("hall ticket") || msg.includes("admit")) {
        return "Hall tickets can be downloaded from the student portal under 'Examinations' section. Last date to download is 3 days before the exam.";
      }
      return "Examination schedules are available in the Announcements section. Mid-semester exams: April 15–22. End-semester: May 10–25.";
    }
    
    // Assignment related
    if (msg.includes("assignment") || msg.includes("homework") || msg.includes("project")) {
      if (msg.includes("submit") || msg.includes("deadline")) {
        return "Upcoming deadlines:\n• Database Systems Project: April 18, 11:59 PM\n• Data Structures Assignment: April 20\n• Algorithms Quiz: April 22";
      }
      if (msg.includes("where") || msg.includes("platform")) {
        return "Submit assignments through the LMS portal. Navigate to 'LMS Uploader' → select your course → upload your submission.";
      }
      return "Assignments must be submitted via LMS portal before deadlines. Late submissions will have penalty.";
    }
    
    // Leave related
    if (msg.includes("leave") || msg.includes("od") || msg.includes("onduty")) {
      if (msg.includes("apply") || msg.includes("how")) {
        return "To apply for leave/OD:\n1. Go to 'Leave/OD Requests' section\n2. Click 'New Request'\n3. Select type (Leave or OD)\n4. Enter dates and reason\n5. Submit for approval";
      }
      if (msg.includes("medical") || msg.includes("sick")) {
        return "Medical leave requires a doctor's certificate. Submit the certificate along with your leave application for faster approval.";
      }
      return "Leave and OD requests require faculty approval. Apply at least 3 days in advance through the Leave/OD Requests section.";
    }
    
    // Certificate related
    if (msg.includes("certificate") || msg.includes("verify")) {
      if (msg.includes("upload")) {
        return "To upload a certificate:\n1. Go to Student Dashboard → Certificates\n2. Click 'Upload Certificate'\n3. Fill in details and attach file\n4. Submit for faculty verification";
      }
      if (msg.includes("status")) {
        return "Certificate verification status:\n• Pending: Awaiting faculty review\n• Verified: Approved and recorded\n• Rejected: Please check reason and resubmit";
      }
      return "Students can upload certificates for verification. Faculty reviews and approves them within 3-5 working days.";
    }
    
    // Course related
    if (msg.includes("course") || msg.includes("syllabus") || msg.includes("topic")) {
      if (msg.includes("planner") || msg.includes("schedule")) {
        return "Course planners are available for each subject under 'Course Planner' section. It shows weekly topics, resources, and progress status.";
      }
      if (msg.includes("material") || msg.includes("resource")) {
        return "Course materials including PPTs, videos, assignments, and lab exercises are available in the LMS Uploader section.";
      }
      return "Course details are available in the Course Planner and LMS Uploader sections. Check weekly topics and resources.";
    }
    
    // Announcement related
    if (msg.includes("announcement") || msg.includes("notice")) {
      const recentAnnouncements = announcements.slice(0, 3);
      if (recentAnnouncements.length > 0) {
        return "Recent announcements:\n" + recentAnnouncements.map(a => `• ${a.title} (${a.date})`).join("\n");
      }
      return "Check the Announcements section for all official communications from faculty and administration.";
    }
    
    // Contact/Help
    if (msg.includes("help") || msg.includes("support") || msg.includes("contact")) {
      return "For assistance:\n• Academic issues: Contact your class teacher\n• Technical issues: support@collegeims.edu\n• Exam queries: examcell@collegeims.edu\n• Emergency: +91-XXXXXXXXXX";
    }
    
    // Greetings
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! How can I assist you with your academic queries today?";
    }
    
    // Default
    return "I understand you're asking about that. For specific queries, please check the relevant section in your dashboard or rephrase your question. I can help with attendance, exams, assignments, leave requests, certificates, and course content.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { type: "user", text: input }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const response = getBotResponse(input);
      setMessages(prev => [...prev, { type: "bot", text: response }]);
      setIsTyping(false);
    }, 500);
    
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>🤖 AI Assistant</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>IMS Bot</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Ask me anything about attendance, exams, assignments, and more.</p>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, height: "calc(100vh - 280px)", minHeight: 500, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.type === "user" ? "flex-end" : "flex-start", marginBottom: 16 }}>
              <div style={{ maxWidth: "70%" }}>
                <div style={{ marginBottom: 4, fontSize: 11, color: t.subtext }}>{msg.type === "user" ? "You" : "IMS Bot"}</div>
                <div style={{ background: msg.type === "user" ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input, color: msg.type === "user" ? "#fff" : t.text, padding: "12px 16px", borderRadius: msg.type === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", whiteSpace: "pre-line", fontSize: 14 }}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <div style={{ background: t.input, padding: "12px 16px", borderRadius: "18px 18px 18px 4px" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#1a9e8f", marginRight: 4, animation: "pulse 1.5s infinite" }} />
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#1a9e8f", marginRight: 4, animation: "pulse 1.5s infinite 0.3s" }} />
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#1a9e8f", animation: "pulse 1.5s infinite 0.6s" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: "20px 24px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 12 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, outline: "none", fontSize: 14 }}
          />
          <button onClick={handleSend} style={{ padding: "12px 24px", borderRadius: 8, background: "linear-gradient(135deg,#1a9e8f,#17b897)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// ── INTERNAL MARKS PAGE (existing, keep as is) ────────────────────────────────
function InternalMarksPage({ t }) {
  const [activeSection, setActiveSection] = useState("CSE-A");
  const [activeTab, setActiveTab] = useState("marks");
  const [search, setSearch] = useState("");

  const roster = rosterData[activeSection] || [];

  const getMarkStatus = (total) => {
    if (total >= 120) return { label: "GOOD", color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (total >= 90)  return { label: "PASS", color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                   { label: "RISK", color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  const getCGPAStatus = (cgpa) => {
    if (cgpa >= 8.0) return { label: "EXCEL", color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (cgpa >= 6.5) return { label: "GOOD",  color: "#3b82f6", bg: "#3b82f622", border: "#3b82f655" };
    if (cgpa >= 5.0) return { label: "PASS",  color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                  { label: "RISK",  color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  const filtered = roster.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const sectionMarks = roster.map(s => marksData[s.id]).filter(Boolean);
  const avgTotal  = sectionMarks.length ? Math.round(sectionMarks.reduce((a, m) => a + m.total, 0) / sectionMarks.length) : 0;
  const avgCGPA   = sectionMarks.length ? (sectionMarks.reduce((a, m) => a + m.cgpa, 0) / sectionMarks.length).toFixed(2) : 0;
  const atRisk    = sectionMarks.filter(m => m.total < 90).length;
  const topScorer = roster.reduce((best, s) => {
    const m = marksData[s.id];
    return m && (!best || m.total > marksData[best.id]?.total) ? s : best;
  }, null);

  const cgpaBarData = filtered.map(s => ({ name: s.name.split(" ")[0], cgpa: marksData[s.id]?.cgpa || 0, id: s.id }));
  const maxCGPA = 10;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📝 Academic Performance</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Internal Marks</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>CAT scores, assignments, lab marks and CGPA per section.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {allSections.map(sec => (
          <button key={sec} onClick={() => setActiveSection(sec)} style={{
            padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            background: activeSection === sec ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: activeSection === sec ? "#fff" : t.subtext,
            border: `1px solid ${activeSection === sec ? "transparent" : t.border}`,
          }}>{sec}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "🏆", value: avgTotal, label: "AVG TOTAL (/150)", color: "#1a9e8f", grad: "linear-gradient(135deg,#0d3d2e,#0d1b2a)" },
          { icon: "🎓", value: avgCGPA,  label: "AVG CGPA",         color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#0d1b2a)" },
          { icon: "⚠️", value: atRisk,   label: "AT RISK (<90)",    color: "#ef4444", grad: "linear-gradient(135deg,#3d0d0d,#0d1b2a)" },
          { icon: "⭐", value: topScorer?.name.split(" ")[0] || "—", label: "TOP SCORER", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#0d1b2a)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "20px 18px", border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 1, fontWeight: 700 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "marks", label: "📋 Internal Marks Table" }, { id: "cgpa", label: "📊 CGPA Bar Chart" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            background: activeTab === tab.id ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: activeTab === tab.id ? "#fff" : t.subtext,
            border: `1px solid ${activeTab === tab.id ? "transparent" : t.border}`,
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", marginBottom: 18, maxWidth: 340 }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
          style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: "100%" }} />
      </div>

      {activeTab === "marks" ? (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Internal Assessment — {activeSection}</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>CAT 1 (50) + CAT 2 (50) + Assignment (20) + Lab (25) = 150 marks</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: t.tableHead }}>
                  {["STUDENT", "ID", "CAT 1 /50", "CAT 2 /50", "ASSIGN /20", "LAB /25", "TOTAL /150", "PERCENT", "STATUS"].map(h => (
                    <th key={h} style={thStyle(t)}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((stu, i) => {
                  const m   = marksData[stu.id] || { cat1: 0, cat2: 0, assignment: 0, lab: 0, total: 0, cgpa: 0 };
                  const pct = Math.round((m.total / 150) * 100);
                  const st  = getMarkStatus(m.total);
                  return (
                    <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                      <td style={tdStyle(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{stu.name[0]}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{stu.name}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{stu.id}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 700, color: m.cat1 >= 40 ? "#22c55e" : m.cat1 >= 30 ? "#f59e0b" : "#ef4444" }}>{m.cat1}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 700, color: m.cat2 >= 40 ? "#22c55e" : m.cat2 >= 30 ? "#f59e0b" : "#ef4444" }}>{m.cat2}</td>
                      <td style={{ ...tdStyle(t), color: t.text }}>{m.assignment}</td>
                      <td style={{ ...tdStyle(t), color: t.text }}>{m.lab}</td>
                      <td style={{ ...tdStyle(t), fontWeight: 800, fontSize: 15, color: st.color }}>{m.total}</td>
                      <td style={tdStyle(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ background: t.border, borderRadius: 6, height: 6, width: 80, overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: st.color, borderRadius: 6 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{pct}%</span>
                        </div>
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
        </div>
      ) : (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>CGPA Chart — {activeSection}</div>
          <div style={{ fontSize: 12, color: t.subtext, marginBottom: 28 }}>Student CGPA out of 10.0</div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 240, paddingBottom: 8, borderBottom: `1px solid ${t.border}`, position: "relative" }}>
            {[2, 4, 6, 8, 10].map(val => (
              <div key={val} style={{ position: "absolute", left: 0, right: 0, bottom: `${(val / maxCGPA) * 230}px`, borderTop: `1px dashed ${t.border}`, display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: t.subtext, position: "absolute", left: -28, lineHeight: 1 }}>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, width: "100%", paddingLeft: 32, height: "100%" }}>
              {cgpaBarData.map((s, i) => {
                const st = getCGPAStatus(s.cgpa);
                const heightPct = (s.cgpa / maxCGPA) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: st.color }}>{s.cgpa}</div>
                    <div style={{ width: "100%", maxWidth: 52, height: `${heightPct}%`, background: `linear-gradient(to top, ${st.color}, ${st.color}88)`, borderRadius: "6px 6px 0 0", minHeight: 4, cursor: "pointer" }} title={`${s.name}: ${s.cgpa} CGPA`} />
                    <div style={{ fontSize: 11, color: t.subtext, textAlign: "center", whiteSpace: "nowrap" }}>{s.name}</div>
                    <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { label: "EXCEL (≥8.0)", color: "#22c55e" },
              { label: "GOOD (6.5–7.9)", color: "#3b82f6" },
              { label: "PASS (5.0–6.4)", color: "#f59e0b" },
              { label: "RISK (<5.0)", color: "#ef4444" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.subtext }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ATTENDANCE RECORDS PAGE (read-only view from attendanceLog) ───────────────
function AttendanceRecordsPage({ attendanceLog, t }) {
  const [activeSection, setActiveSection] = useState("CSE-A");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const getStatus = (pct) => {
    if (pct === null) return { label: "N/A",  color: "#7a9ab5", bg: "#7a9ab522", border: "#7a9ab555" };
    if (pct >= 85)   return { label: "GOOD",  color: "#22c55e", bg: "#22c55e22", border: "#22c55e55" };
    if (pct >= 75)   return { label: "OK",    color: "#f59e0b", bg: "#f59e0b22", border: "#f59e0b55" };
    return                  { label: "RISK",  color: "#ef4444", bg: "#ef444422", border: "#ef444455" };
  };

  const roster = rosterData[activeSection] || [];
  const rows = roster.map(stu => {
    const subjectStats = subjects.map(sub => {
      const hist      = mockHistory[stu.id]?.[sub] || { present: 0, total: 0 };
      const logRecs   = attendanceLog.filter(r => r.studentId === stu.id && r.subject === sub && r.section === activeSection);
      const present   = hist.present + logRecs.filter(r => r.status === "present").length;
      const total     = hist.total + logRecs.length;
      const pct       = total === 0 ? null : Math.round((present / total) * 100);
      return { subject: sub, present, total, pct };
    });
    const active = subjectStats.filter(s => s.total > 0);
    const overallPct = active.length ? Math.round(active.reduce((a, s) => a + s.pct, 0) / active.length) : null;
    return { ...stu, subjectStats, overallPct };
  });

  const filtered = rows
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
    .filter(r => filterStatus === "All" || getStatus(r.overallPct).label === filterStatus);

  const sectionAvg = rows.filter(r => r.overallPct !== null);
  const avgPct  = sectionAvg.length ? Math.round(sectionAvg.reduce((a, r) => a + r.overallPct, 0) / sectionAvg.length) : 0;
  const atRisk  = rows.filter(r => r.overallPct !== null && r.overallPct < 75).length;
  const liveLogs= attendanceLog.filter(r => r.section === activeSection).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📊 Section-wise Records</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: t.text }}>Attendance Records</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>Per-student attendance across all subjects and sections.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {allSections.map(sec => (
          <button key={sec} onClick={() => setActiveSection(sec)} style={{
            padding: "9px 24px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            background: activeSection === sec ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input,
            color: activeSection === sec ? "#fff" : t.subtext,
            border: `1px solid ${activeSection === sec ? "transparent" : t.border}`,
          }}>{sec}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "👥", value: roster.length, label: "STUDENTS",        color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#0d1b2a)" },
          { icon: "📈", value: `${avgPct}%`,  label: "AVG ATTENDANCE",  color: "#1a9e8f", grad: "linear-gradient(135deg,#0d3d2e,#0d1b2a)" },
          { icon: "⚠️", value: atRisk,        label: "AT RISK (<75%)",  color: "#ef4444", grad: "linear-gradient(135deg,#3d0d0d,#0d1b2a)" },
          { icon: "✅", value: liveLogs,       label: "LOGGED ENTRIES",  color: "#22c55e", grad: "linear-gradient(135deg,#0d3d1e,#0d1b2a)" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 14, padding: "20px 18px", border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 1, fontWeight: 700 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", flex: 1, minWidth: 200 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
            style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: "100%" }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "9px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 13, outline: "none" }}>
          {["All", "GOOD", "OK", "RISK"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>All Subjects — {activeSection}</div>
          <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>{filtered.length} students</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: t.tableHead }}>
                <th style={thStyle(t)}>STUDENT</th>
                <th style={thStyle(t)}>ID</th>
                {subjects.map(s => <th key={s} style={thStyle(t)}>{s.split(" ")[0]}</th>)}
                <th style={thStyle(t)}>OVERALL</th>
                <th style={thStyle(t)}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const st = getStatus(row.overallPct);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : t.rowBg }}>
                    <td style={tdStyle(t)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{row.name[0]}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{row.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{row.id}</td>
                    {row.subjectStats.map((s, j) => (
                      <td key={j} style={tdStyle(t)}>
                        {s.total === 0 ? <span style={{ color: t.subtext, fontSize: 12 }}>—</span> : (
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: s.pct >= 85 ? "#22c55e" : s.pct >= 75 ? "#f59e0b" : "#ef4444" }}>{s.pct}%</div>
                            <div style={{ fontSize: 10, color: t.subtext }}>{s.present}/{s.total}</div>
                          </div>
                        )}
                      </td>
                    ))}
                    <td style={tdStyle(t)}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: row.overallPct >= 85 ? "#22c55e" : row.overallPct >= 75 ? "#f59e0b" : "#ef4444" }}>{row.overallPct ?? "—"}{row.overallPct !== null ? "%" : ""}</div>
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
      </div>
    </div>
  );
}

// ── STUB ──────────────────────────────────────────────────────────────────────
function StubPage({ title, icon, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
      <div style={{ fontSize: 56 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: t.text }}>{title}</div>
      <div style={{ fontSize: 14, color: t.subtext }}>This section is under construction.</div>
    </div>
  );
}

// ── DASHBOARD CONTENT ─────────────────────────────────────────────────────────
function DashboardContent({ t }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    { icon: "👥", value: faculty.students, label: "MY STUDENTS",  sub: "Across 4 sections", color: "#a855f7", grad: "linear-gradient(135deg,#2d1a52,#1a0d2e)", iconBg: "#a855f722" },
    { icon: "📚", value: faculty.subjects, label: "SUBJECTS",     sub: "Current semester",  color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#091528)", iconBg: "#3b82f622" },
    { icon: "✅", value: `${faculty.avgAttend}%`, label: "AVG ATTEND.", sub: "Class average", color: "#22c55e", grad: "linear-gradient(135deg,#0d3d1e,#091a10)", iconBg: "#22c55e22" },
    { icon: "⚠️", value: faculty.atRisk, label: "AT RISK", sub: "Below 75%", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#1a1000)", iconBg: "#f59e0b22" },
  ];

  const statusStyle = (status) => {
    if (status === "ONGOING") return { bg: "#1a9e8f22", color: "#1a9e8f", border: "1px solid #1a9e8f55", label: "ONGOING" };
    if (status === "COUNT")   return { bg: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f655", label: null };
    return { bg: t.rowBg, color: t.subtext, border: `1px solid ${t.border}`, label: "UPCOMING" };
  };

  const studentStatusStyle = (s) => {
    if (s === "OK")   return { bg: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e55" };
    if (s === "WARN") return { bg: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b55" };
    return                   { bg: "#ef444422", color: "#ef4444", border: "1px solid #ef444455" };
  };

  const attendColor = (pct) => pct >= 85 ? "#22c55e" : pct >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a9e8f", marginBottom: 6 }}>📅 {today}</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 6px", color: t.text }}>{greeting}, {faculty.name} 🧑‍🏫</h1>
        <p style={{ fontSize: 14, color: t.subtext, margin: 0 }}>{todaysClasses.length} classes scheduled today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {statCards.map((c, i) => (
          <div key={i} style={{ background: c.grad, borderRadius: 16, padding: "24px 20px", border: `1px solid ${t.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{c.icon}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#7a9ab5", marginTop: 6, letterSpacing: 1, fontWeight: 700 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: "#22c55e", marginTop: 8 }}>↑ {c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Today's Classes</div>
              <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Live schedule</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todaysClasses.map((cls, i) => {
              const st = statusStyle(cls.status);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: cls.status === "ONGOING" ? t.rowActive : t.rowBg, border: cls.status === "ONGOING" ? "1px solid #1a9e8f44" : `1px solid ${t.border}` }}>
                  <div style={{ minWidth: 36, height: 36, borderRadius: 8, background: cls.status === "ONGOING" ? "#1a9e8f22" : t.toggleBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cls.status === "ONGOING" ? "#1a9e8f" : t.subtext }}>{cls.order}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{cls.subject}</div>
                    <div style={{ fontSize: 11, color: t.subtext, marginTop: 2 }}>{cls.time} · {cls.section} · {cls.room}</div>
                  </div>
                  {cls.status === "COUNT"
                    ? <span style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f655", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{cls.count}</span>
                    : <span style={{ background: st.bg, color: st.color, border: st.border, borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{st.label}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Attendance Stats</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Current semester</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {attendanceStats.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.subject}</div>
                    <div style={{ fontSize: 11, color: t.subtext }}>{s.sections}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.pct}%</div>
                </div>
                <div style={{ background: t.border, borderRadius: 8, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 28, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
            {[{ value: "84", label: "Total Classes" }, { value: "187", label: "Students" }, { value: "83%", label: "Avg Attend." }].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a9e8f" }}>{item.value}</div>
                <div style={{ fontSize: 11, color: t.subtext, marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Student Overview</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>Recent performance</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: t.tableHead }}>{["STUDENT", "ID", "ATTEND.", "CGPA", "STATUS"].map(h => <th key={h} style={thStyle(t)}>{h}</th>)}</tr></thead>
            <tbody>
              {studentOverview.map((s, i) => {
                const st = studentStatusStyle(s.status);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                    <td style={tdStyle(t)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.name[0]}</div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle(t), color: t.subtext, fontSize: 12 }}>{s.id}</td>
                    <td style={{ ...tdStyle(t), fontWeight: 700, color: attendColor(s.attend) }}>{s.attend}%</td>
                    <td style={{ ...tdStyle(t), fontWeight: 600 }}>{s.cgpa}</td>
                    <td style={tdStyle(t)}><span style={{ background: st.bg, color: st.color, border: st.border, borderRadius: 6, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>{s.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>Announcements</div>
            <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>For faculty</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {announcements.slice(0, 3).map((a, i) => (
              <div key={i} style={{ padding: "18px 24px", borderTop: i > 0 ? `1px solid ${t.border}` : "none", borderLeft: `3px solid ${a.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ background: a.tagBg, color: a.tagColor, border: `1px solid ${a.tagColor}55`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{a.tag}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{a.title}</span>
                </div>
                <div style={{ fontSize: 13, color: t.subtext, lineHeight: 1.5 }}>{a.body}</div>
                <div style={{ fontSize: 11, color: t.sectionLabel, marginTop: 8 }}>{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SHELL ─────────────────────────────────────────────────────────────────────
export default function FacultyDashboard({ onLogout, isDark, toggleTheme, t }) {
  const [active, setActive]       = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Shared attendance log — passed to both AttendancePage and AttendanceRecordsPage
  const [attendanceLog, setAttendanceLog] = useState([]);

  const sections = ["MAIN", "TEACHING", "STUDENTS", "TOOLS"];

  const renderPage = () => {
    if (active === "dashboard")     return <DashboardContent t={t} />;
    if (active === "attendance")    return <AttendancePage t={t} attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog} />;
    if (active === "records")       return <AttendanceRecordsPage t={t} attendanceLog={attendanceLog} />;
    if (active === "marks")         return <InternalMarksPage t={t} />;
    if (active === "timetable")     return <TimetablePage t={t} />;
    if (active === "courseplanner") return <CoursePlannerPage t={t} />;
    if (active === "lms")           return <LMSPage t={t} />;
    if (active === "certificates")  return <CertificatesPage t={t} />;
    if (active === "leaveRequests") return <LeaveRequestsPage t={t} />;
    if (active === "announcements") return <AnnouncementsPage t={t} announcements={announcements} />;
    if (active === "imsbot")        return <IMSBotPage t={t} announcements={announcements} />;
    return <StubPage title="Coming Soon" icon="🚧" t={t} />;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: t.bg, fontFamily: "'Segoe UI', sans-serif", color: t.text, overflow: "hidden", transition: "all 0.3s" }}>
      <aside style={{ width: sidebarOpen ? 220 : 64, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", padding: "20px 0", transition: "width 0.3s", overflow: "hidden", minHeight: "100vh", position: "relative", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px 24px" }}>
          <div style={{ minWidth: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>MS</span>
          </div>
          {sidebarOpen && <div><div style={{ fontSize: 16, fontWeight: 700, whiteSpace: "nowrap", color: t.text }}>CollegeIMS</div><div style={{ fontSize: 11, color: t.subtext, whiteSpace: "nowrap" }}>Smart Campus Portal</div></div>}
        </div>

        {sidebarOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.navActive, margin: "0 12px 20px", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", color: t.text }}>{faculty.name}</div>
              <div style={{ fontSize: 11, color: t.subtext }}>{faculty.id}</div>
            </div>
          </div>
        )}

        {sections.map(sec => (
          <div key={sec}>
            {sidebarOpen && <div style={{ fontSize: 10, color: t.sectionLabel, fontWeight: 700, letterSpacing: 1, padding: "12px 20px 4px" }}>{sec}</div>}
            {navItems.filter(n => n.section === sec).map(item => (
              <button key={item.id} onClick={() => setActive(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px", border: "none", background: active === item.id ? t.navActive : "none", color: active === item.id ? t.text : t.subtext, borderLeft: active === item.id ? "3px solid #1a9e8f" : "3px solid transparent", cursor: "pointer", fontSize: 14, justifyContent: sidebarOpen ? "flex-start" : "center", transition: "all 0.15s" }}>
                <span style={{ fontSize: 17, minWidth: 22, textAlign: "center" }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {item.badge && sidebarOpen && <span style={{ marginLeft: "auto", background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}

        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px", marginTop: "auto", border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, justifyContent: sidebarOpen ? "flex-start" : "center" }}>
          <span style={{ fontSize: 17, minWidth: 22, textAlign: "center" }}>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: "absolute", bottom: 16, right: 8, background: t.toggleBg, border: `1px solid ${t.border}`, color: t.subtext, borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 13 }}>
          {sidebarOpen ? "←" : "→"}
        </button>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: `1px solid ${t.border}`, background: t.sidebar, transition: "all 0.3s" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{navItems.find(n => n.id === active)?.label || "Dashboard"}</div>
            <div style={{ fontSize: 12, color: t.subtext }}>Home / {navItems.find(n => n.id === active)?.label || "Dashboard"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.searchBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px" }}>
              <span>🔍</span>
              <input placeholder="Search students, courses..." style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: 180 }} />
            </div>
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} t={t} />
            <div style={{ fontSize: 20, cursor: "pointer" }}>🔔</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>DPS</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{faculty.name}</div>
                <div style={{ fontSize: 11, color: t.subtext }}>Faculty — {faculty.dept}</div>
              </div>
            </div>
          </div>
        </header>
        <div style={{ padding: 32, flex: 1, overflowY: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
}