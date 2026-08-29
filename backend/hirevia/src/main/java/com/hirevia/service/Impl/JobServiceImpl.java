package com.hirevia.service.Impl;

import com.hirevia.config.JwtProvider;
import com.hirevia.enums.Industry;
import com.hirevia.enums.JobTiming;
import com.hirevia.enums.UserRole;
import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.Category;
import com.hirevia.models.Company;
import com.hirevia.models.Employer;
import com.hirevia.models.Job;
import com.hirevia.models.User;
import com.hirevia.repositories.ApplicationRepository;
import com.hirevia.repositories.CategoryRepository;
import com.hirevia.repositories.CompanyRepository;
import com.hirevia.repositories.EmployerRepository;
import com.hirevia.repositories.JobRepository;
import com.hirevia.repositories.SavedJobRepository;
import com.hirevia.repositories.UserRepository;
import com.hirevia.requests.CreateJobRequest;
import com.hirevia.service.CategoryService;
import com.hirevia.service.CompanyService;
import com.hirevia.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    private Employer getOrCreateEmployerForUser(User user) {
        if (!UserRole.EMPLOYER.equals(user.getRole())) {
            user.setRole(UserRole.EMPLOYER);
            user = userRepository.save(user);
        }

        Employer employer = employerRepository.findByUserId(user.getId());
        if (employer == null) {
            Company company = new Company();
            String compName = (user.getFullName() != null && !user.getFullName().trim().isEmpty())
                    ? user.getFullName() + " Technologies" : "Company";
            company.setName(compName);
            company.setLocation(user.getLocation() != null ? user.getLocation() : "Delhi, India");
            company.setIndustry(Industry.IT);
            company.setOwnerEmail(user.getEmail());
            company.setOwnerName(user.getFullName());
            company.setOwnerPhoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber() : "9717017909");
            company.setActive(true);
            company = companyRepository.save(company);

            employer = new Employer();
            employer.setUser(user);
            employer.setCompany(company);
            employer.setActive(true);
            employer = employerRepository.save(employer);
        }
        return employer;
    }

    @Override
    public Job createJob(String jwt, CreateJobRequest request) throws AccessDeniedException {

        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            String namePart = email.contains("@") ? email.substring(0, email.indexOf("@")) : "User";
            user.setFullName(namePart);
            user.setRole(UserRole.EMPLOYER);
            user.setPassword("N/A");
            user.setPhoneNumber("9717017909");
            user.setLocation("Delhi, India");
            user.setActive(true);
            user.setVerified(true);
            user = userRepository.save(user);
        }

        Employer employer = getOrCreateEmployerForUser(user);

        Category category = null;
        if (request.getCategoryId() != null) {
            try {
                category = categoryService.getCategoryById(request.getCategoryId());
            } catch (Exception e) {
                // ignore
            }
        }
        if (category == null) {
            category = categoryRepository.findAll().stream().findFirst().orElse(null);
        }
        if (category == null) {
            Category newCat = new Category();
            newCat.setName("Technology & Development");
            newCat.setDescription("Software, IT & Engineering Roles");
            newCat.setIconUrl("https://example.com/tech-icon.png");
            newCat.setActive(true);
            category = categoryRepository.save(newCat);
        }

        Company company = null;
        if (request.getCompanyId() != null) {
            try {
                company = companyService.getCompanyById(request.getCompanyId());
            } catch (Exception e) {
                // ignore
            }
        }
        if (company == null && employer.getCompany() != null) {
            company = employer.getCompany();
        }
        if (company == null) {
            company = companyRepository.findAll().stream().findFirst().orElse(null);
        }
        if (company == null) {
            company = new Company();
            company.setName(user.getFullName() + "'s Company");
            company.setLocation("Delhi, India");
            company.setIndustry(Industry.IT);
            company.setOwnerEmail(user.getEmail());
            company.setOwnerName(user.getFullName());
            company.setOwnerPhoneNumber("9717017909");
            company.setActive(true);
            company = companyRepository.save(company);
        }

        Job job = new Job();
        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setCategory(category);
        if (request.getRequiredSkills() != null) {
            job.setRequiredSkills(new ArrayList<>(request.getRequiredSkills()));
        }
        if (request.getResponsibilities() != null) {
            job.setResponsibilities(new ArrayList<>(request.getResponsibilities()));
        }
        job.setRequiredExperience(request.getRequiredExperience());
        job.setAvgSalary(request.getAvgSalary());
        job.setCompany(company);
        job.setEmployer(employer);
        job.setTiming(JobTiming.valueOf(request.getTiming().trim().toUpperCase()));

        Job savedJob = jobRepository.save(job);

        category.setOpenPositions(category.getOpenPositions() + 1);
        categoryRepository.save(category);

        return savedJob;
    }

    @Override
    public Job updateJob(Long jobId, Job job, String jwt) throws AccessDeniedException {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new NotFoundException("Session expired or user not found. Please log in again.");
        }

        Employer employer = getOrCreateEmployerForUser(user);
        Job existingJob = this.getJobById(jobId);

        // IDOR Verification
        if (existingJob.getEmployer() != null
                && existingJob.getEmployer().getUser() != null
                && !existingJob.getEmployer().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized: You do not own this job posting.");
        }

        if (job.getTitle() != null && !job.getTitle().trim().isEmpty()) {
            existingJob.setTitle(job.getTitle().trim());
        }

        if (job.getDescription() != null && !job.getDescription().trim().isEmpty()) {
            existingJob.setDescription(job.getDescription().trim());
        }

        if (job.getCategory() != null) {
            existingJob.setCategory(job.getCategory());
        }

        if (job.getResponsibilities() != null && !job.getResponsibilities().isEmpty()) {
            existingJob.setResponsibilities(new ArrayList<>(job.getResponsibilities()));
        }

        if (job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty()) {
            existingJob.setRequiredSkills(new ArrayList<>(job.getRequiredSkills()));
        }

        if (job.getRequiredExperience() != null && !job.getRequiredExperience().trim().isEmpty()) {
            existingJob.setRequiredExperience(job.getRequiredExperience().trim());
        }

        if (job.getAvgSalary() != null && !job.getAvgSalary().trim().isEmpty()) {
            existingJob.setAvgSalary(job.getAvgSalary().trim());
        }

        if (job.getCompany() != null) {
            existingJob.setCompany(job.getCompany());
        }

        if (job.getEmployer() != null) {
            existingJob.setEmployer(job.getEmployer());
        }

        if (job.getTiming() != null) {
            existingJob.setTiming(job.getTiming());
        }

        existingJob.setActive(job.isActive());

        return jobRepository.save(existingJob);
    }

    @Override
    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId).orElseThrow(() -> new NotFoundException("Job Not Found!"));
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId, String jwt) throws AccessDeniedException {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new NotFoundException("Session expired or user not found. Please log in again.");
        }

        Job job = this.getJobById(jobId);

        // IDOR Verification
        if (job.getEmployer() != null
                && job.getEmployer().getUser() != null
                && !job.getEmployer().getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized: You do not own this job posting.");
        }

        savedJobRepository.deleteByJobId(jobId);
        applicationRepository.deleteByJobId(jobId);
        jobRepository.delete(job);
    }

    @Override
    public List<Job> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public List<Job> getJobsByCategory(Long categoryId) {
        return jobRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Job> searchJobs(String keyword, String location) {
        return jobRepository.searchJobs(keyword, location);
    }

    @Override
    public List<Job> sortJobs(String fieldName, String order) {
        Sort sort = order.equalsIgnoreCase("desc")
                ? Sort.by(Sort.Direction.DESC, fieldName)
                : Sort.by(Sort.Direction.ASC, fieldName);
        return jobRepository.findAll(sort);
    }

    @Override
    public List<Job> GetJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    @Override
    public List<Job> getRecommendedJobs(User user) {
        List<Job> allActiveJobs = jobRepository.findAll().stream()
                .filter(Job::isActive)
                .toList();

        if (allActiveJobs.isEmpty()) {
            return Collections.emptyList();
        }

        java.util.Set<String> searchTokens = new java.util.HashSet<>();

        if (user != null && user.getSkills() != null) {
            for (String s : user.getSkills()) {
                if (s != null && !s.trim().isEmpty()) {
                    searchTokens.add(s.trim().toLowerCase());
                    for (String token : s.trim().toLowerCase().split("[\\s,/-]+")) {
                        if (token.length() >= 2) searchTokens.add(token);
                    }
                }
            }
        }

        if (user != null && user.getResume() != null && !user.getResume().trim().isEmpty()) {
            String resumeText = user.getResume().toLowerCase();
            int lastSlash = Math.max(resumeText.lastIndexOf('/'), resumeText.lastIndexOf('\\'));
            if (lastSlash != -1) {
                resumeText = resumeText.substring(lastSlash + 1);
            }
            if (resumeText.endsWith(".pdf")) {
                resumeText = resumeText.substring(0, resumeText.length() - 4);
            }
            String[] tokens = resumeText.split("[_\\-\\s.]+");
            for (String token : tokens) {
                if (token.length() >= 2
                        && !token.equals("resume")
                        && !token.equals("cv")
                        && !token.equals("candidate")
                        && !token.equals("updated")
                        && !token.equals("final")
                        && !token.equals("pdf")
                        && !token.equals("doc")) {
                    searchTokens.add(token);
                }
            }
        }

        if (user != null && user.getFullName() != null) {
            for (String part : user.getFullName().toLowerCase().split("\\s+")) {
                searchTokens.remove(part);
            }
        }

        if (searchTokens.isEmpty()) {
            return allActiveJobs.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(10)
                    .toList();
        }

        List<Job> scoredJobs = allActiveJobs.stream()
                .map(job -> {
                    int score = 0;
                    String title = job.getTitle() != null ? job.getTitle().toLowerCase() : "";
                    String desc = job.getDescription() != null ? job.getDescription().toLowerCase() : "";
                    String catName = (job.getCategory() != null && job.getCategory().getName() != null)
                            ? job.getCategory().getName().toLowerCase() : "";

                    List<String> jobSkills = job.getRequiredSkills() != null
                            ? job.getRequiredSkills().stream().map(String::toLowerCase).toList()
                            : Collections.emptyList();

                    for (String token : searchTokens) {
                        if (title.contains(token)) score += 40;
                        if (catName.contains(token)) score += 25;
                        if (jobSkills.stream().anyMatch(js -> js.contains(token))) score += 35;
                        if (desc.contains(token)) score += 20;
                    }
                    return new java.util.AbstractMap.SimpleEntry<>(job, score);
                })
                .filter(entry -> entry.getValue() > 0)
                .sorted((e1, e2) -> {
                    int scoreComp = Integer.compare(e2.getValue(), e1.getValue());
                    if (scoreComp != 0) return scoreComp;
                    return e2.getKey().getCreatedAt().compareTo(e1.getKey().getCreatedAt());
                })
                .map(java.util.Map.Entry::getKey)
                .limit(10)
                .toList();

        if (scoredJobs.isEmpty()) {
            return allActiveJobs.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(10)
                    .toList();
        }

        return scoredJobs;
    }
}
