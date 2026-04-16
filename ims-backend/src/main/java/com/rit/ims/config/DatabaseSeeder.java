package com.rit.ims.config;

import com.rit.ims.dto.RegisterRequest;
import com.rit.ims.entity.*;
import com.rit.ims.repository.*;
import com.rit.ims.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final TimetableRepository timetableRepository;
    private final StudentRepository studentRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;

    public DatabaseSeeder(AuthService authService, UserRepository userRepository,
                          SubjectRepository subjectRepository, FacultyRepository facultyRepository,
                          TimetableRepository timetableRepository, StudentRepository studentRepository,
                          AttendanceSessionRepository sessionRepository, AttendanceRecordRepository recordRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.facultyRepository = facultyRepository;
        this.timetableRepository = timetableRepository;
        this.studentRepository = studentRepository;
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin
        if (!userRepository.existsByUsername("admin1")) {
            RegisterRequest admin = new RegisterRequest();
            admin.setUsername("admin1");
            admin.setPassword("password123");
            admin.setFullName("Campus Admin");
            admin.setRole(Role.ADMIN.name());
            authService.register(admin);
        }

        // Seed Faculty
        if (!userRepository.existsByUsername("faculty1")) {
            RegisterRequest faculty = new RegisterRequest();
            faculty.setUsername("faculty1");
            faculty.setPassword("password123");
            faculty.setFullName("Demo Faculty");
            faculty.setRole(Role.FACULTY.name());
            faculty.setEmployeeId("F001");
            faculty.setDepartment("CSE");
            authService.register(faculty);
        }

        // Seed Student
        if (!userRepository.existsByUsername("student1")) {
            RegisterRequest student = new RegisterRequest();
            student.setUsername("student1");
            student.setPassword("password123");
            student.setFullName("Demo Student");
            student.setRole(Role.STUDENT.name());
            student.setDepartment("CSE");
            student.setRollNumber("CS001");
            student.setYear(1);
            student.setSection("A");
            student.setBatch("2023");
            authService.register(student);
        }

        if (!userRepository.existsByUsername("student2")) {
            RegisterRequest student2 = new RegisterRequest();
            student2.setUsername("student2");
            student2.setPassword("password123");
            student2.setFullName("Second Student");
            student2.setRole(Role.STUDENT.name());
            student2.setDepartment("CSE");
            student2.setRollNumber("CS002");
            student2.setYear(1);
            student2.setSection("A");
            student2.setBatch("2023");
            authService.register(student2);
        }
        
        // Populate sample subjects and attendance for student UI
        User fc = userRepository.findByUsername("faculty1").orElse(null);
        if (fc != null && subjectRepository.count() == 0) {
            Faculty faculty = facultyRepository.findByUserId(fc.getId()).orElse(null);
            if (faculty != null) {
                Subject sub1 = Subject.builder()
                        .subjectName("Data Structures")
                        .subjectCode("CS201")
                        .department("CSE")
                        .year(1)
                        .section("A")
                        .faculty(faculty)
                        .build();
                subjectRepository.save(sub1);
                
                Subject sub2 = Subject.builder()
                        .subjectName("Computer Networks")
                        .subjectCode("CS202")
                        .department("CSE")
                        .year(1)
                        .section("A")
                        .faculty(faculty)
                        .build();
                subjectRepository.save(sub2);
                
                Timetable t1 = Timetable.builder()
                        .subject(sub1)
                        .dayOfWeek("MONDAY")
                        .periodNumber(1)
                        .department("CSE")
                        .year(1)
                        .section("A")
                        .build();
                timetableRepository.save(t1);
                
                User st = userRepository.findByUsername("student1").orElse(null);
                if(st != null) {
                    Student student = studentRepository.findByUserId(st.getId()).orElse(null);
                    if(student != null) {
                        AttendanceSession session = AttendanceSession.builder()
                                .subject(sub1)
                                .faculty(faculty)
                                .date(LocalDateTime.now().minusDays(1).toLocalDate())
                                .createdAt(LocalDateTime.now().minusDays(1).minusHours(1))
                                .periodNumber(1)
                                .status(SessionStatus.CLOSED)
                                .build();
                        sessionRepository.save(session);
                        
                        AttendanceRecord record = AttendanceRecord.builder()
                                .session(session)
                                .student(student)
                                .status(AttendanceStatus.PRESENT)
                                .markedAt(LocalDateTime.now().minusDays(1).minusMinutes(50))
                                .build();
                        recordRepository.save(record);
                        
                        AttendanceSession session2 = AttendanceSession.builder()
                                .subject(sub2)
                                .faculty(faculty)
                                .date(LocalDateTime.now().toLocalDate())
                                .createdAt(LocalDateTime.now().minusHours(2))
                                .periodNumber(2)
                                .status(SessionStatus.CLOSED)
                                .build();
                        sessionRepository.save(session2);
                        
                        AttendanceRecord record2 = AttendanceRecord.builder()
                                .session(session2)
                                .student(student)
                                .status(AttendanceStatus.ABSENT)
                                .markedAt(LocalDateTime.now().minusHours(1).minusMinutes(30))
                                .build();
                        recordRepository.save(record2);
                    }
                }
            }
        }
    }
}
