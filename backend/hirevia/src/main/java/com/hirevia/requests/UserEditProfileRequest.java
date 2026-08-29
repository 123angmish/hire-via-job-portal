package com.hirevia.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UserEditProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Size(max = 20, message = "Phone number is too long")
    private String phoneNumber;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 100, message = "Experience must not exceed 100 characters")
    private String experience;

    private List<String> skills;

    private String resume;

    private String profilePicture;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;
}
