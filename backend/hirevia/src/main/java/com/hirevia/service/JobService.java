package com.hirevia.service;

import com.hirevia.models.Company;
import com.hirevia.models.Employer;
import com.hirevia.models.Job;
import com.hirevia.models.User;
import com.hirevia.requests.CreateJobRequest;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface JobService {
    Job createJob(String jwt, CreateJobRequest request) throws AccessDeniedException;

    Job updateJob(Long jobId, Job job, String jwt) throws AccessDeniedException;

    Job getJobById(Long jobId);

    void deleteJob(Long jobId, String jwt) throws AccessDeniedException;

    List<Job> getAllJobs();

    List<Job> getJobsByEmployer(Long employerId);

    List<Job> getJobsByCategory(Long categoryId);

    List<Job> searchJobs(String keyword, String location);

    List<Job> sortJobs(String fieldName, String order);

    List<Job> GetJobsByCompany(Long companyId);

    List<Job> getRecommendedJobs(User user);
}
