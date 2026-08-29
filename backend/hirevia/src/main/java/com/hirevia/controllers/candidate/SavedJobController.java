package com.hirevia.controllers.candidate;

import com.hirevia.models.SavedJob;
import com.hirevia.models.User;
import com.hirevia.service.SavedJobService;
import com.hirevia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobController {

    @Autowired
    private SavedJobService savedJobService;

    @Autowired
    private UserService userService;

    @PostMapping("/add/{jobId}")
    public ResponseEntity<SavedJob> saveJobHandler(@PathVariable Long jobId, @RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        SavedJob savedJob = savedJobService.savedJob(jobId, user);
        return new ResponseEntity<>(savedJob, HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{savedJobId}")
    public ResponseEntity<String> removeSavedJobHandler(@PathVariable Long savedJobId, @RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        savedJobService.removeSavedJob(savedJobId, user.getId());
        return new ResponseEntity<>("Job remove from your saved jobs!", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SavedJob>> getUserSavedJobsHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        List<SavedJob> savedJobs = savedJobService.getUserSavedJobs(user.getId());
        return new ResponseEntity<>(savedJobs, HttpStatus.OK);
    }

    @GetMapping("/is-saved/{jobId}")
    public ResponseEntity<Boolean> isJobSavedHandler(@PathVariable Long jobId, @RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        boolean isSaved = savedJobService.isJobSaved(jobId, user.getId());
        return new ResponseEntity<>(isSaved, HttpStatus.OK);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearUserSavedJobsHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        savedJobService.clearUserSavedJobs(user.getId());
        return new ResponseEntity<>("All saved jobs cleared!", HttpStatus.NO_CONTENT);
    }
}
