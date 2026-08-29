package com.hirevia.service;

import com.hirevia.enums.BusinessType;
import com.hirevia.enums.Industry;
import com.hirevia.models.Company;

import java.util.List;

public interface CompanyService {
    Company createCompany(Company company);

    Company getCompanyById(Long companyId);

    Company updateCompany(Long companyId, Company company);

    void deleteCompany(Long companyId);

    List<Company> getAllCompanies();

    List<Company> getCompaniesByIndustry(Industry industry);

    List<Company> getCompaniesByLocation(String location);

    List<Company> getCompaniesByBusinessType(BusinessType businessType);

    List<Company> searchCompanies(String keyword);

    List<Company> getCompaniesSortedBy(String fieldName);
}
