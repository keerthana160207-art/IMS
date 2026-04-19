package com.rit.ims.repository;

import com.rit.ims.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByDepartmentAndYearAndSection(String department, int year, String section);
    List<Timetable> findByFacultyId(Long facultyId);
    List<Timetable> findByDayOfWeekAndDepartmentAndYearAndSection(String dayOfWeek, String department, int year, String section);
}
