import React, { useState, useEffect, useRef, useCallback } from "react";
import { ThemeToggle } from "./App";
import { api } from "./api";

// ─── Exam Seating Allotment System Data & Logic ────────────────────────────────────────

const IMS_DEPARTMENTS = [
  "Computer Science", "Electronics", "Mechanical", "Civil Engineering",
  "Information Technology", "Electrical Engineering", "Chemical Engineering", "Biomedical Engineering",
];

const IMS_ROOMS = [
  { id: "LH-101", capacity: 30 }, { id: "LH-102", capacity: 30 }, { id: "LH-103", capacity: 30 },
  { id: "LH-201", capacity: 30 }, { id: "LH-202", capacity: 30 }, { id: "LH-203", capacity: 30 },
  { id: "LH-301", capacity: 30 }, { id: "LH-302", capacity: 30 }, { id: "LH-303", capacity: 30 },
  { id: "LH-401", capacity: 30 }, { id: "LH-402", capacity: 30 }, { id: "LH-403", capacity: 30 },
  { id: "HALL-A", capacity: 40 }, { id: "HALL-B", capacity: 40 },
];

const IMS_DEPT_COLORS = {
  "Computer Science": "#3b82f6", "Electronics": "#8b5cf6", "Mechanical": "#f59e0b",
  "Civil Engineering": "#10b981", "Information Technology": "#06b6d4",
  "Electrical Engineering": "#f97316", "Chemical Engineering": "#ec4899", "Biomedical Engineering": "#84cc16",
};

const IMS_DEPT_SHORT = {
  "Computer Science": "CSE", "Electronics": "ECE", "Mechanical": "ME",
  "Civil Engineering": "CE", "Information Technology": "IT",
  "Electrical Engineering": "EEE", "Chemical Engineering": "CHE", "Biomedical Engineering": "BME",
};

const IMS_COLS = 5;

const generateImsStudents = () => {
  const firstNames = ["Arjun","Priya","Kiran","Anjali","Ravi","Meena","Rohit","Sneha","Vikram","Neha","Arun","Divya","Suresh","Kavitha","Raj","Lakshmi","Mohan","Ananya","Deepak","Pooja","Sanjay","Nithya","Ganesh","Radha","Vinay","Shalini","Kartik","Mythili","Harish","Saranya","Akash","Revathi","Dinesh","Usha","Praveen","Malathi","Sunil","Geetha","Bala","Pavithra","Mani","Suganya","Rajan","Padmavathi","Vimal","Sumitha","Kumar","Nirmala","Prakash","Vasantha"];
  const lastNames = ["Kumar","Sharma","Patel","Reddy","Singh","Nair","Rao","Iyer","Pillai","Menon","Krishnan","Subramaniam","Venkatesh","Ramachandran","Balakrishnan","Sundaram","Natarajan","Anand","Selvan","Muthu"];
  const students = [];
  let id = 1;
  IMS_DEPARTMENTS.forEach((dept, dIdx) => {
    const count = Math.floor(1000 / IMS_DEPARTMENTS.length) + (dIdx < 1000 % IMS_DEPARTMENTS.length ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const year = String(2021 + (i % 4));
      const roll = `${year.slice(2)}${dept.replace(/\s/g,"").slice(0,3).toUpperCase()}${String(id).padStart(4,"0")}`;
      students.push({ id, name: `${fn} ${ln}`, department: dept, registerNumber: roll });
      id++;
    }
  });
  return students;
};

const IMS_ALL_STUDENTS = generateImsStudents();

const generateImsSeatHistory = (students) => {
  const history = {};
  students.forEach((s) => {
    history[s.id] = [];
    for (let i = 0; i < 5; i++) {
      const roomIdx = Math.floor(Math.random() * IMS_ROOMS.length);
      const seat = Math.floor(Math.random() * IMS_ROOMS[roomIdx].capacity) + 1;
      history[s.id].push({ room: IMS_ROOMS[roomIdx].id, seat });
    }
  });
  return history;
};

const IMS_SEAT_HISTORY = generateImsSeatHistory(IMS_ALL_STUDENTS);

const allocateSeating = (students) => {
  if (!students.length) return [];
  const byDept = {};
  [...students].sort((a, b) => a.department.localeCompare(b.department)).forEach((s) => {
    if (!byDept[s.department]) byDept[s.department] = [];
    byDept[s.department].push(s);
  });
  const deptQueues = Object.values(byDept);
  const interleaved = [];
  let qi = 0;
  while (interleaved.length < students.length) {
    for (let d = 0; d < deptQueues.length; d++) {
      const q = deptQueues[(qi + d) % deptQueues.length];
      if (q.length) { interleaved.push(q.shift()); if (interleaved.length === students.length) break; }
    }
    qi = (qi + 1) % deptQueues.length;
    if (deptQueues.every((q) => q.length === 0)) break;
  }
  const roomAssignments = [];
  let studentIdx = 0;
  for (const room of IMS_ROOMS) {
    if (studentIdx >= interleaved.length) break;
    const seats = [];
    const rows = Math.ceil(room.capacity / IMS_COLS);
    for (let row = 0; row < rows && studentIdx < interleaved.length; row++) {
      for (let col = 0; col < IMS_COLS && studentIdx < interleaved.length; col++) {
        const seatNumber = row * IMS_COLS + col + 1;
        const student = interleaved[studentIdx];
        const history = IMS_SEAT_HISTORY[student.id] || [];
        const hasConflict = history.some((h) => h.room === room.id && h.seat === seatNumber);
        if (hasConflict) {
          const swapIdx = interleaved.findIndex((s, i) => i > studentIdx && !(IMS_SEAT_HISTORY[s.id] || []).some((h) => h.room === room.id && h.seat === seatNumber));
          if (swapIdx !== -1) [interleaved[studentIdx], interleaved[swapIdx]] = [interleaved[swapIdx], interleaved[studentIdx]];
        }
        seats.push({ seatNo: seatNumber, row: row + 1, col: col + 1, student: interleaved[studentIdx] });
        studentIdx++;
      }
    }
    roomAssignments.push({ room: room.id, capacity: room.capacity, seats });
  }
  return roomAssignments;
};

// ─── CSV Export Functions ─────────────────────────────────────────────

const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      const escaped = String(value).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const exportAttendanceToCSV = () => {
  const attendanceData = studentsData.map(student => ({
    'Student Name': student.name,
    'Roll Number': student.rollNo,
    'Department': student.department,
    'Year': student.year,
    'Section': student.section,
    'Attendance %': student.attendance,
    'CGPA': student.cgpa,
    'Fee Status': student.feeStatus.toUpperCase(),
    'Email': student.email,
    'Phone': student.phone
  }));
  exportToCSV(attendanceData, 'Attendance_Report');
};

const exportFacultyToCSV = () => {
  const facultyDataExport = facultyData.map(faculty => ({
    'Faculty Name': faculty.name,
    'Department': faculty.department,
    'Designation': faculty.designation,
    'Qualification': faculty.qualification,
    'Experience': faculty.experience,
    'Specialization': faculty.specialization,
    'Email': faculty.email,
    'Phone': faculty.phone
  }));
  exportToCSV(facultyDataExport, 'Faculty_Details');
};

const exportSeatingToCSV = (assignments) => {
  if (!assignments || assignments.length === 0) return;
  const seatingData = [];
  assignments.forEach(room => {
    room.seats.forEach(seat => {
      seatingData.push({
        'Room': room.room,
        'Seat Number': seat.seatNo,
        'Row': seat.row,
        'Column': seat.col,
        'Student Name': seat.student.name,
        'Register Number': seat.student.registerNumber,
        'Department': seat.student.department
      });
    });
  });
  exportToCSV(seatingData, 'Exam_Seating_Arrangement');
};

// ─── Exam Seating Allotment Sub-Components ─────────────────────────────────────────────

