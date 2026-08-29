package com.hirevia.controllers.employer;

import com.hirevia.enums.AppliedStatus;
import com.hirevia.models.Application;
import com.hirevia.models.Employer;
import com.hirevia.models.User;
import com.hirevia.repositories.EmployerRepository;
import com.hirevia.service.ApplicationService;
import com.hirevia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employer/applications")
public class ApplicationManagementController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmployerRepository employerRepository;

    @GetMapping
    public ResponseEntity<List<Application>> getApplicationsForLoggedInEmployer(
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
            }
            Employer employer = employerRepository.findByUserId(user.getId());
            if (employer == null) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
            }
            List<Application> applications = applicationService.getApplicationsByEmployer(employer.getId());
            return new ResponseEntity<>(applications, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Application> updateApplicationStatusHandler(
            @PathVariable Long applicationId,
            @RequestParam(name = "status", required = false) String statusParam,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {

        User user = userService.findByJwt(jwt);
        Application application = applicationService.getApplicationById(applicationId);

        // IDOR Verification: Ensure logged in employer owns the job of this application
        boolean isOwner = application.getJob() != null
                && application.getJob().getEmployer() != null
                && application.getJob().getEmployer().getUser() != null
                && application.getJob().getEmployer().getUser().getId().equals(user.getId());

        if (!isOwner) {
            throw new AccessDeniedException("Unauthorized: You can only update application status for jobs posted by your account.");
        }

        String statusStr = statusParam;
        if (statusStr == null && body != null && body.containsKey("status")) {
            statusStr = String.valueOf(body.get("status"));
        }
        if (statusStr == null) {
            statusStr = "APPLIED";
        }

        AppliedStatus appliedStatus;
        try {
            appliedStatus = AppliedStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (Exception e) {
            appliedStatus = AppliedStatus.APPLIED;
        }

        Application updatedApplication = applicationService.updateApplicationStatus(applicationId, appliedStatus);
        return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
    }

    @GetMapping("/{employerId}")
    public ResponseEntity<List<Application>> getApplicationsHandler(
            @PathVariable Long employerId,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {
        User user = userService.findByJwt(jwt);
        Employer employer = employerRepository.findByUserId(user.getId());

        if (employer == null || !employer.getId().equals(employerId)) {
            throw new AccessDeniedException("Unauthorized: You cannot access applicant data belonging to other employers.");
        }

        List<Application> applications = applicationService.getApplicationsByEmployer(employerId);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @GetMapping("/{employerId}/search")
    public ResponseEntity<List<Application>> searchApplicationsHandler(
            @RequestParam(required = false) String keyword,
            @PathVariable Long employerId,
            @RequestHeader("Authorization") String jwt
    ) throws AccessDeniedException {
        User user = userService.findByJwt(jwt);
        Employer employer = employerRepository.findByUserId(user.getId());

        if (employer == null || !employer.getId().equals(employerId)) {
            throw new AccessDeniedException("Unauthorized: You cannot search applicant data belonging to other employers.");
        }

        List<Application> applications = applicationService.searchApplications(employerId, keyword);
        return new ResponseEntity<>(applications, HttpStatus.OK);
    }
}
