package com.hirevia.service.Impl;

import com.hirevia.enums.AppliedStatus;
import com.hirevia.enums.UserRole;
import com.hirevia.exceptions.InvalidDataException;
import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.Application;
import com.hirevia.models.Job;
import com.hirevia.models.User;
import com.hirevia.repositories.ApplicationRepository;
import com.hirevia.requests.ApplyJobRequest;
import com.hirevia.service.ApplicationService;
import com.hirevia.service.JobService;
import com.hirevia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private JobService jobService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserService userService;

    @Override
    public Application applyForJob(Long jobId, User user, ApplyJobRequest request) {
        Job job = jobService.getJobById(jobId);

        if (job == null) {
            throw new NotFoundException("Job not found.");
        }

        boolean alreadyApplied = applicationRepository.existsByJobIdAndUserId(job.getId(), user.getId());
        if (alreadyApplied) {
            throw new InvalidDataException("You have already applied for this job.");
        }

        String coverLetter = request.getCoverLetter();
        if (coverLetter == null || coverLetter.trim().isEmpty()) {
            coverLetter = "Application for " + job.getTitle();
        }

        String resumeUrl = request.getResumeUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            resumeUrl = user.getResume();
        }
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            resumeUrl = "Resume uploaded by " + user.getFullName();
        }

        Application application = new Application();
        application.setCoverLetter(coverLetter.trim());
        application.setResumeUrl(resumeUrl.trim());
        application.setStatus(AppliedStatus.APPLIED);
        application.setUser(user);
        application.setJob(job);

        return applicationRepository.save(application);
    }

    @Override
    public boolean hasUserApplied(Long jobId, Long userId) {
        return applicationRepository.existsByJobIdAndUserId(jobId, userId);
    }

    @Override
    public List<Application> getApplicationByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @Override
    public List<Application> getApplicationsByUser(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    @Override
    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId).orElseThrow(() -> new NotFoundException("Application not found."));
    }

    @Override
    public Application updateApplicationStatus(Long applicationId, AppliedStatus status) throws AccessDeniedException {
        Application application = this.getApplicationById(applicationId);

        if (status == null) {
            throw new InvalidDataException("Status is required.");
        }

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Long applicationId) throws AccessDeniedException {
        Application application = this.getApplicationById(applicationId);

        User currentUser = userService.getLoggedInUser();

        if (!application.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to update this application");
        }

        applicationRepository.delete(application);
    }

    @Override
    public List<Application> getApplicationsByEmployer(Long employerId) {
        return applicationRepository.findApplicationsByEmployerId(employerId);
    }

    @Override
    public List<Application> searchApplications(Long employerId, String keyword) {
        return applicationRepository.searchApplications(employerId, keyword);
    }
}
