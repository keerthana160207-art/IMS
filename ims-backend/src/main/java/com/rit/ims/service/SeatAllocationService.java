package com.rit.ims.service;

import com.rit.ims.dto.AllocationResponseDTO;
import com.rit.ims.dto.StudentAllocationDTO;
import com.rit.ims.entity.Exam;
import com.rit.ims.entity.Role;
import com.rit.ims.entity.SeatAllocation;
import com.rit.ims.entity.User;
import com.rit.ims.exception.AllocationNotYetVisibleException;
import com.rit.ims.repository.ExamRepository;
import com.rit.ims.repository.SeatAllocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SeatAllocationService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private SeatAllocationRepository seatAllocationRepository;

    public AllocationResponseDTO getAllocationsForExam(UUID examId, User currentUser) {
        Exam exam = examRepository.findById(examId)
            .orElseThrow(() -> new EntityNotFoundException("Exam not found"));

        checkVisibility(exam, currentUser);

        List<SeatAllocation> allocations = seatAllocationRepository.findByExamId(examId);

        List<StudentAllocationDTO> allocationDTOs = allocations.stream().map(this::mapToDTO).collect(Collectors.toList());

        return AllocationResponseDTO.builder()
                .examName(exam.getName())
                .examDate(exam.getExamDate().toString())
                .startTime(exam.getStartTime().toString())
                .allocations(allocationDTOs)
                .build();
    }

    public StudentAllocationDTO getStudentAllocation(UUID examId, User currentUser, Long studentId) {
        Exam exam = examRepository.findById(examId)
            .orElseThrow(() -> new EntityNotFoundException("Exam not found"));

        checkVisibility(exam, currentUser);

        return seatAllocationRepository.findByExamId(examId).stream()
                .filter(a -> a.getStudent() != null && a.getStudent().getId().equals(studentId))
                .findFirst()
                .map(this::mapToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Allocation not found for student"));
    }

    public List<StudentAllocationDTO> getAllStudentAllocations(User currentUser, Long studentId) {
        List<SeatAllocation> allAllocations = seatAllocationRepository.findByStudentId(studentId);

        return allAllocations.stream()
                .filter(a -> {
                    try {
                        checkVisibility(a.getExam(), currentUser);
                        return true;
                    } catch (AllocationNotYetVisibleException ex) {
                        return false;
                    }
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void checkVisibility(Exam exam, User currentUser) {
        LocalDateTime examStart = LocalDateTime.of(exam.getExamDate(), exam.getStartTime());
        LocalDateTime now = LocalDateTime.now();

        int minutesBefore = switch (currentUser.getRole()) {
            case ADMIN   -> 0;        // always allowed
            case FACULTY -> 60;
            case STUDENT -> 30;
        };

        LocalDateTime visibleFrom = examStart.minusMinutes(minutesBefore);

        if (currentUser.getRole() != Role.ADMIN && now.isBefore(visibleFrom)) {
            throw new AllocationNotYetVisibleException(visibleFrom, minutesBefore);
        }
    }

    private StudentAllocationDTO mapToDTO(SeatAllocation a) {
        return StudentAllocationDTO.builder()
                .studentId(a.getStudent() != null ? a.getStudent().getId() : null)
                .studentName(a.getStudent() != null && a.getStudent().getUser() != null ? a.getStudent().getUser().getFullName() : "Unknown")
                .rollNumber(a.getStudent() != null ? a.getStudent().getRollNumber() : "Unknown")
                .rowNum(a.getRowNum())
                .colNum(a.getColNum())
                .seatLabel(a.getSeatLabel())
                .facultyInvigilator(a.getFacultyInvigilator())
                .hallInfo(a.getHallInfo())
                .build();
    }

    @org.springframework.transaction.annotation.Transactional
    public void publishSeatingPlan(com.rit.ims.dto.SeatingPlanRequestDTO request) {
        LocalDateTime dt = LocalDateTime.parse(request.getExamDateTime()); // "2026-04-10T10:00"
        
        // Ensure exam exists, or create it. For simplicity, just create it if we don't have a matching name/date
        Exam exam = examRepository.findAll().stream()
                .filter(e -> e.getName().equals(request.getExamName()) && e.getExamDate().equals(dt.toLocalDate()))
                .findFirst()
                .orElseGet(() -> {
                    Exam newExam = Exam.builder()
                            .name(request.getExamName())
                            .examDate(dt.toLocalDate())
                            .startTime(dt.toLocalTime())
                            .endTime(dt.toLocalTime().plusHours(3)) // Assume 3 hours default
                            .build();
                    return examRepository.save(newExam);
                });

        // Save allocations
        for (com.rit.ims.dto.SeatAssignmentDTO dto : request.getAssignments()) {
            // we could clear existing ones if it's an update, but we just save for now
            com.rit.ims.entity.Student student = null;
            if (dto.getStudentId() != null) {
                student = new com.rit.ims.entity.Student();
                student.setId(dto.getStudentId()); // Assuming JPA proxy handles this ID reference
            }

            SeatAllocation allocation = SeatAllocation.builder()
                    .exam(exam)
                    .student(student)
                    .hallInfo(dto.getRoom())
                    .rowNum(dto.getRowNum())
                    .colNum(dto.getColNum())
                    .seatLabel(dto.getSeatLabel())
                    .facultyInvigilator("Assigned Invigilator")
                    .build();
            seatAllocationRepository.save(allocation);
        }
    }
}
