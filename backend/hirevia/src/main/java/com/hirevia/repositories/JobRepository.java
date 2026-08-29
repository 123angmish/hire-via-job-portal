package com.hirevia.repositories;

import com.hirevia.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId(Long employerId);

    List<Job> findByCategoryId(Long categoryId);

    List<Job> findByTitleContainingIgnoreCase(String name);

    List<Job> findByCompanyId(Long companyId);

    List<Job> findAllByOrderByCreatedAtDesc();


    @Query("""
            SELECT DISTINCT j FROM Job j
            JOIN j.requiredSkills rs
            WHERE rs IN :skills
            AND j.isActive = true
            """)
    List<Job> findRecommendedJobs(
            @Param("skills") List<String> skills
    );


    @Query("""
       SELECT j FROM Job j
       WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
       AND (:location IS NULL OR LOWER(j.company.location) LIKE LOWER(CONCAT('%', :location, '%')))
       """)
    List<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location
    );
}

