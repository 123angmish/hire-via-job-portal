package com.hirevia.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 150, message = "Job title must be between 3 and 150 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    @Size(min = 10, max = 5000, message = "Job description must be between 10 and 5000 characters")
    private String description;

    @NotNull(message = "Job category is required")
    private Long categoryId;

    @NotEmpty(message = "At least one responsibility is required")
    private List<String> responsibilities;

    @NotBlank(message = "Experience level is required")
    private String requiredExperience;

    @NotBlank(message = "Salary range is required")
    private String avgSalary;

    @NotEmpty(message = "At least one skill is required")
    private List<String> requiredSkills;

    private Long companyId;

    @NotBlank(message = "Job timing type is required")
    private String timing;
}
