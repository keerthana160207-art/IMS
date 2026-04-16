package com.rit.ims.repository;

import com.rit.ims.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    List<AttendanceSession> findBySubjectIdAndDate(Long subjectId, LocalDate date);
    List<AttendanceSession> findByFacultyIdAndDate(Long facultyId, LocalDate date);
    List<AttendanceSession> findByDepartmentAndYearAndSection(String department, int year, String section);
}
