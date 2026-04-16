package com.rit.ims.controller;

import com.rit.ims.dto.AttendanceMarkRequest;
import com.rit.ims.dto.AttendanceSessionRequest;
import com.rit.ims.entity.AttendanceRecord;
import com.rit.ims.entity.AttendanceSession;
import com.rit.ims.entity.SessionStatus;
import com.rit.ims.repository.AttendanceRecordRepository;
import com.rit.ims.repository.AttendanceSessionRepository;
import com.rit.ims.security.JwtUtils;
import com.rit.ims.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import com.rit.ims.entity.User;
import com.rit.ims.entity.Faculty;
import com.rit.ims.repository.UserRepository;
import com.rit.ims.repository.FacultyRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacultyRepository facultyRepository;
    
    @Autowired
    private AttendanceSessionRepository sessionRepository;
    
    @Autowired
    private AttendanceRecordRepository recordRepository;

    private Long getFacultyId(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Faculty faculty = facultyRepository.findByUserId(user.getId()).orElseThrow();
        return faculty.getId();
    }

    @PostMapping("/session/start")
    public ResponseEntity<?> startSession(Authentication authentication, @RequestBody AttendanceSessionRequest request) {
        try {
            Long facultyId = getFacultyId(authentication);
            return ResponseEntity.ok(attendanceService.startSession(facultyId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceMarkRequest request) {
        try {
            return ResponseEntity.ok(attendanceService.markAttendance(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/session/{id}/close")
    public ResponseEntity<?> closeSession(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.closeSession(id));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<?> getStudentAttendanceSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceSummary(studentId));
    }

    @GetMapping("/student/{studentId}/classes-needed")
    public ResponseEntity<?> getClassesNeededSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceSummary(studentId));
    }

    @GetMapping("/session/active")
    public ResponseEntity<List<AttendanceSession>> getActiveSessions() {
        // Find all OPEN sessions for today across the institution
        List<AttendanceSession> allActive = sessionRepository.findAll().stream()
                .filter(s -> s.getStatus() == SessionStatus.OPEN && s.getDate().equals(LocalDate.now()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(allActive);
    }
    
    @GetMapping("/session/{sessionId}/records")
    public ResponseEntity<List<AttendanceRecord>> getSessionRecords(@PathVariable Long sessionId) {
        return ResponseEntity.ok(recordRepository.findBySessionId(sessionId));
    }
}
