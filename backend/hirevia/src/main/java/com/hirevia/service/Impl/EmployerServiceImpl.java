package com.hirevia.service.Impl;

import com.hirevia.enums.Industry;
import com.hirevia.enums.UserRole;
import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.Company;
import com.hirevia.models.Employer;
import com.hirevia.models.User;
import com.hirevia.repositories.CompanyRepository;
import com.hirevia.repositories.EmployerRepository;
import com.hirevia.repositories.UserRepository;
import com.hirevia.service.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployerServiceImpl implements EmployerService {

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Employer getEmployerById(Long employerId) {
        return employerRepository.findById(employerId).orElseThrow(() -> new NotFoundException("Employer Not Found!"));
    }

    @Override
    public Employer getEmployer(User user) {
        Employer employer = employerRepository.findByUserId(user.getId());
        if (employer == null) {
            if (!UserRole.EMPLOYER.equals(user.getRole())) {
                user.setRole(UserRole.EMPLOYER);
                user = userRepository.save(user);
            }

            Company company = new Company();
            company.setName(user.getFullName() != null && !user.getFullName().isEmpty() ? user.getFullName() : "My Company");
            company.setLocation(user.getLocation());
            company.setOwnerEmail(user.getEmail());
            company.setOwnerName(user.getFullName());
            company.setOwnerPhoneNumber(user.getPhoneNumber());
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
}
