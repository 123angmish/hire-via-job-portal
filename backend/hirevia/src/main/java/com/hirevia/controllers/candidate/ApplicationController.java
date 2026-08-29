package com.hirevia.controllers.candidate;

import com.hirevia.models.Application;
import com.hirevia.models.User;
import com.hirevia.requests.ApplyJobRequest;
import com.hirevia.service.ApplicationService;
import com.hirevia.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @PostMapping({"/apply/{jobId}", "/{jobId}"})
    public ResponseEntity<Application> applyJobHandler(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody ApplyJobRequest request) {
        User user = userService.findByJwt(jwt);
        Application application = applicationService.applyForJob(jobId, user, request);
        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    @GetMapping("/job/{jobId}/has-applied")
    public ResponseEntity<Boolean> hasUserAppliedHandler(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        boolean hasApplied = applicationService.hasUserApplied(jobId, user.getId());
        return new ResponseEntity<>(hasApplied, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Application>> getApplicationsByUserHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        List<Application> applications = applicationService.getApplicationsByUser(user.getId());
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<Application> getApplicationByIdHandler(
            @PathVariable Long applicationId,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {
        User user = userService.findByJwt(jwt);
        Application application = applicationService.getApplicationById(applicationId);

        // IDOR Verification: Ensure candidate owns application or employer owns job
        boolean isCandidateOwner = application.getUser().getId().equals(user.getId());
        boolean isEmployerOwner = application.getJob() != null
                && application.getJob().getEmployer() != null
                && application.getJob().getEmployer().getUser() != null
                && application.getJob().getEmployer().getUser().getId().equals(user.getId());

        if (!isCandidateOwner && !isEmployerOwner) {
            throw new AccessDeniedException("Unauthorized: You do not have permission to view this application.");
        }

        return new ResponseEntity<>(application, HttpStatus.OK);
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<String> deleteApplicationHandler(
            @PathVariable Long applicationId,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {
        User user = userService.findByJwt(jwt);
        Application application = applicationService.getApplicationById(applicationId);

        if (!application.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized: You can only delete your own applications.");
        }

        applicationService.deleteApplication(applicationId);
        return new ResponseEntity<>("Application deleted successfully", HttpStatus.OK);
    }
}
