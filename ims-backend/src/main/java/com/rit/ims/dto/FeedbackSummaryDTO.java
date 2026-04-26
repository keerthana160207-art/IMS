package com.rit.ims.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedbackSummaryDTO {
    private Long facultyId;
    private String facultyName;
    private Double averageRating;
    private Integer totalFeedbacks;
    private Integer fiveStarCount;
    private Integer fourStarCount;
    private Integer threeStarCount;
    private Integer twoStarCount;
    private Integer oneStarCount;
}
