package com.rit.ims.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllocationResponseDTO {
    private String examName;
    private String examDate;
    private String startTime;
    private List<StudentAllocationDTO> allocations;
}
