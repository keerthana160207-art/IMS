package com.rit.ims.dto;

import lombok.Data;

@Data
public class AttendanceSessionRequest {
    private Long subjectId;
    private int periodNumber;
}
