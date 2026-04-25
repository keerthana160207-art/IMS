package com.rit.ims.exception;

import com.rit.ims.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.format.DateTimeFormatter;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AllocationNotYetVisibleException.class)
    public ResponseEntity<ErrorResponse> handleNotYetVisible(AllocationNotYetVisibleException ex) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a");
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            new ErrorResponse(403, "Access Denied",
                "Seat allocations are visible " + ex.getMinutesBefore() + " minutes before the exam. Available at " 
                + ex.getAvailableAt().format(formatter) + ".",
                ex.getAvailableAt())
        );
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(org.springframework.security.authentication.BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ErrorResponse(401, "Unauthorized", "Invalid ID or password.", null)
        );
    }
}
