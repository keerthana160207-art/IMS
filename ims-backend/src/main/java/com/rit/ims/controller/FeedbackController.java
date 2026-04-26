package com.rit.ims.controller;

import com.rit.ims.dto.FeedbackRequest;
import com.rit.ims.dto.FeedbackResponse;
import com.rit.ims.dto.FeedbackSummaryDTO;
import com.rit.ims.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/submit")
    public ResponseEntity<FeedbackResponse> submitFeedback(@RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.submitFeedback(request));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackForFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(feedbackService.getFeedbackForFaculty(facultyId));
    }

    @GetMapping("/faculty/{facultyId}/summary")
    public ResponseEntity<FeedbackSummaryDTO> getFacultyFeedbackSummary(@PathVariable Long facultyId) {
        return ResponseEntity.ok(feedbackService.getFacultyFeedbackSummary(facultyId));
    }

    @GetMapping("/admin/summary")
    public ResponseEntity<List<FeedbackSummaryDTO>> getAdminFeedbackSummary() {
        return ResponseEntity.ok(feedbackService.getAdminFeedbackSummary());
    }
}
