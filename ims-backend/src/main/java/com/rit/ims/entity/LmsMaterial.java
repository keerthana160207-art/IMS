package com.rit.ims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lms_materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LmsMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String type; // video, assignment, quiz, lab

    private String subject; // e.g. "Data Structures"

    private String department; // e.g. "CSE"

    private String section; // e.g. "A"

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty uploadedBy;

    private String fileUrl; // For now we can use dummy URL or base64 or path

    private Long fileSizeKb;

    private LocalDateTime uploadedAt;
}
