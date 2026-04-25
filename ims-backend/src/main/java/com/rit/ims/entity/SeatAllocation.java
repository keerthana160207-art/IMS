package com.rit.ims.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "seat_allocations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    private String rowNum;

    private String colNum;

    private String seatLabel;

    private String facultyInvigilator;

    private String hallInfo;
}
