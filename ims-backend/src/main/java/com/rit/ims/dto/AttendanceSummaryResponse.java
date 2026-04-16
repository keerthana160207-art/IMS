package com.rit.ims.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private long totalClasses;
    private long present;
    private long absent;
    private double percentage;
    private int classesNeeded;
}
