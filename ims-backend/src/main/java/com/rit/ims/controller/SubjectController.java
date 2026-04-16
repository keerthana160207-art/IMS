package com.rit.ims.controller;

import com.rit.ims.entity.Subject;
import com.rit.ims.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping("/")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @GetMapping("/section")
    public ResponseEntity<List<Subject>> getSubjectsBySection(
            @RequestParam String dept, @RequestParam int year, @RequestParam String section) {
        return ResponseEntity.ok(subjectService.getSubjectsBySection(dept, year, section));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Subject>> getSubjectsByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(subjectService.getSubjectsByFaculty(facultyId));
    }

    @PostMapping("/")
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        return ResponseEntity.ok(subjectService.createSubject(subject));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        return ResponseEntity.ok(subjectService.updateSubject(id, subject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok().build();
    }
}
