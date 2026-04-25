package com.rit.ims.controller;

import com.rit.ims.dto.AllocationResponseDTO;
import com.rit.ims.dto.StudentAllocationDTO;
import com.rit.ims.entity.User;
import com.rit.ims.repository.UserRepository;
import com.rit.ims.service.SeatAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SeatAllocationController {

    @Autowired
    private SeatAllocationService seatAllocationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/exams/{examId}/allocations")
    public ResponseEntity<AllocationResponseDTO> getAllocationsForExam(@PathVariable UUID examId) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(seatAllocationService.getAllocationsForExam(examId, currentUser));
    }

    @GetMapping("/allocations/student/{studentId}")
    public ResponseEntity<List<StudentAllocationDTO>> getAllocationsForStudent(@PathVariable Long studentId) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(seatAllocationService.getAllStudentAllocations(currentUser, studentId));
    }

    @PostMapping("/allocations/publish")
    public ResponseEntity<Void> publishSeatingPlan(@RequestBody com.rit.ims.dto.SeatingPlanRequestDTO request) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != com.rit.ims.entity.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        seatAllocationService.publishSeatingPlan(request);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("Not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
