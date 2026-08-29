package com.hirevia.service.Impl;

import com.hirevia.enums.BusinessType;
import com.hirevia.enums.Industry;
import com.hirevia.exceptions.InvalidDataException;
import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.Company;
import com.hirevia.repositories.CompanyRepository;
import com.hirevia.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public Company createCompany(Company company) {
        if (company.getName() == null || company.getName().trim().isEmpty()) {
            throw new InvalidDataException("Company name is required!");
        }
        return companyRepository.save(company);
    }

    @Override
    public Company getCompanyById(Long companyId) {
        return companyRepository.findById(companyId).orElseThrow(() -> new NotFoundException("Company Not Found!"));
    }

    @Override
    public Company updateCompany(Long companyId, Company company) {
        Company existingCompany = this.getCompanyById(companyId);

        if (company.getName() != null) {
            existingCompany.setName(company.getName().trim());
        }
        existingCompany.setDescription(company.getDescription());
        existingCompany.setLocation(company.getLocation());
        existingCompany.setLogoUrl(company.getLogoUrl());
        existingCompany.setWebsiteUrl(company.getWebsiteUrl());
        existingCompany.setFoundedYear(company.getFoundedYear());
        if (company.getOwnerEmail() != null && !company.getOwnerEmail().trim().isEmpty()) {
            existingCompany.setOwnerEmail(company.getOwnerEmail().trim());
        }
        existingCompany.setOwnerName(company.getOwnerName());
        existingCompany.setOwnerPhoneNumber(company.getOwnerPhoneNumber());
        existingCompany.setSize(company.getSize());
        existingCompany.setBusinessType(company.getBusinessType());
        existingCompany.setIndustry(company.getIndustry());
        existingCompany.setActive(company.isActive());

        return companyRepository.save(existingCompany);
    }

    @Override
    public void deleteCompany(Long companyId) {
        Company company = this.getCompanyById(companyId);
        companyRepository.delete(company);
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public List<Company> getCompaniesByIndustry(Industry industry) {
        return companyRepository.findByIndustry(industry);
    }

    @Override
    public List<Company> getCompaniesByLocation(String location) {
        return companyRepository.findByLocation(location);
    }

    @Override
    public List<Company> getCompaniesByBusinessType(BusinessType businessType) {
        return companyRepository.findByBusinessType(businessType);
    }

    @Override
    public List<Company> searchCompanies(String keyword) {
        return companyRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Override
    public List<Company> getCompaniesSortedBy(String fieldName) {
        return companyRepository.findAll(Sort.by(Sort.Direction.ASC));
    }
}
