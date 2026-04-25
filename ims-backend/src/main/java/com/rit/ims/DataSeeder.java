package com.rit.ims;

import com.rit.ims.entity.*;
import com.rit.ims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private AttendanceSessionRepository sessionRepository;

    @Autowired
    private AttendanceRecordRepository recordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 50) {
            System.out.println("Database already seeded. Skipping...");
            return; // Skip if already seeded
        }
        
        System.out.println("Starting Database Seeding exactly to requirements...");

        // Clear existing attendance data to prevent conflicts during re-seed
        recordRepository.deleteAll();
        sessionRepository.deleteAll();

        String bcryptedPassword = passwordEncoder.encode("password123");

        // Create Users & Students
        for (int i = 1; i <= 30; i++) {
            String username = "student" + i;
            if (userRepository.existsByUsername(username)) continue;
            
            User user = User.builder()
                    .username(username)
                    .password(bcryptedPassword)
                    .fullName("Student " + i)
                    .role(Role.STUDENT)
                    .email(username + "@college.com")
                    .active(true)
                    .department("CSE")
                    .build();
            user = userRepository.save(user);

            // Students 1-15 -> Section A, 16-30 -> Section B
            String section = (i <= 15) ? "A" : "B";
            String code = String.format("STU%03d", i);

            Student student = Student.builder()
                    .user(user)
                    .rollNumber(code)
                    .section(section)
                    .year(2)
                    .batch("2024")
                    .department("CSE")
                    .build();
            studentRepository.save(student);
        }

        // Create Users & Faculty
        for (int i = 1; i <= 15; i++) {
            String username = "faculty" + i;
            if (userRepository.existsByUsername(username)) continue;
            
            User user = User.builder()
                    .username(username)
                    .password(bcryptedPassword)
                    .fullName("Faculty " + i)
                    .role(Role.FACULTY)
                    .active(true)
                    .department("CSE")
                    .email(username + "@college.com")
                    .build();
            user = userRepository.save(user);

            String code = String.format("FAC%03d", i);
            Faculty faculty = Faculty.builder()
                    .user(user)
                    .employeeId(code)
                    .designation("Professor")
                    .department("CSE")
                    .build();
            facultyRepository.save(faculty);
        }

        // Create Users & Admins
        for (int i = 1; i <= 6; i++) {
            String username = "admin" + i;
            if (userRepository.existsByUsername(username)) continue;
            
            User user = User.builder()
                    .username(username)
                    .password(bcryptedPassword)
                    .fullName("Admin " + i)
                    .role(Role.ADMIN)
                    .active(true)
                    .email(username + "@college.com")
                    .department("Admin")
                    .build();
            userRepository.save(user);
        }

        // Provide exactly 6 Subjects
        class SubMap {
            String code, name, sec;
            int facIdx;
            SubMap(String c, String n, String s, int f) { this.code=c; this.name=n; this.sec=s; this.facIdx=f; }
        }

        List<SubMap> subjects = Arrays.asList(
            new SubMap("CS101", "Data Structures", "A", 1),
            new SubMap("CS102", "Operating Systems", "A", 3),
            new SubMap("CS103", "Database Management", "A", 5),
            new SubMap("CS104", "Computer Networks", "B", 7),
            new SubMap("CS105", "Web Technologies", "B", 10),
            new SubMap("CS106", "Machine Learning", "B", 13)
        );

        List<Faculty> allFac = facultyRepository.findAll();
        for (SubMap s : subjects) {
            Faculty assignee = allFac.stream().filter(f -> f.getEmployeeId().equals(String.format("FAC%03d", s.facIdx))).findFirst().orElse(null);
            if (assignee != null) {
                Subject sub = Subject.builder()
                        .subjectCode(s.code)
                        .subjectName(s.name)
                        .department("CSE")
                        .year(2)
                        .section(s.sec)
                        .faculty(assignee)
                        .build();
                subjectRepository.save(sub);
            }
        }

        // Generate Attendance Records for last 14 days
        LocalDate today = LocalDate.now();
        List<Student> allStudents = studentRepository.findAll();
        List<Subject> allSubjects = subjectRepository.findAll();
        
        for (Subject sub : allSubjects) {
            String subSec = sub.getSection();
            // Filter students matching section
            List<Student> subStudents = allStudents.stream().filter(s -> s.getSection().equals(subSec)).toList();
            
            for (int d = 1; d <= 14; d++) {
                if (d % 3 == 0) continue; // Skip some dates
                LocalDate sessionDate = today.minusDays(d);
                
                AttendanceSession session = AttendanceSession.builder()
                        .subject(sub)
                        .faculty(sub.getFaculty())
                        .date(sessionDate)
                        .periodStartTime(LocalTime.of(10, 0))
                        .periodEndTime(LocalTime.of(11, 0))
                        .status(SessionStatus.CLOSED)
                        .build();
                session = sessionRepository.save(session);
                
                for (Student stu : subStudents) {
                     // Add some randomness
                     AttendanceStatus status = Math.random() < 0.7 ? AttendanceStatus.PRESENT : (Math.random() < 0.5 ? AttendanceStatus.ABSENT : AttendanceStatus.LATE);
                     AttendanceRecord record = AttendanceRecord.builder()
                             .session(session)
                             .student(stu)
                             .status(status)
                             .build();
                     recordRepository.save(record);
                }
            }
        }

        System.out.println("Seeding Complete via Spring Boot!");
    }
}
