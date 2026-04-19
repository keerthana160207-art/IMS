package com.rit.ims.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String role;
    private String department;
    private String phoneNumber;
    
    // Student specifics
    private String rollNumber;
    private String section;
    private int year;
    private String batch;
    
    // Faculty specifics
    private String employeeId;
    private String designation;
}
