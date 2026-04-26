package com.rit.ims.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Long studentId;
    private Long facultyId;
    private Integer rating;
    private String comments;
}