function ExamSeatingNavbar({ totalStudents, allocatedCount, onExportSeating, assignments }) {
  return (
    <div style={{ background: "#0f172a", borderBottom: "1px solid #1e293b", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "12px 12px 0 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>ESA</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Exam Seating Allotment System</div>
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {[["Total Students", totalStudents, "#3b82f6"], ["Allocated", allocatedCount, "#10b981"], ["Rooms", IMS_ROOMS.length, "#8b5cf6"]].map(([label, val, color]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
        {assignments && assignments.length > 0 && (
          <button onClick={onExportSeating} style={{ background: "#22c55e", border: "none", borderRadius: 6, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            📊 Export Seating
          </button>
        )}
      </div>
    </div>
  );
}

function ExamSeatingCountdown({ examDateTime, onUnlock }) {
  const [remaining, setRemaining] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const prevRef = useRef(false);
  const fmt2 = (n) => String(n).padStart(2, "0");

  useEffect(() => {
    if (!examDateTime) return;
    const tick = () => {
      const diff = new Date(examDateTime).getTime() - Date.now();
      setRemaining(diff);
      const unlocked = diff <= 20 * 60 * 1000;
      setIsUnlocked(unlocked);
      if (unlocked && !prevRef.current) { onUnlock?.(); prevRef.current = true; }
      if (!unlocked) prevRef.current = false;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [examDateTime, onUnlock]);

  if (!examDateTime || remaining === null) return null;
  const isExpired = remaining <= 0;
  const totalSec = Math.max(0, Math.floor(remaining / 1000));
  const h = Math.floor(totalSec / 3600), m = Math.floor((totalSec % 3600) / 60), s = totalSec % 60;
  const statusColor = isExpired ? "#10b981" : isUnlocked ? "#22c55e" : remaining < 3600000 ? "#f59e0b" : "#3b82f6";
  const statusText = isExpired ? "Exam In Progress" : isUnlocked ? "Seating Active" : "Exam Upcoming";

  return (
    <div style={{ background: "#0f172a", border: `1px solid ${statusColor}44`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: statusColor, flexShrink: 0, boxShadow: isUnlocked ? `0 0 10px ${statusColor}` : "none", animation: isUnlocked ? "imsPulse 1.5s infinite" : "none" }} />
      <div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>{statusText}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: statusColor, letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>
          {isExpired ? "00:00:00" : `${fmt2(h)}:${fmt2(m)}:${fmt2(s)}`}
        </div>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        <div style={{ fontSize: 11, color: "#64748b" }}>Seating unlocks 20 min before exam</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{new Date(examDateTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
      </div>
      <style>{`@keyframes imsPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

function ExamSeatingFiltersPanel({ onGenerate, loading }) {
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("morning");
  const [customTime, setCustomTime] = useState("09:00");

  const toggleDept = (dept) => setSelectedDepts((prev) => prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]);
  const toggleAll = () => setSelectedDepts(selectedDepts.length === IMS_DEPARTMENTS.length ? [] : [...IMS_DEPARTMENTS]);

  const getExamDateTime = () => {
    if (!examDate) return null;
    const time = examTime === "afternoon" ? "14:00" : examTime === "custom" ? customTime : "09:00";
    return new Date(`${examDate}T${time}:00`).toISOString();
  };

  const handleGenerate = () => {
    if (!selectedDepts.length || !examDate) return;
    onGenerate({ departments: selectedDepts, examDateTime: getExamDateTime() });
  };

  const isReady = selectedDepts.length > 0 && examDate;

  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Configure Exam Parameters</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Departments ({selectedDepts.length}/{IMS_DEPARTMENTS.length})</label>
          <button onClick={toggleAll} style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", fontSize: 11, padding: "3px 10px", borderRadius: 6, cursor: "pointer" }}>
            {selectedDepts.length === IMS_DEPARTMENTS.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {IMS_DEPARTMENTS.map((dept) => {
            const active = selectedDepts.includes(dept);
            const color = IMS_DEPT_COLORS[dept];
            return (
              <button key={dept} onClick={() => toggleDept(dept)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? color : "#334155"}`, background: active ? `${color}22` : "transparent", color: active ? color : "#64748b", fontSize: 11, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                {IMS_DEPT_SHORT[dept]} — {dept}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: examTime === "custom" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Exam Date</label>
          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Exam Timing</label>
          <select value={examTime} onChange={(e) => setExamTime(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13 }}>
            <option value="morning">Morning — 9:00 AM</option>
            <option value="afternoon">Afternoon — 2:00 PM</option>
            <option value="custom">Custom Time</option>
          </select>
        </div>
        {examTime === "custom" && (
          <div>
            <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Custom Time</label>
            <input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box" }} />
          </div>
        )}
      </div>
      <button onClick={handleGenerate} disabled={!isReady || loading} style={{ background: isReady && !loading ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "#334155", border: "none", borderRadius: 10, padding: "10px 24px", color: isReady && !loading ? "#fff" : "#64748b", fontSize: 13, fontWeight: 600, cursor: isReady && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8 }}>
        {loading ? <><ExamSeatingSpinner /> Generating Allocation...</> : "Generate Seating Allocation"}
      </button>
      {!isReady && <div style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>{!selectedDepts.length && "Select at least one department. "}{!examDate && "Choose an exam date."}</div>}
    </div>
  );
}

function ExamSeatingSpinner() {
  return (
    <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "imsSpin 0.7s linear infinite" }}>
      <style>{`@keyframes imsSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ExamSeatingSummary({ assignments, departments }) {
  const totalStudents = assignments.reduce((s, a) => s + a.seats.length, 0);
  const deptCounts = {};
  assignments.forEach((a) => a.seats.forEach((seat) => { deptCounts[seat.student.department] = (deptCounts[seat.student.department] || 0) + 1; }));
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 16, marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Allocation Summary</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
        {[["Total Students", totalStudents, "#3b82f6"], ["Rooms Used", assignments.length, "#8b5cf6"], ["Departments", departments.length, "#10b981"], ["Avg per Room", Math.round(totalStudents / (assignments.length || 1)), "#f59e0b"]].map(([label, val, color]) => (
          <div key={label} style={{ background: "#0f172a", border: `1px solid ${color}33`, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {departments.map((dept) => (
          <div key={dept} style={{ display: "flex", alignItems: "center", gap: 5, background: `${IMS_DEPT_COLORS[dept]}18`, border: `1px solid ${IMS_DEPT_COLORS[dept]}44`, borderRadius: 6, padding: "4px 8px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: IMS_DEPT_COLORS[dept] }} />
            <span style={{ fontSize: 11, color: IMS_DEPT_COLORS[dept], fontWeight: 600 }}>{IMS_DEPT_SHORT[dept]}</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>{deptCounts[dept] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamSeatingRoomCard({ assignment, isVisible, searchTerm }) {
  const rows = [];
  const maxRow = Math.max(...assignment.seats.map((s) => s.row), 1);
  for (let r = 1; r <= maxRow; r++) rows.push(assignment.seats.filter((s) => s.row === r));
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ background: "#0f172a", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{assignment.room}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{assignment.seats.length} students · {Math.ceil(assignment.seats.length / IMS_COLS)} rows × {IMS_COLS} cols</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[...new Set(assignment.seats.map((s) => s.student.department))].slice(0, 4).map((dept) => (
            <span key={dept} style={{ background: `${IMS_DEPT_COLORS[dept]}22`, color: IMS_DEPT_COLORS[dept], fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{IMS_DEPT_SHORT[dept]}</span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "10px 0 2px" }}>
        <div style={{ display: "inline-block", background: "#334155", color: "#94a3b8", fontSize: 10, padding: "3px 18px", borderRadius: 4 }}>INVIGILATOR'S DESK</div>
      </div>
      <div style={{ padding: "6px 16px 16px", overflowX: "auto" }}>
        {!isVisible ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#475569", fontSize: 13 }}>🔒 Seating visible 20 minutes before exam</div>
        ) : (
          rows.map((rowSeats, ri) => (
            <div key={ri} style={{ display: "flex", gap: 6, marginBottom: 6, justifyContent: "center" }}>
              <div style={{ width: 18, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 10, color: "#475569", marginRight: 2, flexShrink: 0 }}>{String.fromCharCode(65 + ri)}</div>
              {rowSeats.map((seat) => {
                const color = IMS_DEPT_COLORS[seat.student.department];
                const highlight = searchTerm && (seat.student.name.toLowerCase().includes(searchTerm.toLowerCase()) || seat.student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()));
                return (
                  <div key={seat.seatNo} title={`${seat.student.name} | ${seat.student.registerNumber} | ${seat.student.department}`}
                    style={{ width: 82, minHeight: 58, background: highlight ? "#fef08a11" : `${color}18`, border: `1px solid ${highlight ? "#fbbf24" : color + "55"}`, borderRadius: 6, padding: "5px 6px", cursor: "default", outline: highlight ? "2px solid #fbbf24" : "none", transition: "transform 0.1s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <div style={{ fontSize: 9, color, fontWeight: 700, marginBottom: 2 }}>{String.fromCharCode(65 + ri)}{seat.col} · {IMS_DEPT_SHORT[seat.student.department]}</div>
                    <div style={{ fontSize: 10, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.3, wordBreak: "break-word" }}>{seat.student.name}</div>
                    <div style={{ fontSize: 9, color: "#64748b", marginTop: 1 }}>{seat.student.registerNumber}</div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Exam Seating Allotment Component ─────────────────────────────────────────

function ExamSeatingAllotment() {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState(null);
  const [examConfig, setExamConfig] = useState(null);
  const [seatingVisible, setSeatingVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoom, setFilterRoom] = useState("All");
  const [error, setError] = useState(null);

  const handleUnlock = useCallback(() => setSeatingVisible(true), []);

  const handleGenerate = ({ departments, examDateTime }) => {
    setLoading(true); setError(null); setAssignments(null); setSeatingVisible(false);
    setTimeout(() => {
      const filtered = IMS_ALL_STUDENTS.filter((s) => departments.includes(s.department));
      if (!filtered.length) { setError("No students found for selected departments."); setLoading(false); return; }
      try {
        const result = allocateSeating(filtered);
        setAssignments(result);
        setExamConfig({ departments, examDateTime });
        if (new Date(examDateTime).getTime() - Date.now() <= 20 * 60 * 1000) setSeatingVisible(true);
      } catch (e) { setError("Allocation failed. Please try again."); }
      setLoading(false);
    }, 1400);
  };

  const handleRegenerate = () => { if (examConfig) handleGenerate(examConfig); };
  const handleExportSeating = () => { if (assignments) exportSeatingToCSV(assignments); };

  const visibleAssignments = assignments ? (filterRoom === "All" ? assignments : assignments.filter((a) => a.room === filterRoom)) : [];
  const allocatedCount = assignments ? assignments.reduce((s, a) => s + a.seats.length, 0) : 0;

  return (
    <div style={{ background: "#0f172a", borderRadius: 12, overflow: "hidden", minHeight: 500 }}>
      <ExamSeatingNavbar totalStudents={IMS_ALL_STUDENTS.length} allocatedCount={allocatedCount} onExportSeating={handleExportSeating} assignments={assignments} />
      <div style={{ padding: 20 }}>
        <ExamSeatingFiltersPanel onGenerate={handleGenerate} loading={loading} />
        {error && <div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 16px", color: "#ef4444", marginBottom: 16, fontSize: 13 }}>⚠️ {error}</div>}
        {examConfig && (
          <>
            <ExamSeatingCountdown examDateTime={examConfig.examDateTime} onUnlock={handleUnlock} />
            <ExamSeatingSummary assignments={assignments || []} departments={examConfig.departments} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <select value={filterRoom} onChange={(e) => setFilterRoom(e.target.value)} style={{ background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9", borderRadius: 6, padding: "7px 12px", fontSize: 12 }}>
                  <option value="All">All Rooms ({(assignments || []).length})</option>
                  {(assignments || []).map((a) => <option key={a.room} value={a.room}>{a.room} ({a.seats.length})</option>)}
                </select>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {examConfig.departments.map((dept) => (
                    <div key={dept} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: IMS_DEPT_COLORS[dept] }} />
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{IMS_DEPT_SHORT[dept]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleRegenerate} disabled={loading} style={{ background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer", display: "flex", gap: 5, alignItems: "center" }}>↺ Regenerate</button>
            </div>
            {seatingVisible && (
              <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input placeholder="Search student by name or register number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: "#f1f5f9", fontSize: 12, flex: 1 }} />
                {searchTerm && <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button>}
              </div>
            )}
            {visibleAssignments.map((a) => <ExamSeatingRoomCard key={a.room} assignment={a} isVisible={seatingVisible} searchTerm={searchTerm} />)}
            {!seatingVisible && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Seating allocation is ready</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Will be revealed automatically 20 minutes before exam time</div>
              </div>
            )}
          </>
        )}
        {!examConfig && !loading && (
          <div style={{ textAlign: "center", padding: "56px 0", color: "#334155" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#475569" }}>Configure exam parameters above</div>
            <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>Select departments, date, and timing — then generate seating allocation</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Existing Admin Dashboard Data ───────────────────────────────────────────

const adminStats = {
  totalStudents: 1248, studentsChange: "+32 this month", totalFaculty: 68,
  facultySubtext: "Across 4 depts", avgAttendance: 34, attendanceChange: "+2% from last month",
  totalDepts: 4, deptSubtext: "All departments",
};

const monthlyAttendance = {
  months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  avgAttendance: [69,74,82,79,86,88,83,90,85,87,84,91],
};

const departmentData = [
  { id: 1, name: "Computer Science", attendance: 86, students: 312, faculty: 18, hod: "Dr. Rajesh Kumar", code: "CSE", established: "2005" },
  { id: 2, name: "Electronics", attendance: 82, students: 248, faculty: 15, hod: "Dr. Priya Sharma", code: "ECE", established: "2006" },
  { id: 3, name: "Mechanical", attendance: 78, students: 196, faculty: 14, hod: "Dr. Suresh Patel", code: "ME", established: "2004" },
  { id: 4, name: "Civil Engg.", attendance: 88, students: 180, faculty: 12, hod: "Dr. Anita Desai", code: "CE", established: "2005" },
];

const studentsData = [];

const facultyData = [
  { id: 1, name: "Dr. Rajesh Kumar", department: "Computer Science", designation: "Professor & HOD", qualification: "Ph.D., IIT Bombay", experience: "15 years", email: "rajesh@college.edu", phone: "9988776655", specialization: "AI & ML" },
  { id: 2, name: "Dr. Priya Sharma", department: "Electronics", designation: "Professor & HOD", qualification: "Ph.D., IIT Madras", experience: "12 years", email: "priya.sharma@college.edu", phone: "9988776656", specialization: "VLSI Design" },
  { id: 3, name: "Dr. Suresh Patel", department: "Mechanical", designation: "Professor & HOD", qualification: "Ph.D., IIT Delhi", experience: "14 years", email: "suresh@college.edu", phone: "9988776657", specialization: "Thermal Engineering" },
  { id: 4, name: "Dr. Anita Desai", department: "Civil Engg.", designation: "Professor & HOD", qualification: "Ph.D., IIT Roorkee", experience: "11 years", email: "anita@college.edu", phone: "9988776658", specialization: "Structural Engineering" },
  { id: 5, name: "Prof. James Wilson", department: "Computer Science", designation: "Associate Professor", qualification: "M.Tech, NIT", experience: "8 years", email: "james@college.edu", phone: "9988776659", specialization: "Cybersecurity" },
  { id: 6, name: "Dr. Ahmed Khan", department: "Electronics", designation: "Assistant Professor", qualification: "Ph.D., BITS Pilani", experience: "6 years", email: "ahmed@college.edu", phone: "9988776660", specialization: "Embedded Systems" },
  { id: 7, name: "Prof. Sarah Joseph", department: "Computer Science", designation: "Assistant Professor", qualification: "M.Tech, IIT", experience: "5 years", email: "sarah@college.edu", phone: "9988776661", specialization: "Data Science" },
];

const initialTimetable = [
  { id: 1, day: "Monday", time: "09:00-10:00", subject: "Data Structures", faculty: "Dr. Rajesh Kumar", department: "Computer Science", year: "3rd", section: "A", room: "LH-101" },
  { id: 2, day: "Monday", time: "10:00-11:00", subject: "Algorithms", faculty: "Prof. James Wilson", department: "Computer Science", year: "3rd", section: "A", room: "LH-101" },
  { id: 3, day: "Monday", time: "11:00-12:00", subject: "Digital Electronics", faculty: "Dr. Priya Sharma", department: "Electronics", year: "3rd", section: "A", room: "LH-202" },
  { id: 4, day: "Tuesday", time: "09:00-10:00", subject: "Thermodynamics", faculty: "Dr. Suresh Patel", department: "Mechanical", year: "3rd", section: "A", room: "LH-303" },
  { id: 5, day: "Tuesday", time: "10:00-11:00", subject: "Data Structures", faculty: "Dr. Rajesh Kumar", department: "Computer Science", year: "3rd", section: "B", room: "LH-102" },
  { id: 6, day: "Wednesday", time: "09:00-10:00", subject: "Structural Analysis", faculty: "Dr. Anita Desai", department: "Civil Engg.", year: "3rd", section: "A", room: "LH-404" },
  { id: 7, day: "Wednesday", time: "10:00-11:00", subject: "Embedded Systems", faculty: "Dr. Ahmed Khan", department: "Electronics", year: "3rd", section: "B", room: "LH-203" },
];

const facultyFeedback = [
  { facultyId: 1, facultyName: "Dr. Rajesh Kumar", department: "Computer Science", ratings: [5,4,5,4,5,4,5,4,5,4], comments: ["Excellent teacher","Very knowledgeable"] },
  { facultyId: 2, facultyName: "Dr. Priya Sharma", department: "Electronics", ratings: [4,5,4,4,5,4,4,5,4,4], comments: ["Good communication","Helpful"] },
  { facultyId: 3, facultyName: "Dr. Suresh Patel", department: "Mechanical", ratings: [3,4,3,4,3,4,3,4,3,4], comments: ["Average teaching","Needs improvement"] },
  { facultyId: 4, facultyName: "Dr. Anita Desai", department: "Civil Engg.", ratings: [5,5,4,5,5,4,5,5,4,5], comments: ["Outstanding professor","Very supportive"] },
  { facultyId: 5, facultyName: "Prof. James Wilson", department: "Computer Science", ratings: [4,4,4,3,4,4,5,4,4,4], comments: ["Good practical knowledge"] },
  { facultyId: 6, facultyName: "Dr. Ahmed Khan", department: "Electronics", ratings: [4,5,4,5,4,4,5,4,4,5], comments: ["Engaging lectures"] },
  { facultyId: 7, facultyName: "Prof. Sarah Joseph", department: "Computer Science", ratings: [5,5,5,4,5,5,4,5,5,5], comments: ["Amazing teacher","Best faculty"] },
];

const leaveRequests = [
  { id: 1, studentName: "Arjun Ravi", rollNo: "21CSE001", department: "Computer Science", year: "3rd", section: "A", type: "Leave", startDate: "2026-04-10", endDate: "2026-04-12", reason: "Medical emergency", status: "Approved", submittedDate: "2026-04-05", document: "medical_cert.pdf" },
  { id: 2, studentName: "Priya Nair", rollNo: "21CSE002", department: "Computer Science", year: "3rd", section: "A", type: "OD", startDate: "2026-04-15", endDate: "2026-04-15", reason: "Placement drive", status: "Pending", submittedDate: "2026-04-08", document: null },
  { id: 3, studentName: "Anjali M.", rollNo: "21ECE001", department: "Electronics", year: "3rd", section: "A", type: "Leave", startDate: "2026-04-20", endDate: "2026-04-25", reason: "Family function", status: "Pending", submittedDate: "2026-04-09", document: "invitation.pdf" },
  { id: 4, studentName: "Ravi Kumar", rollNo: "21ECE002", department: "Electronics", year: "3rd", section: "B", type: "OD", startDate: "2026-04-18", endDate: "2026-04-18", reason: "Technical symposium", status: "Approved", submittedDate: "2026-04-07", document: "event_reg.pdf" },
  { id: 5, studentName: "Meena S.", rollNo: "21ME001", department: "Mechanical", year: "3rd", section: "A", type: "Leave", startDate: "2026-05-01", endDate: "2026-05-05", reason: "Sister's wedding", status: "Pending", submittedDate: "2026-04-10", document: "wedding_invite.pdf" },
  { id: 6, studentName: "Vikram Singh", rollNo: "21CSE004", department: "Computer Science", year: "2nd", section: "A", type: "Leave", startDate: "2026-04-12", endDate: "2026-04-14", reason: "Health issues", status: "Rejected", submittedDate: "2026-04-06", document: "doctor_note.pdf" },
];

const certificatesData = [
  { id: 1, studentName: "Arjun Ravi", rollNo: "21CSE001", department: "Computer Science", year: "3rd", section: "A", certificateName: "Python Programming", issueDate: "2025-12-15", type: "Course", issuer: "Coursera", verified: true },
  { id: 2, studentName: "Kiran Raj", rollNo: "21CSE003", department: "Computer Science", year: "3rd", section: "B", certificateName: "Hackathon Winner 2025", issueDate: "2025-11-20", type: "Achievement", issuer: "College", verified: true },
  { id: 3, studentName: "Sneha K.", rollNo: "21CE001", department: "Civil Engg.", year: "3rd", section: "A", certificateName: "AutoCAD Certification", issueDate: "2025-10-10", type: "Course", issuer: "Autodesk", verified: true },
  { id: 4, studentName: "Neha Gupta", rollNo: "21ECE003", department: "Electronics", year: "2nd", section: "A", certificateName: "Robotics Workshop", issueDate: "2026-01-20", type: "Workshop", issuer: "IIT Bombay", verified: false },
  { id: 5, studentName: "Rohit P.", rollNo: "21ME002", department: "Mechanical", year: "3rd", section: "B", certificateName: "CAD Design", issueDate: "2025-09-05", type: "Course", issuer: "NPTEL", verified: true },
  { id: 6, studentName: "Priya Nair", rollNo: "21CSE002", department: "Computer Science", year: "3rd", section: "A", certificateName: "Web Development", issueDate: "2026-02-10", type: "Course", issuer: "Udemy", verified: false },
  { id: 7, studentName: "Anjali M.", rollNo: "21ECE001", department: "Electronics", year: "3rd", section: "A", certificateName: "IoT Workshop", issueDate: "2025-12-01", type: "Workshop", issuer: "IEEE", verified: true },
];

const announcementsData = [
  { id: 1, title: "Faculty Meeting", date: "Apr 5, 2026", content: "Monthly department heads meeting at 10:00 AM in Conference Hall.", tag: "MEETING", tagColor: "#3b82f6" },
  { id: 2, title: "Exam Schedule Released", date: "Apr 2, 2026", content: "End-semester timetable published on portal. Check your department schedule.", tag: "EXAM", tagColor: "#ef4444" },
  { id: 3, title: "Workshop on AI", date: "Apr 10, 2026", content: "Registration open for faculty development program on Artificial Intelligence.", tag: "EVENT", tagColor: "#f59e0b" },
  { id: 4, title: "Holiday Notice", date: "Mar 28, 2026", content: "College will remain closed on March 29th for Good Friday.", tag: "HOLIDAY", tagColor: "#22c55e" },
];

const reportsData = {
  attendance: { overall: 83.5, byDepartment: [{ dept: "Computer Science", percentage: 86, trend: "+2%" }, { dept: "Electronics", percentage: 82, trend: "+1%" }, { dept: "Mechanical", percentage: 78, trend: "-1%" }, { dept: "Civil Engg.", percentage: 88, trend: "+3%" }] },
  performance: { averageCGPA: 7.8, topPerformers: [{ name: "Kiran Raj", cgpa: 9.1, dept: "CSE" }, { name: "Sneha K.", cgpa: 8.9, dept: "CE" }, { name: "Arjun Ravi", cgpa: 8.4, dept: "CSE" }] }
};

// ─── Helper Components ────────────────────────────────────────────────────────

function StatCard({ icon, value, label, subtext, color, grad }) {
  return (
    <div style={{ background: grad, borderRadius: 16, padding: "20px 18px", border: "1px solid #1e3a52", transition: "all 0.2s" }}>
      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.9 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#7a9ab5", marginTop: 6, fontWeight: 600, letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#22c55e", marginTop: 8 }}>{subtext}</div>
    </div>
  );
}

function DepartmentRow({ name, attendance, students, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid #1e3a52" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#e0e8f0", marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 12, color: "#7a9ab5" }}>{students} students</div>
      </div>
      <div style={{ flex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, background: "#1a2c42", borderRadius: 8, height: 8 }}>
            <div style={{ width: `${attendance}%`, height: "100%", background: color, borderRadius: 8 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 40 }}>{attendance}%</span>
        </div>
      </div>
    </div>
  );
}

function AttendanceTrendChart({ months, data, t }) {
  const maxValue = Math.max(...data, 100);
  const chartHeight = 180;
  return (
    <div style={{ padding: "8px 0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, padding: "0 4px" }}>
        {months.map((month) => <div key={month} style={{ textAlign: "center", fontSize: 11, color: t.subtext, width: 40 }}>{month}</div>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: chartHeight, gap: 4 }}>
        {data.map((value, idx) => {
          const barHeight = (value / maxValue) * chartHeight;
          const barColor = value >= 85 ? "#22c55e" : value >= 75 ? "#f59e0b" : "#ef4444";
          return (
            <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", height: barHeight, background: `linear-gradient(to top, ${barColor}, ${barColor}aa)`, borderRadius: "6px 6px 4px 4px", transition: "height 0.4s ease" }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: barColor }}>{value}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeedbackStatistics({ t }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const departments = ["All", ...new Set(facultyFeedback.map(f => f.department))];
  const filteredFeedback = selectedDept === "All" ? facultyFeedback : facultyFeedback.filter(f => f.department === selectedDept);
  const getAverageRating = (ratings) => (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const getRatingColor = (rating) => { if (rating >= 4.5) return "#22c55e"; if (rating >= 4.0) return "#1a9e8f"; if (rating >= 3.5) return "#f59e0b"; if (rating >= 3.0) return "#f0a500"; return "#ef4444"; };
  const overallAvg = filteredFeedback.reduce((sum, f) => sum + parseFloat(getAverageRating(f.ratings)), 0) / filteredFeedback.length;
  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Faculty Feedback Analytics</div>
          <div style={{ fontSize: 13, color: t.subtext }}>Student evaluations and ratings</div>
        </div>
        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 13, cursor: "pointer" }}>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>
      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20, marginBottom: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#1a9e8f" }}>{overallAvg.toFixed(1)}</div>
          <div style={{ fontSize: 13, color: t.subtext }}>Overall Average Rating (out of 5)</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {filteredFeedback.map(faculty => {
            const avgRating = getAverageRating(faculty.ratings);
            const ratingColor = getRatingColor(avgRating);
            return (
              <div key={faculty.facultyId} style={{ background: t.rowBg, borderRadius: 12, padding: 16, border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{faculty.facultyName}</div>
                    <div style={{ fontSize: 11, color: t.subtext }}>{faculty.department}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: ratingColor }}>{avgRating}</div>
                    <div style={{ fontSize: 11, color: t.subtext }}>/ 5.0</div>
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: t.subtext, marginBottom: 4 }}>Rating Distribution</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(star => {
                      const count = faculty.ratings.filter(r => r === star).length;
                      const percentage = (count / faculty.ratings.length) * 100;
                      return (
                        <div key={star} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ height: 60, display: "flex", alignItems: "flex-end", marginBottom: 4 }}>
                            <div style={{ width: "100%", height: `${percentage}%`, background: ratingColor, borderRadius: 4, minHeight: 4 }} />
                          </div>
                          <div style={{ fontSize: 10, color: t.subtext }}>{star}★</div>
                          <div style={{ fontSize: 9, color: t.subtext }}>{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {faculty.comments.length > 0 && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${t.border}` }}>
                    <div style={{ fontSize: 11, color: t.subtext, fontWeight: 600, marginBottom: 4 }}>Sample Comments:</div>
                    <div style={{ fontSize: 11, color: t.text }}>"{faculty.comments[0]}"</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeeMonitoring({ t }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const departments = ["All", ...new Set(studentsData.map(s => s.department))];
  const years = ["All", ...new Set(studentsData.map(s => s.year))];
  const sections = ["All", "A", "B"];
  const filteredStudents = studentsData.filter(s => {
    if (selectedDept !== "All" && s.department !== selectedDept) return false;
    if (selectedYear !== "All" && s.year !== selectedYear) return false;
    if (selectedSection !== "All" && s.section !== selectedSection) return false;
    if (selectedStatus !== "All" && s.feeStatus !== selectedStatus) return false;
    return true;
  });
  const stats = { total: filteredStudents.length, paid: filteredStudents.filter(s => s.feeStatus === "paid").length, pending: filteredStudents.filter(s => s.feeStatus === "pending").length, overdue: filteredStudents.filter(s => s.feeStatus === "overdue").length, totalPendingAmount: filteredStudents.reduce((sum, s) => sum + s.pendingAmount, 0) };
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 16 }}>Fee Payment Status</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
          {[["💰", `₹${stats.totalPendingAmount.toLocaleString()}`, "Total Pending", "#3b82f6"], ["✅", stats.paid, "Paid Students", "#22c55e"], ["⏳", stats.pending, "Pending", "#f59e0b"], ["⚠️", stats.overdue, "Overdue", "#ef4444"]].map(([icon, val, label, color]) => (
            <div key={label} style={{ background: t.panelBg, borderRadius: 12, padding: 16, border: `1px solid ${t.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 28, color }}>{icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 12, color: t.subtext }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Departments</option>{departments.slice(1).map(d => <option key={d} value={d}>{d}</option>)}</select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Years</option>{years.slice(1).map(y => <option key={y} value={y}>{y}</option>)}</select>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Sections</option>{sections.slice(1).map(s => <option key={s} value={s}>Section {s}</option>)}</select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Status</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option></select>
        </div>
      </div>
      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.tableHead }}>
              {["Name","Roll No","Dept/Section","Year","Status","Pending Amount","Action"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: h === "Pending Amount" ? "right" : h === "Action" ? "center" : "left", fontSize: 12, color: t.subtext }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr key={student.id} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                <td style={{ padding: "12px 16px", color: t.text }}>{student.name}</td>
                <td style={{ padding: "12px 16px", color: t.subtext }}>{student.rollNo}</td>
                <td style={{ padding: "12px 16px", color: t.subtext }}>{student.department} - {student.section}</td>
                <td style={{ padding: "12px 16px", color: t.subtext }}>{student.year}</td>
                <td style={{ padding: "12px 16px" }}><span style={{ background: student.feeStatus === "paid" ? "#22c55e22" : student.feeStatus === "pending" ? "#f59e0b22" : "#ef444422", color: student.feeStatus === "paid" ? "#22c55e" : student.feeStatus === "pending" ? "#f59e0b" : "#ef4444", padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{student.feeStatus.toUpperCase()}</span></td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: student.pendingAmount > 0 ? "#ef4444" : "#22c55e" }}>₹{student.pendingAmount.toLocaleString()}</td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}><button style={{ background: "#1a9e8f22", border: "none", color: "#1a9e8f", padding: "4px 12px", borderRadius: 6, cursor: "pointer" }}>Send Reminder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaveODMonitoring({ t }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const departments = ["All", ...new Set(leaveRequests.map(l => l.department))];
  const filteredRequests = leaveRequests.filter(req => {
    if (selectedDept !== "All" && req.department !== selectedDept) return false;
    if (selectedStatus !== "All" && req.status !== selectedStatus) return false;
    if (selectedType !== "All" && req.type !== selectedType) return false;
    return true;
  });
  const stats = { total: filteredRequests.length, pending: filteredRequests.filter(r => r.status === "Pending").length, approved: filteredRequests.filter(r => r.status === "Approved").length, rejected: filteredRequests.filter(r => r.status === "Rejected").length };
  const handleStatusUpdate = (id, newStatus) => alert(`Request #${id} status updated to ${newStatus}`);
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 16 }}>Leave & OD Requests</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[["Total Requests", stats.total, "#3b82f6"], ["Pending", stats.pending, "#f59e0b"], ["Approved", stats.approved, "#22c55e"], ["Rejected", stats.rejected, "#ef4444"]].map(([label, val, color]) => (
            <div key={label} style={{ background: t.panelBg, borderRadius: 12, padding: 12, border: `1px solid ${t.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 11, color: t.subtext }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Departments</option>{departments.slice(1).map(d => <option key={d} value={d}>{d}</option>)}</select>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Types</option><option value="Leave">Leave</option><option value="OD">OD</option></select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Status</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select>
        </div>
      </div>
      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.tableHead }}>
              {["Student","Dept/Section","Type","Dates","Reason","Status","Actions"].map(h => <th key={h} style={{ padding: "12px 12px", textAlign: h === "Actions" ? "center" : "left", fontSize: 11, color: t.subtext }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req, idx) => (
              <tr key={req.id} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                <td style={{ padding: "12px 12px" }}><div style={{ fontWeight: 600, color: t.text }}>{req.studentName}</div><div style={{ fontSize: 10, color: t.subtext }}>{req.rollNo}</div></td>
                <td style={{ padding: "12px 12px", color: t.subtext }}>{req.department}<br/>{req.year} - {req.section}</td>
                <td style={{ padding: "12px 12px", color: t.text }}>{req.type}</td>
                <td style={{ padding: "12px 12px", fontSize: 12, color: t.subtext }}>{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</td>
                <td style={{ padding: "12px 12px", fontSize: 12, color: t.subtext }}>{req.reason}</td>
                <td style={{ padding: "12px 12px" }}><span style={{ background: req.status === "Approved" ? "#22c55e22" : req.status === "Pending" ? "#f59e0b22" : "#ef444422", color: req.status === "Approved" ? "#22c55e" : req.status === "Pending" ? "#f59e0b" : "#ef4444", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{req.status}</span></td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {req.status === "Pending" && (<><button onClick={() => handleStatusUpdate(req.id, "Approved")} style={{ background: "#22c55e22", border: "none", color: "#22c55e", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Approve</button><button onClick={() => handleStatusUpdate(req.id, "Rejected")} style={{ background: "#ef444422", border: "none", color: "#ef4444", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Reject</button></>)}
                    {req.document && <button style={{ background: "#3b82f622", border: "none", color: "#3b82f6", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>View Doc</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CertificatesMonitoring({ t }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const departments = ["All", ...new Set(certificatesData.map(c => c.department))];
  const years = ["All", ...new Set(certificatesData.map(c => c.year))];
  const types = ["All", ...new Set(certificatesData.map(c => c.type))];
  const filteredCertificates = certificatesData.filter(cert => {
    if (selectedDept !== "All" && cert.department !== selectedDept) return false;
    if (selectedYear !== "All" && cert.year !== selectedYear) return false;
    if (selectedSection !== "All" && cert.section !== selectedSection) return false;
    if (selectedType !== "All" && cert.type !== selectedType) return false;
    return true;
  });
  const stats = { total: filteredCertificates.length, verified: filteredCertificates.filter(c => c.verified).length, pendingVerification: filteredCertificates.filter(c => !c.verified).length, byType: filteredCertificates.reduce((acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {}) };
  const handleVerify = (id) => alert(`Certificate #${id} verification status updated`);
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 16 }}>Student Certificates</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          <div style={{ background: t.panelBg, borderRadius: 12, padding: 12, border: `1px solid ${t.border}`, textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 700, color: "#3b82f6" }}>{stats.total}</div><div style={{ fontSize: 11, color: t.subtext }}>Total Certificates</div></div>
          <div style={{ background: t.panelBg, borderRadius: 12, padding: 12, border: `1px solid ${t.border}`, textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>{stats.verified}</div><div style={{ fontSize: 11, color: t.subtext }}>Verified</div></div>
          <div style={{ background: t.panelBg, borderRadius: 12, padding: 12, border: `1px solid ${t.border}`, textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b" }}>{stats.pendingVerification}</div><div style={{ fontSize: 11, color: t.subtext }}>Pending Verification</div></div>
          <div style={{ background: t.panelBg, borderRadius: 12, padding: 12, border: `1px solid ${t.border}`, textAlign: "center" }}><div style={{ fontSize: 13, color: t.subtext, marginBottom: 4 }}>By Type</div><div style={{ fontSize: 11, color: t.text }}>{Object.entries(stats.byType).map(([k,v]) => `${k}: ${v}`).join(", ")}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Departments</option>{departments.slice(1).map(d => <option key={d} value={d}>{d}</option>)}</select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Years</option>{years.slice(1).map(y => <option key={y} value={y}>{y}</option>)}</select>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Sections</option><option value="A">Section A</option><option value="B">Section B</option></select>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Types</option>{types.slice(1).map(tp => <option key={tp} value={tp}>{tp}</option>)}</select>
        </div>
      </div>
      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.tableHead }}>
              {["Student","Dept/Section","Certificate","Type","Issue Date","Issuer","Status","Action"].map(h => <th key={h} style={{ padding: "12px 12px", textAlign: h === "Action" ? "center" : "left", fontSize: 11, color: t.subtext }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.map((cert, idx) => (
              <tr key={cert.id} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                <td style={{ padding: "12px 12px" }}><div style={{ fontWeight: 600, color: t.text }}>{cert.studentName}</div><div style={{ fontSize: 10, color: t.subtext }}>{cert.rollNo}</div></td>
                <td style={{ padding: "12px 12px", color: t.subtext }}>{cert.department}<br/>{cert.year} - {cert.section}</td>
                <td style={{ padding: "12px 12px", color: t.text }}>{cert.certificateName}</td>
                <td style={{ padding: "12px 12px" }}><span style={{ background: "#3b82f622", color: "#3b82f6", padding: "2px 8px", borderRadius: 12, fontSize: 11 }}>{cert.type}</span></td>
                <td style={{ padding: "12px 12px", fontSize: 12, color: t.subtext }}>{new Date(cert.issueDate).toLocaleDateString()}</td>
                <td style={{ padding: "12px 12px", fontSize: 12, color: t.subtext }}>{cert.issuer}</td>
                <td style={{ padding: "12px 12px" }}><span style={{ background: cert.verified ? "#22c55e22" : "#f59e0b22", color: cert.verified ? "#22c55e" : "#f59e0b", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{cert.verified ? "Verified" : "Pending"}</span></td>
                <td style={{ padding: "12px 12px", textAlign: "center" }}>{!cert.verified && <button onClick={() => handleVerify(cert.id)} style={{ background: "#1a9e8f22", border: "none", color: "#1a9e8f", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Verify</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimetableManagement({ t }) {
  const [timetable, setTimetable] = useState(initialTimetable);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
  const [newEntry, setNewEntry] = useState({ day: "Monday", time: "09:00-10:00", subject: "", faculty: "", department: "", year: "", section: "", room: "" });
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const departments = ["All", ...new Set(timetable.map(t => t.department))];
  const years = ["All","1st","2nd","3rd","4th"];
  const sections = ["All","A","B"];
  const faculties = facultyData.map(f => f.name);
  const timeSlots = ["09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","14:00-15:00","15:00-16:00","16:00-17:00"];
  const filteredTimetable = timetable.filter(entry => {
    if (selectedDay !== "All" && entry.day !== selectedDay) return false;
    if (selectedDepartment !== "All" && entry.department !== selectedDepartment) return false;
    if (selectedYear !== "All" && entry.year !== selectedYear) return false;
    if (selectedSection !== "All" && entry.section !== selectedSection) return false;
    return true;
  });
  const checkConflicts = (ne) => {
    const conflicts = [];
    if (timetable.find(e => e.day === ne.day && e.time === ne.time && e.faculty === ne.faculty)) conflicts.push(`Faculty ${ne.faculty} already has a class at this time`);
    if (timetable.find(e => e.day === ne.day && e.time === ne.time && e.room === ne.room)) conflicts.push(`Room ${ne.room} is already occupied`);
    if (timetable.find(e => e.day === ne.day && e.time === ne.time && e.department === ne.department && e.year === ne.year && e.section === ne.section)) conflicts.push(`This class group already has a class at this time`);
    return conflicts;
  };
  const handleAddEntry = () => {
    if (!newEntry.subject || !newEntry.faculty || !newEntry.department || !newEntry.year || !newEntry.section || !newEntry.room) { setConflictMessage("Please fill all fields"); return; }
    const conflicts = checkConflicts(newEntry);
    if (conflicts.length > 0) { setConflictMessage(`⚠️ Conflicts detected:\n${conflicts.join("\n")}`); return; }
    setTimetable([...timetable, { id: Date.now(), ...newEntry }]);
    setNewEntry({ day: "Monday", time: "09:00-10:00", subject: "", faculty: "", department: "", year: "", section: "", room: "" });
    setShowAddForm(false); setConflictMessage("");
  };
  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Timetable Management</div>
          <div style={{ fontSize: 13, color: t.subtext }}>Schedule classes with automatic conflict detection</div>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{showAddForm ? "Cancel" : "+ Add Class"}</button>
      </div>
      {showAddForm && (
        <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: t.text }}>Add New Class</div>
          {conflictMessage && <div style={{ background: "#ef444422", color: "#ef4444", padding: 12, borderRadius: 8, marginBottom: 16, whiteSpace: "pre-line", fontSize: 13 }}>{conflictMessage}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <select value={newEntry.day} onChange={e => setNewEntry({...newEntry, day: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select value={newEntry.time} onChange={e => setNewEntry({...newEntry, time: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}>{timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}</select>
            <input placeholder="Subject" value={newEntry.subject} onChange={e => setNewEntry({...newEntry, subject: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }} />
            <select value={newEntry.faculty} onChange={e => setNewEntry({...newEntry, faculty: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="">Select Faculty</option>{faculties.map(f => <option key={f} value={f}>{f}</option>)}</select>
            <select value={newEntry.department} onChange={e => setNewEntry({...newEntry, department: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="">Select Department</option>{departments.slice(1).map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select value={newEntry.year} onChange={e => setNewEntry({...newEntry, year: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="">Select Year</option>{years.slice(1).map(y => <option key={y} value={y}>{y}</option>)}</select>
            <select value={newEntry.section} onChange={e => setNewEntry({...newEntry, section: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="">Select Section</option>{sections.slice(1).map(s => <option key={s} value={s}>{s}</option>)}</select>
            <input placeholder="Room Number" value={newEntry.room} onChange={e => setNewEntry({...newEntry, room: e.target.value})} style={{ padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }} />
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}><button onClick={handleAddEntry} style={{ background: "#1a9e8f", border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Add to Timetable</button></div>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Days</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Departments</option>{departments.slice(1).map(d => <option key={d} value={d}>{d}</option>)}</select>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Years</option>{years.slice(1).map(y => <option key={y} value={y}>{y}</option>)}</select>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text }}><option value="All">All Sections</option>{sections.slice(1).map(s => <option key={s} value={s}>Section {s}</option>)}</select>
      </div>
      <div style={{ background: t.panelBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.tableHead }}>
              {["Day","Time","Subject","Faculty","Department","Year/Sec","Room","Action"].map(h => <th key={h} style={{ padding: "12px", textAlign: h === "Action" ? "center" : "left", fontSize: 12, color: t.subtext }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredTimetable.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: t.subtext }}>No classes scheduled</td></tr>
            ) : (
              filteredTimetable.map((entry, idx) => (
                <tr key={entry.id} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                  <td style={{ padding: "12px", color: t.text }}>{entry.day}</td>
                  <td style={{ padding: "12px", color: t.subtext }}>{entry.time}</td>
                  <td style={{ padding: "12px", fontWeight: 600, color: t.text }}>{entry.subject}</td>
                  <td style={{ padding: "12px", color: t.subtext }}>{entry.faculty}</td>
                  <td style={{ padding: "12px", color: t.subtext }}>{entry.department}</td>
                  <td style={{ padding: "12px", color: t.subtext }}>{entry.year} - {entry.section}</td>
                  <td style={{ padding: "12px", color: t.subtext }}>{entry.room}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}><button onClick={() => setTimetable(timetable.filter(e => e.id !== entry.id))} style={{ background: "#ef444422", border: "none", color: "#ef4444", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IMSBot({ t }) {
  const [messages, setMessages] = useState([{ role: "bot", text: "👋 Hi Admin! I'm the **IMS Bot**, your AI campus assistant.\n\nI can help with attendance, timetable, exam dates, announcements, student records, fee status, leave requests, certificates, and more. What would you like to know?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const quickQuestions = ["Total students in college?","Average attendance?","Fee collection summary?","Pending leave requests?","Faculty feedback summary?","Certificate verification status?"];
  const handleSend = (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text: userText, time }]);
    setInput(""); setLoading(true);
    setTimeout(() => {
      const lq = userText.toLowerCase();
      let botReply = "";
      if (lq.includes("total student") || lq.includes("how many student")) {
        botReply = `📊 **Student Statistics**\n\nTotal Students: **${studentsData.length}**\n\nFee Status:\n• Paid: ${studentsData.filter(s=>s.feeStatus==="paid").length}\n• Pending: ${studentsData.filter(s=>s.feeStatus==="pending").length}\n• Overdue: ${studentsData.filter(s=>s.feeStatus==="overdue").length}`;
      } else if (lq.includes("attendance")) {
        botReply = `📈 **Attendance Overview**\n\nOverall: **${reportsData.attendance.overall}%**\n\n${reportsData.attendance.byDepartment.map(d=>`• ${d.dept}: ${d.percentage}% ${d.trend}`).join("\n")}`;
      } else if (lq.includes("fee") || lq.includes("collection")) {
        const total = studentsData.reduce((s,st)=>s+st.pendingAmount,0);
        botReply = `💰 **Fee Summary**\n\nTotal Pending: ₹${total.toLocaleString()}\n• Pending: ${studentsData.filter(s=>s.feeStatus==="pending").length} students\n• Overdue: ${studentsData.filter(s=>s.feeStatus==="overdue").length} students`;
      } else if (lq.includes("leave")) {
        const pending = leaveRequests.filter(r=>r.status==="Pending");
        botReply = `📋 **Pending Requests** (${pending.length})\n\n${pending.map(l=>`• ${l.studentName} - ${l.type}: ${l.reason}`).join("\n")}`;
      } else if (lq.includes("feedback") || lq.includes("rating")) {
        const avg = facultyFeedback.map(f=>({name:f.facultyName,avg:(f.ratings.reduce((a,b)=>a+b,0)/f.ratings.length).toFixed(1)})).sort((a,b)=>b.avg-a.avg);
        botReply = `⭐ **Top Rated Faculty**\n\n${avg.slice(0,3).map((f,i)=>`${i+1}. ${f.name} - ${f.avg}/5.0`).join("\n")}`;
      } else if (lq.includes("certificate")) {
        const pending = certificatesData.filter(c=>!c.verified);
        botReply = `📜 **Pending Certificates** (${pending.length})\n\n${pending.map(c=>`• ${c.studentName} - ${c.certificateName}`).join("\n") || "All verified!"}`;
      } else {
        botReply = `I can help you with:\n• Student statistics & fee status\n• Attendance data\n• Faculty feedback\n• Leave/OD requests\n• Certificate verification\n\nWhat would you like to know, Admin?`;
      }
      setMessages(prev => [...prev, { role: "bot", text: botReply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setLoading(false);
    }, 1000);
  };
  const formatText = (text) => text.split("\n").map((line, i, arr) => (
    <span key={i}>{line.split(/\*\*(.*?)\*\*/g).map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}{i < arr.length - 1 && <br />}</span>
  ));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <div style={{ background: t.panelBg, borderRadius: "14px 14px 0 0", border: `1px solid ${t.border}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>IMS Bot (Admin)</div>
            <div style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> Online · Admin Access</div>
          </div>
        </div>
        <button onClick={() => setMessages([messages[0]])} style={{ background: t.input, border: `1px solid ${t.border}`, color: t.text, borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>Clear Chat</button>
      </div>
      <div style={{ background: t.input, borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`, padding: "10px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {quickQuestions.map((q, i) => <button key={i} onClick={() => handleSend(q)} style={{ background: t.rowBg, border: `1px solid ${t.border}`, color: t.subtext, borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{q}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", background: t.bg, borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end" }}>
            {msg.role === "bot" && <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>}
            <div style={{ maxWidth: "70%" }}>
              <div style={{ background: msg.role === "user" ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.panelBg, border: msg.role === "bot" ? `1px solid ${t.border}` : "none", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.6, color: t.text }}>{formatText(msg.text)}</div>
              <div style={{ fontSize: 11, color: t.subtext, marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
            </div>
            {msg.role === "user" && <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0, color: "#fff" }}>AD</div>}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div style={{ background: t.panelBg, border: `1px solid ${t.border}`, borderRadius: "14px 14px 14px 4px", padding: "14px 18px", display: "flex", gap: 5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a9e8f", animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}
            </div>
          </div>
        )}
      </div>
      <div style={{ background: t.panelBg, border: `1px solid ${t.border}`, borderRadius: "0 0 14px 14px", padding: "14px 16px", display: "flex", gap: 10, alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask about students, fees, leaves, certificates, feedback..." style={{ flex: 1, background: t.input, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 16px", color: t.text, fontSize: 14, outline: "none" }} />
        <button onClick={() => handleSend()} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: 10, border: "none", background: input.trim() && !loading ? "linear-gradient(135deg,#1a9e8f,#17b897)" : t.input, color: "#fff", fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

function StudentProfileModal({ student, onClose, t }) {
  if (!student) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: t.bg, borderRadius: 20, width: 500, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${t.border}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 25, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff" }}>{student.name.charAt(0)}</div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{student.name}</div><div style={{ fontSize: 12, color: t.subtext }}>{student.rollNo}</div></div>
          </div>
          <button onClick={onClose} style={{ background: "#ef444422", border: "none", borderRadius: 8, padding: "6px 12px", color: "#ef4444", cursor: "pointer" }}>✕ Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
          {[["Department:", student.department], ["Year & Section:", `${student.year} Year - Section ${student.section}`], ["Email:", student.email], ["Phone:", student.phone], ["Parent Contact:", student.parentContact], ["Date of Birth:", student.dob], ["Address:", student.address]].map(([label, val]) => (
            <React.Fragment key={label}>
              <div style={{ color: t.subtext }}>{label}</div>
              <div style={{ color: t.text, fontWeight: 500 }}>{val}</div>
            </React.Fragment>
          ))}
          <div style={{ color: t.subtext }}>Attendance:</div><div style={{ color: student.attendance >= 75 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{student.attendance}%</div>
          <div style={{ color: t.subtext }}>CGPA:</div><div style={{ color: student.cgpa >= 8 ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>{student.cgpa}</div>
          <div style={{ color: t.subtext }}>Fee Status:</div><div style={{ color: student.feeStatus === "paid" ? "#22c55e" : student.feeStatus === "pending" ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{student.feeStatus.toUpperCase()} {student.pendingAmount > 0 ? `(₹${student.pendingAmount.toLocaleString()})` : ""}</div>
        </div>
      </div>
    </div>
  );
}

function FacultyProfileModal({ faculty, onClose, t }) {
  if (!faculty) return null;
  const feedback = facultyFeedback.find(f => f.facultyName === faculty.name);
  const avgRating = feedback ? (feedback.ratings.reduce((a,b) => a+b,0) / feedback.ratings.length).toFixed(1) : "N/A";
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: t.bg, borderRadius: 20, width: 500, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${t.border}`, paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 25, background: "linear-gradient(135deg,#a855f7,#6b21a5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff" }}>{faculty.name.charAt(0)}</div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{faculty.name}</div><div style={{ fontSize: 12, color: t.subtext }}>{faculty.designation}</div></div>
          </div>
          <button onClick={onClose} style={{ background: "#ef444422", border: "none", borderRadius: 8, padding: "6px 12px", color: "#ef4444", cursor: "pointer" }}>✕ Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
          {[["Department:", faculty.department], ["Qualification:", faculty.qualification], ["Experience:", faculty.experience], ["Specialization:", faculty.specialization], ["Email:", faculty.email], ["Phone:", faculty.phone]].map(([label, val]) => (
            <React.Fragment key={label}>
              <div style={{ color: t.subtext }}>{label}</div>
              <div style={{ color: t.text, fontWeight: 500 }}>{val}</div>
            </React.Fragment>
          ))}
          <div style={{ color: t.subtext }}>Average Rating:</div><div style={{ color: "#f59e0b", fontWeight: 700 }}>{avgRating} / 5.0</div>
        </div>
        {feedback && feedback.comments.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Student Feedback Comments:</div>
            {feedback.comments.map((comment, i) => <div key={i} style={{ fontSize: 12, color: t.subtext, padding: "4px 0" }}>• "{comment}"</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

function AdminDashboard({ onLogout, isDark, toggleTheme, t }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", tag: "GENERAL" });
  const [localAnnouncements, setLocalAnnouncements] = useState(announcementsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;
    const tagColors = { "URGENT":"#ef4444","EVENT":"#f59e0b","ACADEMIC":"#3b82f6","MEETING":"#3b82f6","EXAM":"#ef4444","HOLIDAY":"#22c55e","GENERAL":"#1a9e8f" };
    setLocalAnnouncements([{ id: Date.now(), title: newAnnouncement.title, content: newAnnouncement.content, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), tag: newAnnouncement.tag, tagColor: tagColors[newAnnouncement.tag] || "#7a9ab5" }, ...localAnnouncements]);
    setNewAnnouncement({ title: "", content: "", tag: "GENERAL" });
  };

  const [liveAdminStats, setLiveAdminStats] = useState({
    overallPercentage: 0,
    departmentStats: {},
    studentStats: []
  });

  useEffect(() => {
    api.getAdminAttendanceStats()
      .then(res => setLiveAdminStats(res))
      .catch(err => console.error("Admin stats fetch failed", err));
  }, []);

  const stats = [
    { icon: "👥", value: liveAdminStats.studentStats.length.toLocaleString(), label: "TOTAL STUDENTS", subtext: "MySQL Database", color: "#3b82f6", grad: "linear-gradient(135deg,#0d2040,#101e2e)" },
    { icon: "🏫", value: "—", label: "TOTAL FACULTY", subtext: "MySQL Database", color: "#a855f7", grad: "linear-gradient(135deg,#2d1a52,#101e2e)" },
    { icon: "📊", value: `${Math.round(liveAdminStats.overallPercentage)}%`, label: "AVG ATTENDANCE", subtext: "MySQL Database", color: "#22c55e", grad: "linear-gradient(135deg,#0d3d1e,#101e2e)" },
    { icon: "🏛️", value: Object.keys(liveAdminStats.departmentStats).length, label: "DEPARTMENTS", subtext: "MySQL Database", color: "#f59e0b", grad: "linear-gradient(135deg,#3d2a00,#101e2e)" },
  ];

  const filteredStudents = liveAdminStats.studentStats.filter(s => 
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (s.department && s.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredFaculty = facultyData.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.department.toLowerCase().includes(searchTerm.toLowerCase()));

  const navItems = [
    { id: "overview", label: "Dashboard", icon: "📊", section: "MAIN" },
    { id: "students", label: "Students", icon: "👥", section: "MANAGEMENT" },
    { id: "faculty", label: "Faculty", icon: "🏫", section: "MANAGEMENT" },
    { id: "departments", label: "Departments", icon: "🏛️", section: "MANAGEMENT" },
    { id: "timetable", label: "Timetable", icon: "📅", section: "MANAGEMENT" },
    { id: "exam-seating-allotment", label: "Exam Seating", icon: "🪑", section: "MANAGEMENT" },
    { id: "feedback", label: "Feedback Stats", icon: "⭐", section: "ANALYTICS" },
    { id: "fee-monitoring", label: "Fee Monitoring", icon: "💰", section: "FINANCE" },
    { id: "leave-monitoring", label: "Leave/OD", icon: "📋", section: "REQUESTS" },
    { id: "certificates", label: "Certificates", icon: "🏆", section: "REQUESTS" },
    { id: "announcements", label: "Announcements", icon: "📢", section: "MANAGEMENT" },
    { id: "reports", label: "Reports", icon: "📈", section: "ANALYTICS" },
    { id: "imsbot", label: "IMS Bot", icon: "🤖", section: "TOOLS" },
  ];

  const sections = ["MAIN", "MANAGEMENT", "ANALYTICS", "FINANCE", "REQUESTS", "TOOLS"];

  const tabTitles = {
    overview: "Admin Dashboard", students: "Student Management", faculty: "Faculty Management",
    departments: "Department Management", timetable: "Timetable Management",
    "exam-seating-allotment": "Exam Seating Allotment",
    feedback: "Faculty Feedback Analytics", "fee-monitoring": "Fee Payment Monitoring",
    "leave-monitoring": "Leave & OD Requests", certificates: "Student Certificates",
    announcements: "Announcements", reports: "Reports & Analytics", imsbot: "IMS Bot Assistant",
  };

  const tabSubtitles = {
    overview: "Institution-wide overview and management.",
    students: "Manage student records, attendance, and performance.",
    faculty: "Manage faculty information and assignments.",
    departments: "View and manage all academic departments.",
    timetable: "Schedule classes with automatic conflict detection.",
    "exam-seating-allotment": "Generate and manage exam seating allocations for 1000+ students.",
    feedback: "Analyze faculty feedback and student ratings.",
    "fee-monitoring": "Track student fee payments by department and section.",
    "leave-monitoring": "Monitor and manage leave and OD requests.",
    certificates: "Verify and manage student certificates.",
    announcements: "Create and manage institution-wide notices.",
    reports: "View analytics and generate reports.",
    imsbot: "AI-powered assistant for instant information.",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: t.bg, fontFamily: "'Segoe UI', sans-serif", color: t.text, overflow: "hidden", transition: "all 0.3s" }}>
      <aside style={{ width: 260, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 28px" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>MS</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>CollegeIMS</div>
            <div style={{ fontSize: 11, color: t.subtext }}>Admin Portal</div>
          </div>
        </div>
        <div style={{ marginBottom: 24, padding: "0 20px" }}>
          <div style={{ background: t.navActive, borderRadius: 12, padding: "12px 16px", border: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a9e8f,#0e6e9e)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>AD</div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Admin User</div><div style={{ fontSize: 11, color: t.subtext }}>ADMIN01</div></div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontSize: 10, color: t.sectionLabel, fontWeight: 700, letterSpacing: 1, padding: "12px 20px 4px" }}>{sec}</div>
              {navItems.filter(n => n.section === sec).map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 20px", border: "none", background: activeTab === item.id ? t.navActive : "transparent", color: activeTab === item.id ? t.text : t.subtext, borderLeft: activeTab === item.id ? `3px solid #1a9e8f` : "3px solid transparent", cursor: "pointer", fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400, transition: "all 0.15s" }}>
                  <span style={{ fontSize: 17, minWidth: 22 }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.id === "imsbot" && <span style={{ marginLeft: "auto", background: "#1a9e8f", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>AI</span>}
                  {item.id === "exam-seating-allotment" && <span style={{ marginLeft: "auto", background: "#3b82f6", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>NEW</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: "20px" }}><ThemeToggle isDark={isDark} toggleTheme={toggleTheme} t={t} /></div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 20px", border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          <span style={{ fontSize: 18 }}>🚪</span><span>Logout</span>
        </button>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        <header style={{ padding: "20px 32px", borderBottom: `1px solid ${t.border}`, background: t.sidebar, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: t.text }}>{tabTitles[activeTab] || ""}</h1>
            <p style={{ fontSize: 13, color: t.subtext, margin: "4px 0 0" }}>{tabSubtitles[activeTab] || ""}</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <span>🔍</span>
              <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: t.text, fontSize: 13, width: 160 }} />
            </div>
            <div style={{ fontSize: 20, cursor: "pointer" }}>🔔</div>
          </div>
        </header>

        <div style={{ padding: activeTab === "exam-seating-allotment" ? 0 : 28, flex: 1, overflowY: "auto" }}>
          {activeTab === "exam-seating-allotment" && (
            <div style={{ padding: 24 }}>
              <ExamSeatingAllotment />
            </div>
          )}

          {activeTab === "overview" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
                {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
                <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, padding: "20px 20px 16px" }}>
                  <div style={{ marginBottom: 16 }}><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Monthly Attendance Trend</div><div style={{ fontSize: 12, color: t.subtext }}>Institution-wide 2024</div></div>
                  <AttendanceTrendChart months={monthlyAttendance.months} data={monthlyAttendance.avgAttendance} t={t} />
                </div>
                <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, padding: "20px" }}>
                  <div style={{ marginBottom: 16 }}><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Department Overview</div><div style={{ fontSize: 12, color: t.subtext }}>Current academic year</div></div>
                  {Object.entries(liveAdminStats.departmentStats).map(([dept, pct], idx) => (
                    <DepartmentRow key={idx} name={dept} attendance={Math.round(pct)} students={liveAdminStats.studentStats.filter(s => s.department === dept).length} color={pct >= 85 ? "#22c55e" : pct >= 75 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </div>
              </div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Recent Announcements</div><div style={{ fontSize: 12, color: t.subtext }}>Latest updates and notices</div></div>
                  <button onClick={() => setActiveTab("announcements")} style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View All</button>
                </div>
                {localAnnouncements.slice(0, 3).map(ann => (
                  <div key={ann.id} style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ background: `${ann.tagColor}22`, color: ann.tagColor, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 12 }}>{ann.tag}</span>
                      <span style={{ fontSize: 12, color: t.subtext }}>{ann.date}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>{ann.title}</div>
                    <div style={{ fontSize: 13, color: t.subtext }}>{ann.content}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "students" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button onClick={exportAttendanceToCSV} style={{ background: "#22c55e", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  📊 Export Attendance to CSV
                </button>
              </div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Student Records</div><div style={{ fontSize: 12, color: t.subtext }}>Total: {liveAdminStats.studentStats.length} students</div></div>
                  <button style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Student</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.tableHead }}>
                        {["Name","Roll No","Department","Section","Year","Attendance","CGPA","Fee Status","Actions"].map(h => <th key={h} style={{ padding: "14px 16px", textAlign: h === "Actions" ? "center" : "left", fontSize: 12, color: t.subtext }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, idx) => (
                        <tr key={student.id || idx} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: t.text }}>{student.name}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>{student.studentId}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>{student.department || "General"}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>—</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>—</td>
                          <td style={{ padding: "14px 16px" }}><span style={{ color: student.percentage >= 75 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{Math.round(student.percentage)}%</span></td>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "#22c55e" }}>—</td>
                          <td style={{ padding: "14px 16px" }}>—</td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <button onClick={() => setSelectedStudent(student)} style={{ background: "#3b82f622", border: "none", color: "#3b82f6", padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginRight: 8 }}>View</button>
                            <button style={{ background: "#ef444422", border: "none", color: "#ef4444", padding: "4px 12px", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faculty" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button onClick={exportFacultyToCSV} style={{ background: "#22c55e", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  📊 Export Faculty to CSV
                </button>
              </div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Faculty Records</div><div style={{ fontSize: 12, color: t.subtext }}>Total: {facultyData.length} faculty members</div></div>
                  <button style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Faculty</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.tableHead }}>
                        {["Name","Department","Designation","Qualification","Experience","Actions"].map(h => <th key={h} style={{ padding: "14px 16px", textAlign: h === "Actions" ? "center" : "left", fontSize: 12, color: t.subtext }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFaculty.map((faculty, idx) => (
                        <tr key={faculty.id} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: t.text }}>{faculty.name}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>{faculty.department}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>{faculty.designation}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>{faculty.qualification}</td>
                          <td style={{ padding: "14px 16px", color: t.subtext }}>{faculty.experience}</td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            <button onClick={() => setSelectedFaculty(faculty)} style={{ background: "#3b82f622", border: "none", color: "#3b82f6", padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginRight: 8 }}>View</button>
                            <button style={{ background: "#ef444422", border: "none", color: "#ef4444", padding: "4px 12px", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "departments" && (
            <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Department Details</div><div style={{ fontSize: 12, color: t.subtext }}>All academic departments with performance metrics</div></div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: t.tableHead }}>
                      {["Department","Code","Students","Faculty","Attendance","HOD","Established"].map(h => <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: t.subtext }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept, idx) => (
                      <tr key={dept.id} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : t.rowBg }}>
                        <td style={{ padding: "14px 16px", fontWeight: 600, color: t.text }}>{dept.name}</td>
                        <td style={{ padding: "14px 16px", color: t.subtext }}>{dept.code}</td>
                        <td style={{ padding: "14px 16px", color: t.subtext }}>{dept.students}</td>
                        <td style={{ padding: "14px 16px", color: t.subtext }}>{dept.faculty}</td>
                        <td style={{ padding: "14px 16px" }}><span style={{ color: dept.attendance >= 80 ? "#22c55e" : "#f59e0b", fontWeight: 600 }}>{dept.attendance}%</span></td>
                        <td style={{ padding: "14px 16px", color: t.subtext }}>{dept.hod}</td>
                        <td style={{ padding: "14px 16px", color: t.subtext }}>{dept.established}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "timetable" && <TimetableManagement t={t} />}
          {activeTab === "feedback" && <FeedbackStatistics t={t} />}
          {activeTab === "fee-monitoring" && <FeeMonitoring t={t} />}
          {activeTab === "leave-monitoring" && <LeaveODMonitoring t={t} />}
          {activeTab === "certificates" && <CertificatesMonitoring t={t} />}
          {activeTab === "imsbot" && <IMSBot t={t} />}

          {activeTab === "announcements" && (
            <div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden", marginBottom: 24 }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>All Announcements</div><div style={{ fontSize: 12, color: t.subtext }}>Manage institution-wide notices</div></div>
                <div>
                  {localAnnouncements.length === 0 ? <div style={{ padding: "60px", textAlign: "center", color: t.subtext }}>No announcements to display</div> : localAnnouncements.map(ann => (
                    <div key={ann.id} style={{ borderBottom: `1px solid ${t.border}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <span style={{ background: `${ann.tagColor}22`, color: ann.tagColor, fontSize: 10, fontWeight: 700, padding: "2px 12px", borderRadius: 20 }}>{ann.tag}</span>
                          <span style={{ fontSize: 12, color: t.subtext }}>{ann.date}</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 6 }}>{ann.title}</div>
                        <div style={{ fontSize: 13, color: t.subtext, lineHeight: 1.5 }}>{ann.content}</div>
                      </div>
                      <button onClick={() => setLocalAnnouncements(prev => prev.filter(a => a.id !== ann.id))} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, padding: "4px 8px", borderRadius: 6 }}>🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, padding: "24px" }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: t.text }}>➕ Add New Announcement</div>
                <div style={{ display: "grid", gap: 16 }}>
                  <input type="text" placeholder="Announcement Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, outline: "none" }} />
                  <textarea placeholder="Announcement Content" rows={3} value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} style={{ padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none" }} />
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <select value={newAnnouncement.tag} onChange={e => setNewAnnouncement({ ...newAnnouncement, tag: e.target.value })} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontSize: 13, outline: "none" }}>
                      <option value="GENERAL">📌 General</option><option value="URGENT">⚠️ Urgent</option><option value="EVENT">🎉 Event</option>
                      <option value="ACADEMIC">📚 Academic</option><option value="MEETING">👥 Meeting</option><option value="EXAM">📝 Exam</option><option value="HOLIDAY">🌴 Holiday</option>
                    </select>
                    <button onClick={handleAddAnnouncement} style={{ background: "linear-gradient(135deg,#1a9e8f,#17b897)", border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Publish Announcement</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
                {[[" 📊", reportsData.attendance.overall + "%", "Overall Attendance", "#22c55e", "↑ 2% from last month"], ["🎓", reportsData.performance.averageCGPA, "Average CGPA", "#f59e0b", "↑ 0.3 from last sem"], ["👥", adminStats.totalStudents, "Total Enrollment", "#3b82f6", "↑ 32 this month"]].map(([icon, val, label, color, trend]) => (
                  <div key={label} style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color }}>{val}</div>
                    <div style={{ fontSize: 13, color: t.subtext, marginTop: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#22c55e", marginTop: 8 }}>{trend}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, padding: "24px", marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: t.text }}>Department-wise Attendance</div>
                {reportsData.attendance.byDepartment.map((dept, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 14, color: t.text }}>{dept.dept}</span><span style={{ fontSize: 14, fontWeight: 600, color: dept.percentage >= 80 ? "#22c55e" : "#f59e0b" }}>{dept.percentage}% {dept.trend}</span></div>
                    <div style={{ background: t.border, borderRadius: 8, height: 8, overflow: "hidden" }}><div style={{ width: `${dept.percentage}%`, height: "100%", background: dept.percentage >= 80 ? "#22c55e" : "#f59e0b", borderRadius: 8 }} /></div>
                  </div>
                ))}
              </div>
              <div style={{ background: t.panelBg, borderRadius: 20, border: `1px solid ${t.border}`, padding: "24px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: t.text }}>Top Performing Students</div>
                {reportsData.performance.topPerformers.map((student, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: idx < reportsData.performance.topPerformers.length - 1 ? `1px solid ${t.border}` : "none" }}>
                    <div><div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{student.name}</div><div style={{ fontSize: 12, color: t.subtext }}>{student.dept}</div></div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{student.cgpa}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedStudent && <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} t={t} />}
      {selectedFaculty && <FacultyProfileModal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} t={t} />}
    </div>
  );
}

export default AdminDashboard;