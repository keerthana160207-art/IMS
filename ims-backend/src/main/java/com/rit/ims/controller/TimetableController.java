package com.rit.ims.controller;

import com.rit.ims.entity.Timetable;
import com.rit.ims.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @GetMapping("/")
    public ResponseEntity<List<Timetable>> getAllTimetables() {
        return ResponseEntity.ok(timetableService.getAllTimetables());
    }

    @GetMapping("/section")
    public ResponseEntity<List<Timetable>> getTimetableBySection(
            @RequestParam String dept, @RequestParam int year, @RequestParam String section) {
        return ResponseEntity.ok(timetableService.getTimetableBySection(dept, year, section));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Timetable>> getTimetableByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(timetableService.getTimetableByFaculty(facultyId));
    }

    @PostMapping("/")
    public ResponseEntity<Timetable> createTimetable(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(timetableService.createTimetable(timetable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Timetable> updateTimetable(@PathVariable Long id, @RequestBody Timetable timetable) {
        return ResponseEntity.ok(timetableService.updateTimetable(id, timetable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
        return ResponseEntity.ok().build();
    }
}
