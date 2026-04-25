package com.rit.ims.repository;

import com.rit.ims.entity.SeatAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SeatAllocationRepository extends JpaRepository<SeatAllocation, UUID> {
    List<SeatAllocation> findByExamId(UUID examId);
    List<SeatAllocation> findByStudentId(Long studentId);
}
