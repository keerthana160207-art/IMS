package com.rit.ims.controller;

import com.rit.ims.dto.LmsMaterialDTO;
import com.rit.ims.dto.LmsMaterialRequestDTO;
import com.rit.ims.service.LmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lms")
@CrossOrigin(origins = "*")
public class LmsController {

    @Autowired
    private LmsService lmsService;

    @PostMapping("/upload")
    public ResponseEntity<LmsMaterialDTO> uploadMaterial(@ModelAttribute LmsMaterialRequestDTO request, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        LmsMaterialDTO dto = lmsService.uploadMaterial(userDetails.getUsername(), request);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/student")
    public ResponseEntity<List<LmsMaterialDTO>> getMaterialsForStudent(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<LmsMaterialDTO> dtos = lmsService.getMaterialsForStudent(userDetails.getUsername());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/faculty/section")
    public ResponseEntity<List<LmsMaterialDTO>> getMaterialsBySection(@RequestParam String department, @RequestParam String section) {
        List<LmsMaterialDTO> dtos = lmsService.getMaterialsBySection(department, section);
        return ResponseEntity.ok(dtos);
    }
}
