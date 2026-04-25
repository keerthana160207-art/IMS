package com.rit.ims.dto;

import lombok.Data;

@Data
public class SeatAssignmentDTO {
    private Long studentId;
    private String room;
    private String rowNum;
    private String colNum;
    private String seatLabel;
}
