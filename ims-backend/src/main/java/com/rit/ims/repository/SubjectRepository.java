package com.rit.ims.repository;

import com.rit.ims.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartmentAndYearAndSection(String department, int year, String section);
    List<Subject> findByFacultyId(Long facultyId);
}
