package com.rit.ims.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LmsMaterialDTO {
    private Long id;
    private String title;
    private String type;
    private String subject;
    private String department;
    private String section;
    private String facultyName;
    private String fileUrl;
    private Long fileSizeKb;
    private LocalDateTime uploadedAt;
}
