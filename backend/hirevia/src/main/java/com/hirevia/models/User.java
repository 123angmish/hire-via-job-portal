package com.hirevia.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hirevia.enums.UserRole;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String fullName;

    @NotNull
    private String email;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String resume;

    @ElementCollection
    private List<String> skills = new ArrayList<>();

    private String location;
    private String experience;

    @NotNull
    private String phoneNumber;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String profilePicture;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String bio;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<SavedJob> savedJobs;

    private boolean isActive = true;
    private boolean isVerified = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public User(String fullName, String email, String password, String resume, List<String> skills, String location,
                String experience, String phoneNumber, String profilePicture, String bio) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.resume = resume;
        this.skills = skills;
        this.location = location;
        this.experience = experience;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.bio = bio;
    }
}
