package com.rit.ims.repository;

import com.rit.ims.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByUserId(Long userId);
    Optional<Faculty> findByEmployeeId(String employeeId);
}
