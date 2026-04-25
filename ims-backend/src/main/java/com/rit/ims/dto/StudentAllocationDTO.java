package com.rit.ims.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAllocationDTO {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String rowNum;
    private String colNum;
    private String seatLabel;
    private String facultyInvigilator;
    private String hallInfo;
}
