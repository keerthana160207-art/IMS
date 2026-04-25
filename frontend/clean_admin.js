const fs = require('fs');
let code = fs.readFileSync('c:/Users/User/ims/frontend/src/AdminDashboard.jsx', 'utf8');

code = code.replace(/const IMS_ALL_STUDENTS = generateImsStudents\(\);/g, 'const IMS_ALL_STUDENTS = [];');
code = code.replace(/const IMS_SEAT_HISTORY = generateImsSeatHistory\(IMS_ALL_STUDENTS\);/g, 'const IMS_SEAT_HISTORY = {};');

const mockDataRegex = /const adminStats = {[\s\S]*?};\n\nconst monthlyAttendance = {[\s\S]*?};\n\nconst departmentData = \[[\s\S]*?\];\n\nconst studentsData = \[\];\n\nconst facultyData = \[[\s\S]*?\];\n\nconst initialTimetable = \[[\s\S]*?\];\n\nconst facultyFeedback = \[[\s\S]*?\];\n\nconst leaveRequests = \[[\s\S]*?\];\n\nconst certificatesData = \[[\s\S]*?\];\n\nconst announcementsData = \[[\s\S]*?\];\n\nconst reportsData = {[\s\S]*?};\n/g;

const replacementData = `const adminStats = { totalStudents: 30, studentsChange: '', totalFaculty: 15, facultySubtext: '', avgAttendance: 0, attendanceChange: '', totalDepts: 0, deptSubtext: '' };
const monthlyAttendance = { months: [], avgAttendance: [] };
const departmentData = [];
const studentsData = [];
const facultyData = [];
const initialTimetable = [];
const facultyFeedback = [];
const leaveRequests = [];
const certificatesData = [];
const announcementsData = [];
const reportsData = {
  attendance: { overall: 0, byDepartment: [] },
  performance: { averageCGPA: 0, topPerformers: [] }
};
`;

code = code.replace(mockDataRegex, replacementData);

// also remove generateImsStudents function body so we don't hold dummy strings in the script
code = code.replace(/const generateImsStudents = \(\) => {[\s\S]*?return students;\n};\n/g, 'const generateImsStudents = () => { return []; };\n');

fs.writeFileSync('c:/Users/User/ims/frontend/src/AdminDashboard.jsx', code);
console.log('done');
