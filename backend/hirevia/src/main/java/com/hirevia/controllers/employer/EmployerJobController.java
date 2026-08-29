package com.hirevia.controllers.employer;

import com.hirevia.models.Employer;
import com.hirevia.models.Job;
import com.hirevia.models.User;
import com.hirevia.repositories.EmployerRepository;
import com.hirevia.requests.CreateJobRequest;
import com.hirevia.service.JobService;
import com.hirevia.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/employer/jobs")
public class EmployerJobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmployerRepository employerRepository;

    @PostMapping
    public ResponseEntity<Job> createJobHandler(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody CreateJobRequest request)
            throws AccessDeniedException {
        Job job = jobService.createJob(jwt, request);
        return new ResponseEntity<>(job, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getJobsByEmployerHandler(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findByJwt(jwt);
            if (user == null) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
            }
            Employer employer = employerRepository.findByUserId(user.getId());
            if (employer == null) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
            }
            List<Job> jobs = jobService.getJobsByEmployer(employer.getId());
            return new ResponseEntity<>(jobs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    @PutMapping("/update/{jobId}")
    public ResponseEntity<Job> updateJobHandler(
            @PathVariable Long jobId,
            @RequestBody Job job,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {
        Job updatedJob = jobService.updateJob(jobId, job, jwt);
        return new ResponseEntity<>(updatedJob, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{jobId}")
    public ResponseEntity<String> deleteJobHandler(
            @PathVariable Long jobId,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {
        jobService.deleteJob(jobId, jwt);
        return new ResponseEntity<>("Job deleted successfully!", HttpStatus.OK);
    }
}
