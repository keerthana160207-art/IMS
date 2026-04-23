package com.rit.ims.controller;

import com.rit.ims.dto.AdminAttendanceStatsResponse;
import com.rit.ims.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/attendance/stats")
    public ResponseEntity<AdminAttendanceStatsResponse> getStats() {
        return ResponseEntity.ok(attendanceService.getAdminStats());
    }
}
