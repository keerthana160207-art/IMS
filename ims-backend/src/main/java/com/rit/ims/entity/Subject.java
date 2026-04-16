package com.rit.ims.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String subjectCode;

    private String subjectName;

    private String department;

    private int year;

    private String section;

    private int semester;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;
}
