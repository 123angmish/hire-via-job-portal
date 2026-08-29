package com.hirevia.service.Impl;

import com.hirevia.config.JwtProvider;
import com.hirevia.enums.UserRole;
import com.hirevia.exceptions.NotFoundException;
import com.hirevia.models.User;
import com.hirevia.repositories.UserRepository;
import com.hirevia.requests.UserEditProfileRequest;
import com.hirevia.service.UserService;
import com.hirevia.util.InputSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findByJwt(String jwt) {
        if (jwt == null || jwt.trim().isEmpty()) {
            throw new NotFoundException("Session expired. Please log in again.");
        }
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        if (email == null || email.trim().isEmpty()) {
            throw new NotFoundException("Session expired. Please log in again.");
        }

        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            String namePart = email.contains("@") ? email.substring(0, email.indexOf("@")) : "User";
            user.setFullName(namePart);
            user.setRole(UserRole.CANDIDATE);
            user.setPassword("N/A");
            user.setPhoneNumber("9717017909");
            user.setLocation("Delhi, India");
            user.setActive(true);
            user.setVerified(true);
            user = userRepository.save(user);
        }

        return user;
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User Not Found with ID: " + userId));
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long userId) {
        User user = this.findById(userId);
        userRepository.delete(user);
    }

    @Override
    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new NotFoundException("No authenticated user found");
        }

        String username = authentication.getName();
        User user = userRepository.findByEmail(username);

        if (user == null) {
            user = new User();
            user.setEmail(username);
            String namePart = username.contains("@") ? username.substring(0, username.indexOf("@")) : "User";
            user.setFullName(namePart);
            user.setRole(UserRole.CANDIDATE);
            user.setPassword("N/A");
            user.setPhoneNumber("9717017909");
            user.setLocation("Delhi, India");
            user.setActive(true);
            user.setVerified(true);
            user = userRepository.save(user);
        }

        return user;
    }

    @Override
    public User editProfile(User user, UserEditProfileRequest request) {
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(InputSanitizer.stripHtml(request.getFullName()));
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(InputSanitizer.normalizePhone(request.getPhoneNumber()));
        }

        if (request.getLocation() != null) {
            user.setLocation(InputSanitizer.stripHtml(request.getLocation()));
        }

        if (request.getExperience() != null) {
            user.setExperience(InputSanitizer.stripHtml(request.getExperience()));
        }

        if (request.getSkills() != null) {
            List<String> mutableSkills = new ArrayList<>();
            for (String s : request.getSkills()) {
                if (s != null && !s.trim().isEmpty()) {
                    mutableSkills.add(InputSanitizer.stripHtml(s.trim()));
                }
            }
            user.setSkills(mutableSkills);
        }

        if (request.getResume() != null) {
            user.setResume(request.getResume());
        }

        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        if (request.getBio() != null) {
            user.setBio(InputSanitizer.stripHtml(request.getBio()));
        }

        return userRepository.save(user);
    }
}
