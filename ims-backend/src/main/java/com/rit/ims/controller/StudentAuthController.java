package com.rit.ims.controller;

import com.rit.ims.dto.StudentAllocationDTO;
import com.rit.ims.dto.StudentLoginRequest;
import com.rit.ims.dto.StudentLoginResponse;
import com.rit.ims.entity.Student;
import com.rit.ims.entity.User;
import com.rit.ims.repository.StudentRepository;
import com.rit.ims.security.JwtUtils;
import com.rit.ims.service.SeatAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StudentAuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SeatAllocationService seatAllocationService;

    @PostMapping("/auth/student-login")
    public ResponseEntity<?> login(@RequestBody StudentLoginRequest request) {
        Optional<Student> studentOpt = studentRepository.findByEmail(request.getEmail());

        if (studentOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), studentOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        Student student = studentOpt.get();

        // Create user details for token generation using student email
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                student.getEmail(),
                student.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        String jwt = jwtUtils.generateToken(userDetails);

        StudentLoginResponse.StudentDetails details = StudentLoginResponse.StudentDetails.builder()
                .id(student.getId())
                .name(student.getUser() != null ? student.getUser().getFullName() : "Unknown")
                .rollNumber(student.getRollNumber())
                .classSection(student.getSection())
                .build();

        StudentLoginResponse response = StudentLoginResponse.builder()
                .token(jwt)
                .student(details)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/my-allocation")
    public ResponseEntity<StudentAllocationDTO> getMyAllocation(@RequestParam UUID examId) {
        String email = getCurrentUsername();

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // proxyUser allows checking visibility constraints logic inside SeatAllocationService.
        User proxyUser = User.builder().role(com.rit.ims.entity.Role.STUDENT).build();
        
        return ResponseEntity.ok(seatAllocationService.getStudentAllocation(examId, proxyUser, student.getId()));
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("Not authenticated");
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }
}
