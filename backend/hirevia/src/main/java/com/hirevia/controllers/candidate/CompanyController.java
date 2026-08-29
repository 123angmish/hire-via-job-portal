package com.hirevia.controllers.candidate;

import com.hirevia.enums.BusinessType;
import com.hirevia.enums.Industry;
import com.hirevia.models.Company;
import com.hirevia.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping("/all")
    public ResponseEntity<List<Company>> getAllCompaniesHandler() {
        List<Company> companies = companyService.getAllCompanies();
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/industry/{industry}")
    public ResponseEntity<List<Company>> getCompaniesByIndustryHandler(@PathVariable Industry industry) {
        List<Company> companies = companyService.getCompaniesByIndustry(industry);
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/business/{businessType}")
    public ResponseEntity<List<Company>> getCompaniesByBusinessTypeHandler(@PathVariable BusinessType businessType) {
        List<Company> companies = companyService.getCompaniesByBusinessType(businessType);
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Company>> getCompaniesByLocationHandler(@PathVariable String location) {
        List<Company> companies = companyService.getCompaniesByLocation(location);
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompaniesHandler(@RequestParam String keyword) {
        List<Company> companies = companyService.searchCompanies(keyword);
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<Company>> sortCompaniesHandler(@RequestParam String fieldName) {
        List<Company> companies = companyService.getCompaniesSortedBy(fieldName);
        return new ResponseEntity<>(companies, HttpStatus.OK);
    }
}
