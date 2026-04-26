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
    private FeedbackRepository feedbackRepository;

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

            // All students in Section A
            String section = "A";
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
            new SubMap("CS101", "Programming in Java", "A", 1),
            new SubMap("CS102", "Database Management Systems (DBMS)", "A", 2),
            new SubMap("CS103", "Data Structures and Algorithms", "A", 3),
            new SubMap("CS104", "Web Technologies", "A", 4),
            new SubMap("CS105", "Operating Systems", "A", 5),
            new SubMap("CS106", "Software Engineering", "A", 6)
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

        // Generate mock feedback for the 6 assigned faculties
        feedbackRepository.deleteAll();
        List<String> feedbackComments = Arrays.asList(
            "Great teaching style, very engaging.",
            "Explains concepts clearly.",
            "Could improve on providing more practical examples.",
            "Very helpful during office hours.",
            "Pacing of the lectures is perfect.",
            "Sometimes goes a bit too fast, but good overall.",
            "Excellent subject knowledge."
        );
        for (Subject sub : allSubjects) {
            Faculty fac = sub.getFaculty();
            // Each student gives feedback
            for (Student stu : subStudents) {
                // Random rating between 3 and 5
                int rating = 3 + (int)(Math.random() * 3);
                String comment = feedbackComments.get((int)(Math.random() * feedbackComments.size()));
                Feedback fb = Feedback.builder()
                        .student(stu)
                        .faculty(fac)
                        .rating(rating)
                        .comments(comment)
                        .build();
                feedbackRepository.save(fb);
            }
        }

        System.out.println("Seeding Complete via Spring Boot!");
    }
}
