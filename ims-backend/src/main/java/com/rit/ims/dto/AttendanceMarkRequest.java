package com.rit.ims.dto;

import lombok.Data;
import java.util.List;

@Data
public class AttendanceMarkRequest {
    private Long sessionId;
    private List<StudentAttendance> students;

    @Data
    public static class StudentAttendance {
        private Long studentId;
        private String status;
    }
}
