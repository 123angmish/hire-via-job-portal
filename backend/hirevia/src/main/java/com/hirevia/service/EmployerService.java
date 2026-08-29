package com.hirevia.service;

import com.hirevia.models.Employer;
import com.hirevia.models.User;

public interface EmployerService {
    Employer getEmployerById(Long employerId);

    Employer getEmployer(User user);
}
