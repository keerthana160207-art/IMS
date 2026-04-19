package com.rit.ims.service;

import com.rit.ims.entity.Timetable;
import com.rit.ims.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    public List<Timetable> getTimetableBySection(String department, int year, String section) {
        return timetableRepository.findByDepartmentAndYearAndSection(department, year, section);
    }

    public List<Timetable> getTimetableByFaculty(Long facultyId) {
        return timetableRepository.findByFacultyId(facultyId);
    }

    public Timetable createTimetable(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    public Timetable updateTimetable(Long id, Timetable updatedTimetable) {
        Timetable existing = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        
        updatedTimetable.setId(id);
        return timetableRepository.save(updatedTimetable);
    }

    public void deleteTimetable(Long id) {
        timetableRepository.deleteById(id);
    }
}
