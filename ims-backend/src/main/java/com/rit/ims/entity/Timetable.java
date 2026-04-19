package com.rit.ims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "timetable")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek;

    private int periodNumber;

    private LocalTime startTime;

    private LocalTime endTime;

    private String department;

    private int year;

    private String section;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    private String roomNumber;
}
