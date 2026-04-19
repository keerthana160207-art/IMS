package com.rit.ims.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminAttendanceStatsResponse {
    private double overallPercentage;
    private Map<String, Double> departmentStats;
    private List<StudentStat> studentStats;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StudentStat {
        private String studentId;
        private Long id;
        private String name;
        private String department;
        private double percentage;
        private String status; // e.g. "GOOD", "OKAY", "LOW"
    }
}
