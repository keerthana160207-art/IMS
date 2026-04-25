package com.rit.ims.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class LmsMaterialRequestDTO {
    private String title;
    private String type;
    private String subject;
    private String department;
    private String section;
    private MultipartFile file; // Optional for now
}
