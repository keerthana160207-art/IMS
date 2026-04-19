package com.rit.ims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_session")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    private LocalDate date;

    private int periodNumber;

    private LocalTime periodStartTime;

    private LocalTime periodEndTime;

    private String department;

    private int year;

    private String section;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime closedAt;
}
