package com.rit.ims.service;

import com.rit.ims.entity.Subject;
import com.rit.ims.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    public List<Subject> getSubjectsBySection(String department, int year, String section) {
        return subjectRepository.findByDepartmentAndYearAndSection(department, year, section);
    }

    public List<Subject> getSubjectsByFaculty(Long facultyId) {
        return subjectRepository.findByFacultyId(facultyId);
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Long id, Subject updatedSubject) {
        Subject existing = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        updatedSubject.setId(id);
        return subjectRepository.save(updatedSubject);
    }

    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}
