package com.hirevia.controllers.candidate;

import com.hirevia.models.ChatMessage;
import com.hirevia.models.User;
import com.hirevia.repositories.ApplicationRepository;
import com.hirevia.repositories.ChatMessageRepository;
import com.hirevia.repositories.JobRepository;
import com.hirevia.requests.SendMessageRequest;
import com.hirevia.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessageHandler(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @Valid @RequestBody SendMessageRequest request) throws AccessDeniedException {

        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User sender = null;
        if (jwt != null && !jwt.trim().isEmpty() && !jwt.equalsIgnoreCase("Bearer null") && !jwt.equalsIgnoreCase("Bearer undefined")) {
            try {
                sender = userService.findByJwt(jwt);
            } catch (Exception e) {
                // ignore
            }
        }

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setApplicationId(request.getApplicationId());
        chatMessage.setJobId(request.getJobId());
        chatMessage.setMessage(request.getMessage().trim());

        String resolvedRole = "EMPLOYER";
        if (sender != null && sender.getRole() != null) {
            resolvedRole = sender.getRole().name().toUpperCase();
        } else if (request.getSenderRole() != null && !request.getSenderRole().trim().isEmpty()) {
            resolvedRole = request.getSenderRole().trim().toUpperCase();
        }
        chatMessage.setSenderRole(resolvedRole);

        String resolvedName = resolvedRole.equalsIgnoreCase("EMPLOYER") ? "Employer" : "Candidate";
        if (sender != null && sender.getFullName() != null && !sender.getFullName().trim().isEmpty()) {
            resolvedName = sender.getFullName().trim();
        } else if (request.getSenderName() != null && !request.getSenderName().trim().isEmpty()) {
            resolvedName = request.getSenderName().trim();
        }
        chatMessage.setSenderName(resolvedName);

        if (sender != null) {
            chatMessage.setSenderId(sender.getId());
            chatMessage.setSenderEmail(sender.getEmail());
        }

        if (request.getApplicationId() != null) {
            applicationRepository.findById(request.getApplicationId()).ifPresent(app -> {
                if (app.getJob() != null) {
                    chatMessage.setJobId(app.getJob().getId());
                    chatMessage.setJobTitle(app.getJob().getTitle());
                }
            });
        } else if (request.getJobId() != null) {
            jobRepository.findById(request.getJobId()).ifPresent(job -> {
                chatMessage.setJobTitle(job.getTitle());
            });
        }

        ChatMessage saved = chatMessageRepository.save(chatMessage);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<List<ChatMessage>> getMessagesByApplicationHandler(
            @PathVariable Long applicationId,
            @RequestHeader(value = "Authorization", required = false) String jwt) {

        if (applicationId == null) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
        }

        List<ChatMessage> messages = chatMessageRepository.findByApplicationIdOrderByCreatedAtAsc(applicationId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ChatMessage>> getMessagesByJobHandler(
            @PathVariable Long jobId,
            @RequestHeader(value = "Authorization", required = false) String jwt) {

        if (jobId == null) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
        }

        List<ChatMessage> messages = chatMessageRepository.findByJobIdOrderByCreatedAtAsc(jobId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<String> clearMessagesHandler(
            @PathVariable Long applicationId,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws AccessDeniedException {
        if (applicationId != null) {
            if (jwt != null && !jwt.trim().isEmpty()) {
                User user = userService.findByJwt(jwt);
                // Verify user is candidate or employer of application
                applicationRepository.findById(applicationId).ifPresent(app -> {
                    boolean isCand = app.getUser() != null && app.getUser().getId().equals(user.getId());
                    boolean isEmp = app.getJob() != null && app.getJob().getEmployer() != null
                            && app.getJob().getEmployer().getUser() != null
                            && app.getJob().getEmployer().getUser().getId().equals(user.getId());
                    if (!isCand && !isEmp) {
                        try {
                            throw new AccessDeniedException("Unauthorized to clear this chat history");
                        } catch (AccessDeniedException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });
            }
            List<ChatMessage> messages = chatMessageRepository.findByApplicationIdOrderByCreatedAtAsc(applicationId);
            chatMessageRepository.deleteAll(messages);
        }
        return new ResponseEntity<>("Chat history cleared successfully", HttpStatus.OK);
    }
}
