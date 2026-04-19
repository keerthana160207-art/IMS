package com.rit.ims.repository;

import com.rit.ims.entity.AttendanceRecord;
import com.rit.ims.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findBySessionId(Long sessionId);
    List<AttendanceRecord> findByStudentId(Long studentId);
    List<AttendanceRecord> findByStudentIdAndSessionSubjectId(Long studentId, Long subjectId);
    long countByStudentIdAndSessionSubjectIdAndStatus(Long studentId, Long subjectId, AttendanceStatus status);
    long countByStudentIdAndSessionSubjectId(Long studentId, Long subjectId);
}
