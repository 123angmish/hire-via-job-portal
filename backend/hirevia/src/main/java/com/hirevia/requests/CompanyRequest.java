package com.hirevia.requests;

import com.hirevia.enums.Industry;
import lombok.Data;

@Data
public class CompanyRequest {
    private String name;
    private String website;
    private Industry industry;
}