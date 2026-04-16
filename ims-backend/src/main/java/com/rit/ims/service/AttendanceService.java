package com.rit.ims.service;

import com.rit.ims.dto.AttendanceMarkRequest;
import com.rit.ims.dto.AttendanceSessionRequest;
import com.rit.ims.dto.AttendanceSummaryResponse;
import com.rit.ims.entity.*;
import com.rit.ims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceSessionRepository sessionRepository;

    @Autowired
    private AttendanceRecordRepository recordRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationService notificationService;

    public AttendanceSession startSession(Long facultyId, AttendanceSessionRequest request) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        String dayOfWeek = LocalDate.now().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        // Map shorthand e.g., "Mon" to check full if needed, but assuming DB relies on "Monday" based format or similar.
        // Let's standardise to full string.
        String fullDayName = LocalDate.now().getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        List<Timetable> todaysClasses = timetableRepository.findByDayOfWeekAndDepartmentAndYearAndSection(
                fullDayName, subject.getDepartment(), subject.getYear(), subject.getSection());

        // Find the specific period
        Timetable period = todaysClasses.stream()
                .filter(t -> t.getPeriodNumber() == request.getPeriodNumber() && t.getSubject().getId().equals(subject.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No scheduled class found for this period"));

        LocalTime now = LocalTime.now();
        LocalTime startTimeBuffer = period.getStartTime().minusMinutes(15);
        LocalTime endTimeBuffer = period.getEndTime().plusMinutes(15);

        if (now.isBefore(startTimeBuffer) || now.isAfter(endTimeBuffer)) {
            throw new RuntimeException("Cannot start session outside scheduled period time");
        }

        AttendanceSession session = AttendanceSession.builder()
                .subject(subject)
                .faculty(faculty)
                .date(LocalDate.now())
                .periodNumber(request.getPeriodNumber())
                .periodStartTime(period.getStartTime())
                .periodEndTime(period.getEndTime())
                .department(subject.getDepartment())
                .year(subject.getYear())
                .section(subject.getSection())
                .status(SessionStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        return sessionRepository.save(session);
    }

    @Transactional
    public List<AttendanceRecord> markAttendance(AttendanceMarkRequest request) {
        AttendanceSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != SessionStatus.OPEN) {
            throw new RuntimeException("Session is not open");
        }

        List<AttendanceRecord> recordsToSave = new ArrayList<>();

        for (AttendanceMarkRequest.StudentAttendance sa : request.getStudents()) {
            Student student = studentRepository.findById(sa.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            AttendanceStatus status = AttendanceStatus.valueOf(sa.getStatus());

            AttendanceRecord record = recordRepository.findBySessionId(session.getId()).stream()
                    .filter(r -> r.getStudent().getId().equals(student.getId()))
                    .findFirst()
                    .orElse(AttendanceRecord.builder()
                            .session(session)
                            .student(student)
                            .build());

            record.setStatus(status);
            record.setMarkedAt(LocalDateTime.now());
            recordsToSave.add(record);
        }

        List<AttendanceRecord> savedRecords = recordRepository.saveAll(recordsToSave);

        // After saving, calculate percentage and check for low attendance notification
        for (AttendanceRecord record : savedRecords) {
            Student student = record.getStudent();
            Subject subject = session.getSubject();
            
            AttendanceSummaryResponse summary = calculateClassesNeeded(student.getId(), subject.getId());
            if (summary.getPercentage() < 75.0 && summary.getTotalClasses() > 0) {
                // To avoid spam, you might check if one was sent recently. We emit it directly here as per reqs
                int classesNeeded = (int) Math.ceil((0.75 * summary.getTotalClasses() - summary.getPresent()) / 0.25);
                
                String message = String.format("Your attendance in %s is %.1f%%. You need %d more classes to reach 75%%.",
                        subject.getSubjectName(), summary.getPercentage(), classesNeeded);
                
                notificationService.createNotification(student.getUser().getId(), message, NotificationType.LOW_ATTENDANCE);
            }
        }

        return savedRecords;
    }

    public AttendanceSession closeSession(Long sessionId) {
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(SessionStatus.CLOSED);
        session.setClosedAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    public List<AttendanceSummaryResponse> getStudentAttendanceSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Get subjects for student's section
        List<Subject> subjects = subjectRepository.findByDepartmentAndYearAndSection(
                student.getDepartment(), student.getYear(), student.getSection()
        );

        return subjects.stream()
                .map(sub -> calculateClassesNeeded(student.getId(), sub.getId()))
                .collect(Collectors.toList());
    }

    public AttendanceSummaryResponse calculateClassesNeeded(Long studentId, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        
        long totalClasses = recordRepository.countByStudentIdAndSessionSubjectId(studentId, subjectId);
        long present = recordRepository.countByStudentIdAndSessionSubjectIdAndStatus(studentId, subjectId, AttendanceStatus.PRESENT);
        long late = recordRepository.countByStudentIdAndSessionSubjectIdAndStatus(studentId, subjectId, AttendanceStatus.LATE);
        
        long ODCount = recordRepository.countByStudentIdAndSessionSubjectIdAndStatus(studentId, subjectId, AttendanceStatus.OD);
        
        long consideredPresent = present + late + ODCount; 
        
        double percentage = totalClasses == 0 ? 100.0 : ((double) consideredPresent / totalClasses) * 100.0;
        
        int classesNeeded = 0;
        if (percentage < 75.0 && totalClasses > 0) {
            classesNeeded = (int) Math.ceil((0.75 * totalClasses - consideredPresent) / 0.25);
        }

        return AttendanceSummaryResponse.builder()
                .subjectId(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .subjectName(subject.getSubjectName())
                .totalClasses(totalClasses)
                .present(consideredPresent)
                .absent(totalClasses - consideredPresent)
                .percentage(percentage)
                .classesNeeded(classesNeeded)
                .build();
    }
}
