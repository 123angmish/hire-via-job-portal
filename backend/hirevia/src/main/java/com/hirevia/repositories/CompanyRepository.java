package com.hirevia.repositories;

import com.hirevia.enums.BusinessType;
import com.hirevia.enums.Industry;
import com.hirevia.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByIndustry(Industry industry);

    List<Company> findByLocation(String location);

    Optional<Company> findByName(String name);

    List<Company> findByBusinessType(BusinessType businessType);

    List<Company> findByNameContainingIgnoreCase(String name);
}
