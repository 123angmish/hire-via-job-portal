package com.hirevia.controllers.candidate;

import com.hirevia.models.Job;
import com.hirevia.models.User;
import com.hirevia.requests.CreateJobRequest;
import com.hirevia.service.JobService;
import com.hirevia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserService userService;

    @GetMapping({"", "/all"})
    public ResponseEntity<List<Job>> getAllJobsHandler() {
        java.util.List<Job> jobs = jobService.getAllJobs();
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Job>> getJobsByCompanyHandler(@PathVariable Long companyId) {
        List<Job> jobs = jobService.GetJobsByCompany(companyId);
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Job>> getJobsByCategoryHandler(@PathVariable Long categoryId) {
        List<Job> jobs = jobService.getJobsByCategory(categoryId);
        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "location", required = false) String location
    ) {

        List<Job> jobs = jobService.searchJobs(keyword, location);

        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<Job>> sortJobs(
            @RequestParam("field") String fieldName,
            @RequestParam(value = "order", defaultValue = "asc") String order) {

        List<Job> jobs = jobService.sortJobs(fieldName, order);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        return new ResponseEntity<>(job, HttpStatus.OK);
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<Job>> getRecommendedJobs(
            @RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        List<Job> recommendedJobs = jobService.getRecommendedJobs(user);

        return new ResponseEntity<>(recommendedJobs, HttpStatus.OK);
    }
}
