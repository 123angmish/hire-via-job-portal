package com.hirevia.controllers.employer;

import com.hirevia.exceptions.InvalidDataException;
import com.hirevia.models.Company;
import com.hirevia.models.Employer;
import com.hirevia.models.User;
import com.hirevia.repositories.CompanyRepository;
import com.hirevia.repositories.EmployerRepository;
import com.hirevia.service.CompanyService;
import com.hirevia.service.EmployerService;
import com.hirevia.service.UserService;
import com.hirevia.util.InputSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.Year;

@RestController
@RequestMapping("/api/employer/companies")
public class EmployerCompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmployerService employerService;

    @Autowired
    private EmployerRepository employerRepository;

    private void validateCompanyInput(Company company) {
        if (company == null) {
            throw new InvalidDataException("Company data cannot be empty");
        }

        if (company.getName() != null) {
            company.setName(InputSanitizer.stripHtml(company.getName().trim()));
            if (company.getName().length() < 2 || company.getName().length() > 150) {
                throw new InvalidDataException("Company name must be between 2 and 150 characters.");
            }
        }

        if (company.getWebsiteUrl() != null && !company.getWebsiteUrl().trim().isEmpty()) {
            String url = company.getWebsiteUrl().trim();
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                if (url.startsWith("javascript:") || url.startsWith("data:") || url.startsWith("file:")) {
                    throw new InvalidDataException("Invalid website URL protocol.");
                }
                company.setWebsiteUrl("https://" + url);
            }
        }

        if (company.getFoundedYear() != null && !company.getFoundedYear().trim().isEmpty()) {
            try {
                int year = Integer.parseInt(company.getFoundedYear().trim());
                int currentYear = Year.now().getValue();
                if (year < 1800 || year > currentYear) {
                    throw new InvalidDataException("Established year must be between 1800 and " + currentYear + ".");
                }
            } catch (NumberFormatException e) {
                throw new InvalidDataException("Established year must be a valid numeric year.");
            }
        }

        if (company.getDescription() != null) {
            company.setDescription(InputSanitizer.sanitize(company.getDescription()));
        }
    }

    @PostMapping
    public ResponseEntity<Company> createCompanyHandler(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Company company) {
        validateCompanyInput(company);
        User user = userService.findByJwt(jwt);
        Employer employer = employerService.getEmployer(user);

        company.setOwnerEmail(user.getEmail());
        company.setOwnerName(user.getFullName());
        company.setOwnerPhoneNumber(user.getPhoneNumber());
        company.setActive(true);

        Company createdCompany = companyRepository.save(company);

        if (employer != null) {
            employer.setCompany(createdCompany);
            employerRepository.save(employer);
        }

        return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
    }

    @PutMapping(value = {"", "/profile", "/{companyId}"})
    public ResponseEntity<Company> updateCompanyHandler(
            @PathVariable(required = false) Long companyId,
            @RequestHeader("Authorization") String jwt,
            @RequestBody Company company) throws AccessDeniedException {

        validateCompanyInput(company);
        User user = userService.findByJwt(jwt);
        Employer employer = employerService.getEmployer(user);

        Long resolvedId = companyId;
        if (resolvedId == null && employer != null && employer.getCompany() != null) {
            resolvedId = employer.getCompany().getId();
        }

        if (resolvedId != null && resolvedId > 0) {
            // IDOR Protection: Verify employer owns this company
            if (employer != null && employer.getCompany() != null && !employer.getCompany().getId().equals(resolvedId)) {
                throw new AccessDeniedException("Unauthorized: You do not have permission to modify this company.");
            }

            Company updatedCompany = companyService.updateCompany(resolvedId, company);
            if (employer != null && employer.getCompany() == null) {
                employer.setCompany(updatedCompany);
                employerRepository.save(employer);
            }
            return new ResponseEntity<>(updatedCompany, HttpStatus.OK);
        }

        // If no company existed yet, initialize and link it
        company.setOwnerEmail(user.getEmail());
        company.setOwnerName(user.getFullName());
        company.setOwnerPhoneNumber(user.getPhoneNumber());
        company.setActive(true);

        Company saved = companyRepository.save(company);
        if (employer != null) {
            employer.setCompany(saved);
            employerRepository.save(employer);
        }
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<String> deleteCompanyHandler(
            @PathVariable Long companyId,
            @RequestHeader("Authorization") String jwt) throws AccessDeniedException {
        User user = userService.findByJwt(jwt);
        Employer employer = employerService.getEmployer(user);

        if (employer == null || employer.getCompany() == null || !employer.getCompany().getId().equals(companyId)) {
            throw new AccessDeniedException("Unauthorized: You do not have permission to delete this company.");
        }

        companyService.deleteCompany(companyId);
        return new ResponseEntity<>("Company deleted successfully", HttpStatus.OK);
    }
}
