package com.rit.ims.service;

import com.rit.ims.dto.FeedbackRequest;
import com.rit.ims.dto.FeedbackResponse;
import com.rit.ims.dto.FeedbackSummaryDTO;
import com.rit.ims.entity.Faculty;
import com.rit.ims.entity.Feedback;
import com.rit.ims.entity.Student;
import com.rit.ims.repository.FacultyRepository;
import com.rit.ims.repository.FeedbackRepository;
import com.rit.ims.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Feedback feedback = Feedback.builder()
                .student(student)
                .faculty(faculty)
                .rating(request.getRating())
                .comments(request.getComments())
                .build();

        feedback = feedbackRepository.save(feedback);
        return mapToResponse(feedback);
    }

    public List<FeedbackResponse> getFeedbackForFaculty(Long facultyId) {
        return feedbackRepository.findByFacultyId(facultyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackSummaryDTO> getAdminFeedbackSummary() {
        return facultyRepository.findAll().stream().map(faculty -> {
            List<Feedback> feedbacks = feedbackRepository.findByFacultyId(faculty.getId());
            double avg = feedbacks.isEmpty() ? 0 : feedbacks.stream().mapToInt(Feedback::getRating).average().orElse(0.0);
            
            return FeedbackSummaryDTO.builder()
                    .facultyId(faculty.getId())
                    .facultyName(faculty.getUser().getFullName())
                    .averageRating(Math.round(avg * 10.0) / 10.0)
                    .totalFeedbacks(feedbacks.size())
                    .fiveStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 5).count())
                    .fourStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 4).count())
                    .threeStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 3).count())
                    .twoStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 2).count())
                    .oneStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 1).count())
                    .build();
        }).collect(Collectors.toList());
    }

    public FeedbackSummaryDTO getFacultyFeedbackSummary(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        List<Feedback> feedbacks = feedbackRepository.findByFacultyId(facultyId);
        double avg = feedbacks.isEmpty() ? 0 : feedbacks.stream().mapToInt(Feedback::getRating).average().orElse(0.0);
        
        return FeedbackSummaryDTO.builder()
                .facultyId(faculty.getId())
                .facultyName(faculty.getUser().getFullName())
                .averageRating(Math.round(avg * 10.0) / 10.0)
                .totalFeedbacks(feedbacks.size())
                .fiveStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 5).count())
                .fourStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 4).count())
                .threeStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 3).count())
                .twoStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 2).count())
                .oneStarCount((int) feedbacks.stream().filter(f -> f.getRating() == 1).count())
                .build();
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .studentId(feedback.getStudent().getId())
                .studentName(feedback.getStudent().getUser().getFullName())
                .facultyId(feedback.getFaculty().getId())
                .facultyName(feedback.getFaculty().getUser().getFullName())
                .rating(feedback.getRating())
                .comments(feedback.getComments())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
