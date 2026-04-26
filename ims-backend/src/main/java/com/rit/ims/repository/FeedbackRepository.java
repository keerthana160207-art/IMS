package com.rit.ims.repository;

import com.rit.ims.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByFacultyId(Long facultyId);
    List<Feedback> findByStudentId(Long studentId);
}
