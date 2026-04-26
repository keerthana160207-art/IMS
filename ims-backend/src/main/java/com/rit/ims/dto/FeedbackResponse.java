package com.rit.ims.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long facultyId;
    private String facultyName;
    private Integer rating;
    private String comments;
    private LocalDateTime createdAt;
}
