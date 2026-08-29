package com.hirevia.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApplyJobRequest {

    @NotBlank(message = "Cover letter is required")
    @Size(min = 5, max = 5000, message = "Cover letter must be between 5 and 5000 characters")
    private String coverLetter;

    @NotBlank(message = "Resume is required")
    private String resumeUrl;

    @NotNull(message = "Job ID is required")
    private Long id;
}
