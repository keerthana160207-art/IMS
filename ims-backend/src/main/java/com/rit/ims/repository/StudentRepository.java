package com.rit.ims.repository;

import com.rit.ims.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByRollNumber(String rollNumber);
    List<Student> findByDepartmentAndSection(String department, String section);
    List<Student> findByDepartmentAndSectionAndYear(String department, String section, int year);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUser(com.rit.ims.entity.User user);
}
