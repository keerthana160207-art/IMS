package com.rit.ims.service;

import com.rit.ims.dto.LoginRequest;
import com.rit.ims.dto.LoginResponse;
import com.rit.ims.dto.RegisterRequest;
import com.rit.ims.entity.Faculty;
import com.rit.ims.entity.Role;
import com.rit.ims.entity.Student;
import com.rit.ims.entity.User;
import com.rit.ims.repository.FacultyRepository;
import com.rit.ims.repository.StudentRepository;
import com.rit.ims.repository.UserRepository;
import com.rit.ims.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role userRole;
        try {
            userRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            userRole = Role.STUDENT; // Default
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(userRole)
                .department(request.getDepartment())
                .phoneNumber(request.getPhoneNumber())
                .active(true)
                .build();

        userRepository.save(user);

        if (userRole == Role.STUDENT) {
            Student student = Student.builder()
                    .user(user)
                    .rollNumber(request.getRollNumber())
                    .section(request.getSection())
                    .year(request.getYear())
                    .batch(request.getBatch())
                    .department(request.getDepartment())
                    .build();
            studentRepository.save(student);
        } else if (userRole == Role.FACULTY) {
            Faculty faculty = Faculty.builder()
                    .user(user)
                    .employeeId(request.getEmployeeId())
                    .designation(request.getDesignation())
                    .department(request.getDepartment())
                    .build();
            facultyRepository.save(faculty);
        }

        return login(new LoginRequest(request.getUsername(), request.getPassword()));
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        String jwt = jwtUtils.generateToken(userDetails);
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String specificId = "";
        if(user.getRole() == Role.STUDENT) {
            specificId = studentRepository.findByUserId(user.getId())
                            .map(Student::getRollNumber).orElse("");
        } else if(user.getRole() == Role.FACULTY) {
            specificId = facultyRepository.findByUserId(user.getId())
                            .map(Faculty::getEmployeeId).orElse("");
        }

        return LoginResponse.builder()
                .token(jwt)
                .role(user.getRole().name())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .userId(user.getId())
                .department(user.getDepartment())
                .employeeIdOrRollNumber(specificId)
                .build();
    }
}
