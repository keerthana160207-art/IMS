const BASE_URL = 'http://localhost:8080/api';

const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ims_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || 'API call failed';
    } catch (e) {
      // not JSON
    }
    throw new Error(errorMessage || 'API call failed');
  }

  // Not all responses will be JSON content (like a simple OK string or empty)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const api = {
  // Auth
  login: (username, password) => 
    authFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (data) => 
    authFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Student Attendance
  getStudentSummary: (studentId) => authFetch(`/attendance/student/${studentId}/summary`),

  // Timetable
  getTimetableBySection: (dept, year, section) => 
    authFetch(`/timetable/section?dept=${dept}&year=${year}&section=${section}`),
  getAllTimetables: () => authFetch('/timetable/'),
  createTimetable: (data) => authFetch('/timetable/', { method: 'POST', body: JSON.stringify(data) }),
  updateTimetable: (id, data) => authFetch(`/timetable/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTimetable: (id) => authFetch(`/timetable/${id}`, { method: 'DELETE' }),

  // Subjects
  getSubjectsBySection: (dept, year, section) => 
    authFetch(`/subjects/section?dept=${dept}&year=${year}&section=${section}`),
  getSubjectsByFaculty: (facultyId) => authFetch(`/subjects/faculty/${facultyId}`),
  getAllSubjects: () => authFetch('/subjects/'),
  createSubject: (data) => authFetch('/subjects/', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id, data) => authFetch(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id) => authFetch(`/subjects/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: (userId) => authFetch(`/notifications/${userId}`),
  getUnreadCount: (userId) => authFetch(`/notifications/${userId}/count`),
  markNotificationRead: (id) => authFetch(`/notifications/${id}/read`, { method: 'PUT' }),

  // LMS
  uploadLmsMaterial: (formData) => {
    const token = localStorage.getItem('ims_token');
    return fetch('http://localhost:8080/api/lms/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // DO NOT stringify or set Content-Type, browser handles boundary
    }).then(res => res.json());
  },
  getLmsMaterialsForStudent: () => authFetch('/lms/student'),
  getLmsMaterialsBySection: (dept, section) => authFetch(`/lms/faculty/section?department=${dept}&section=${section}`),

  // Attendance Actions
  startAttendanceSession: (subjectId, periodNumber) => 
    authFetch('/attendance/session/start', { method: 'POST', body: JSON.stringify({ subjectId, periodNumber }) }),
  markAttendance: (sessionId, students) => 
    authFetch('/attendance/mark', { method: 'POST', body: JSON.stringify({ sessionId, students }) }),
  closeAttendanceSession: (sessionId) => 
    authFetch(`/attendance/session/${sessionId}/close`, { method: 'PUT' }),
  getSessionRecords: (sessionId) => authFetch(`/attendance/session/${sessionId}/records`),
  getActiveSessions: () => authFetch('/attendance/session/active'),

  // Seating Allocations
  publishSeatingPlan: (data) => authFetch('/allocations/publish', { method: 'POST', body: JSON.stringify(data) }),
  getMyAllocations: () => authFetch(`/student/my-allocation`), // This actually takes ?examId=...
  getAllocationsForStudent: (studentId) => authFetch(`/allocations/student/${studentId}`),
  
  getAdminAttendanceStats: () => authFetch('/admin/attendance/stats'),

  // Users Management
  getCurrentUser: () => authFetch('/users/me'),
  getAllStudents: () => authFetch('/users/students').then(students => 
    students.filter(s => {
      const un = s.user?.username;
      if (!un) return false;
      if (!un.startsWith("student")) return false;
      const num = parseInt(un.replace("student", ""), 10);
      return num >= 1 && num <= 30;
    })
  ),
  getAllFaculty: () => authFetch('/users/faculty'),
  getStudentById: (id) => authFetch(`/users/student/${id}`),
  getFacultyById: (id) => authFetch(`/users/faculty/${id}`),

  // Feedback
  submitFeedback: (data) => authFetch('/feedback/submit', { method: 'POST', body: JSON.stringify(data) }),
  getFacultyFeedback: (facultyId) => authFetch(`/feedback/faculty/${facultyId}`),
  getFacultyFeedbackSummary: (facultyId) => authFetch(`/feedback/faculty/${facultyId}/summary`),
  getAdminFeedbackSummary: () => authFetch('/feedback/admin/summary'),
};
