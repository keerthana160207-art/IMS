package com.rit.ims.dto;

import lombok.Data;
import java.util.List;

@Data
public class SeatingPlanRequestDTO {
    private String examName;
    private String examDateTime; // e.g. "2026-04-10T10:00"
    private List<SeatAssignmentDTO> assignments;
}
