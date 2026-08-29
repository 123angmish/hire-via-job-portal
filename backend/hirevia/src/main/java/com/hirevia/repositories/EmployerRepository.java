package com.hirevia.repositories;

import com.hirevia.models.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Employer findByUserId(Long userId);
}
