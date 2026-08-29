package com.hirevia.repositories;

import com.hirevia.models.Application;
import com.hirevia.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByJobIdAndUserId(Long jobId, Long userId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByUserId(Long userId);

    @Query("SELECT a.job.id FROM Application a WHERE a.user.id = :userId")
    List<Long> findAppliedJobIdsByUser(@Param("userId") Long userId);

    void deleteByJobId(Long id);

    @Query("""
       SELECT a FROM Application a
       WHERE a.job.employer.id = :employerId
       """)
    List<Application> findApplicationsByEmployerId(@Param("employerId") Long employerId);

    @Query("""
       SELECT a FROM Application a
       WHERE a.job.employer.id = :employerId
       AND (
            :keyword IS NULL OR
            LOWER(a.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(a.job.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
       )
       """)
    List<Application> searchApplications(
            @Param("employerId") Long employerId,
            @Param("keyword") String keyword
    );
}
