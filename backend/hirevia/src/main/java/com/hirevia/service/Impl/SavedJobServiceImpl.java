package com.hirevia.service.Impl;

import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.Job;
import com.hirevia.models.SavedJob;
import com.hirevia.models.User;
import com.hirevia.repositories.SavedJobRepository;
import com.hirevia.service.JobService;
import com.hirevia.service.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedJobServiceImpl implements SavedJobService {

    @Autowired
    private JobService jobService;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Override
    public SavedJob savedJob(Long jobId, User user) {
        Job job = jobService.getJobById(jobId);

        if (savedJobRepository.existsByJobIdAndUserId(jobId, user.getId())) {
            return savedJobRepository.findByUserId(user.getId()).stream()
                    .filter(sj -> sj.getJob() != null && sj.getJob().getId().equals(jobId))
                    .findFirst()
                    .orElse(null);
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setJob(job);
        savedJob.setUser(user);

        return savedJobRepository.save(savedJob);
    }

    @Override
    public void removeSavedJob(Long savedJobId, Long userId) {
        SavedJob savedJob = savedJobRepository.findByIdAndUser_Id(savedJobId, userId)
                .orElseThrow(() -> new NotFoundException("Saved Job Not Found!"));
        savedJobRepository.delete(savedJob);
    }

    @Override
    public List<SavedJob> getUserSavedJobs(Long userId) {
        return savedJobRepository.findByUserId(userId);
    }

    @Override
    public boolean isJobSaved(Long jobId, Long userId) {
        return savedJobRepository.existsByJobIdAndUserId(jobId, userId);
    }

    @Override
    public void clearUserSavedJobs(Long userId) {
        List<SavedJob> savedJobs = this.getUserSavedJobs(userId);
        if (!savedJobs.isEmpty()) {
            savedJobRepository.deleteAll(savedJobs);
        }
    }
}
