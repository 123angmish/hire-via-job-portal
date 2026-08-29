package com.hirevia.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMessageRequest {

    private Long applicationId;
    private Long jobId;

    @NotBlank(message = "Message text cannot be blank")
    @Size(max = 2000, message = "Message text cannot exceed 2000 characters")
    private String message;

    private String senderRole;
    private String senderName;
}
