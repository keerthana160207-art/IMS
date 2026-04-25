package com.rit.ims.service;

import com.rit.ims.dto.LmsMaterialDTO;
import com.rit.ims.dto.LmsMaterialRequestDTO;
import com.rit.ims.entity.*;
import com.rit.ims.repository.FacultyRepository;
import com.rit.ims.repository.LmsMaterialRepository;
import com.rit.ims.repository.NotificationRepository;
import com.rit.ims.repository.StudentRepository;
import com.rit.ims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LmsService {

    @Autowired
    private LmsMaterialRepository lmsMaterialRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public LmsMaterialDTO uploadMaterial(String username, LmsMaterialRequestDTO request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Faculty faculty = facultyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Only faculty can upload materials"));

        LmsMaterial material = LmsMaterial.builder()
                .title(request.getTitle())
                .type(request.getType())
                .subject(request.getSubject())
                .department(request.getDepartment())
                .section(request.getSection())
                .uploadedBy(faculty)
                .uploadedAt(LocalDateTime.now())
                .fileUrl("#") // Simulating upload for now
                .fileSizeKb(1024L) // Simulating 1MB
                .build();

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            material.setFileSizeKb(request.getFile().getSize() / 1024);
            material.setFileUrl("/uploads/" + request.getFile().getOriginalFilename());
        }

        LmsMaterial saved = lmsMaterialRepository.save(material);

        // Send notifications to students in the section
        List<Student> targetStudents = studentRepository.findByDepartmentAndSection(request.getDepartment(), request.getSection());
        List<Notification> notifications = targetStudents.stream().map(student -> Notification.builder()
                .user(student.getUser())
                .message("New material uploaded for " + request.getSubject() + ": " + request.getTitle())
                .type(NotificationType.GENERAL)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build()).collect(Collectors.toList());

        notificationRepository.saveAll(notifications);

        return mapToDTO(saved);
    }

    public List<LmsMaterialDTO> getMaterialsForStudent(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<LmsMaterial> materials = lmsMaterialRepository.findByDepartmentAndSection(student.getDepartment(), student.getSection());
        return materials.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<LmsMaterialDTO> getMaterialsBySection(String department, String section) {
        return lmsMaterialRepository.findByDepartmentAndSection(department, section).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    private LmsMaterialDTO mapToDTO(LmsMaterial material) {
        LmsMaterialDTO dto = new LmsMaterialDTO();
        dto.setId(material.getId());
        dto.setTitle(material.getTitle());
        dto.setType(material.getType());
        dto.setSubject(material.getSubject());
        dto.setDepartment(material.getDepartment());
        dto.setSection(material.getSection());
        dto.setFacultyName(material.getUploadedBy().getUser().getFullName());
        dto.setFileUrl(material.getFileUrl());
        dto.setFileSizeKb(material.getFileSizeKb());
        dto.setUploadedAt(material.getUploadedAt());
        return dto;
    }
}
