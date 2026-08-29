package com.hirevia.service;

import com.hirevia.enums.AppliedStatus;
import com.hirevia.models.Application;
import com.hirevia.models.Job;
import com.hirevia.models.User;
import com.hirevia.requests.ApplyJobRequest;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface ApplicationService {
    Application applyForJob(Long jobId, User user, ApplyJobRequest request);

    boolean hasUserApplied(Long jobId, Long userId);

    List<Application> getApplicationByJob(Long jobId);

    List<Application> getApplicationsByUser(Long userId);

    Application getApplicationById(Long applicationId);

    Application updateApplicationStatus(Long applicationId, AppliedStatus status) throws AccessDeniedException;

    void deleteApplication(Long applicationId) throws AccessDeniedException;

    List<Application> getApplicationsByEmployer(Long employerId);

    List<Application> searchApplications(Long employerId, String keyword);

}