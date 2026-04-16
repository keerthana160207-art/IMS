package com.rit.ims.service;

import com.rit.ims.dto.NotificationResponse;
import com.rit.ims.entity.Notification;
import com.rit.ims.entity.NotificationType;
import com.rit.ims.entity.Student;
import com.rit.ims.entity.Subject;
import com.rit.ims.entity.User;
import com.rit.ims.repository.NotificationRepository;
import com.rit.ims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public Notification createNotification(Long userId, String message, NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    public Notification createLowAttendanceNotification(Student student, Subject subject, double percentage) {
        int classesNeeded = (int) Math.ceil((75.0 - percentage) / 100 * 40); // Rough approximation, exact calculation in AttendanceService
        if(classesNeeded < 0) classesNeeded = 0;
        
        String message = String.format("Your attendance in %s is %.1f%%. You need %d more classes to reach 75%%.",
                subject.getSubjectName(), percentage, classesNeeded);

        return createNotification(student.getUser().getId(), message, NotificationType.LOW_ATTENDANCE);
    }

    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getAllNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
