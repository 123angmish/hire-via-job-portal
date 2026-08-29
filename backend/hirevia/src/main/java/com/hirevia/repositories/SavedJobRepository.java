package com.hirevia.repositories;

import com.hirevia.models.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserId(Long userId);

    boolean existsByJobIdAndUserId(Long jobId, Long userId);

    Optional<SavedJob> findByIdAndUser_Id(Long savedJobId, Long userId);

    void deleteByJobId(Long id);

}
