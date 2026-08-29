package com.hirevia.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.hirevia.enums.AppliedStatus;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @Enumerated(EnumType.STRING)
    private AppliedStatus status;

    @CreationTimestamp
    private LocalDateTime appliedDate;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumeUrl;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
