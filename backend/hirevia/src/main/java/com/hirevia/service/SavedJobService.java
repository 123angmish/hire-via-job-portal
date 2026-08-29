package com.hirevia.service;

import com.hirevia.models.SavedJob;
import com.hirevia.models.User;

import java.util.List;

public interface SavedJobService {
    SavedJob savedJob(Long jobId, User user);

    void removeSavedJob(Long savedJobId, Long userId);

    List<SavedJob> getUserSavedJobs(Long userId);

    boolean isJobSaved(Long jobId, Long userId);

    void clearUserSavedJobs(Long userId);
}
