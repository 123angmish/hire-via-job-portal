package com.hirevia.service.Impl;

import com.hirevia.config.JwtProvider;
import com.hirevia.enums.UserRole;
import com.hirevia.exceptions.AlreadyExistsException;
import com.hirevia.exceptions.InvalidDataException;
import com.hirevia.models.Company;
import com.hirevia.models.Employer;
import com.hirevia.models.User;
import com.hirevia.repositories.CompanyRepository;
import com.hirevia.repositories.EmployerRepository;
import com.hirevia.repositories.UserRepository;
import com.hirevia.requests.LoginUserRequest;
import com.hirevia.requests.RegistrationUserRequest;
import com.hirevia.responses.AuthResponse;
import com.hirevia.service.AuthService;
import com.hirevia.util.InputSanitizer;
import com.hirevia.util.RateLimiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Override
    public AuthResponse registerUser(RegistrationUserRequest request) {
        String normalizedEmail = InputSanitizer.normalizeEmail(request.getEmail());

        if (!rateLimiterService.isAllowed("register_" + normalizedEmail)) {
            throw new InvalidDataException("Too many registration requests. Please wait a minute.");
        }

        User isExists = userRepository.findByEmail(normalizedEmail);

        if (isExists != null) {
            if (passwordEncoder.matches(request.getPassword(), isExists.getPassword())) {
                if (request.getRole() != null) {
                    isExists.setRole(request.getRole());
                }
                userRepository.save(isExists);
            } else {
                throw new AlreadyExistsException("An account with email " + normalizedEmail + " already exists. Please log in.");
            }
        }

        User user = (isExists != null) ? isExists : new User();

        user.setFullName(InputSanitizer.stripHtml(request.getFullName()));
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResume(request.getResume());
        user.setPhoneNumber(InputSanitizer.normalizePhone(request.getPhoneNumber() != null ? request.getPhoneNumber() : "9717017909"));
        user.setLocation(InputSanitizer.stripHtml(request.getLocation() != null ? request.getLocation() : "Delhi, India"));
        if (request.getSkills() != null) {
            List<String> mutableSkills = new ArrayList<>();
            for (String s : request.getSkills()) {
                if (s != null && !s.trim().isEmpty()) {
                    mutableSkills.add(InputSanitizer.stripHtml(s.trim()));
                }
            }
            user.setSkills(mutableSkills);
        }

        UserRole role = request.getRole() != null ? request.getRole() : UserRole.CANDIDATE;
        user.setRole(role);
        user.setActive(true);
        user.setVerified(true);

        user = userRepository.save(user);

        if (role == UserRole.EMPLOYER) {
            Employer employer = employerRepository.findByUserId(user.getId());
            if (employer == null) {
                employer = new Employer();
                employer.setUser(user);

                String companyName = request.getCompany() != null && request.getCompany().getName() != null
                        ? InputSanitizer.stripHtml(request.getCompany().getName()) : user.getFullName() + " Technologies";

                Optional<Company> existingCompany = companyRepository.findByName(companyName);
                Company company;

                if (existingCompany.isPresent()) {
                    company = existingCompany.get();
                } else if (request.getCompany() != null) {
                    company = companyRepository.save(request.getCompany());
                } else {
                    Company newComp = new Company();
                    newComp.setName(companyName);
                    newComp.setLocation("Delhi, India");
                    newComp.setOwnerEmail(normalizedEmail);
                    newComp.setOwnerName(user.getFullName());
                    newComp.setOwnerPhoneNumber(user.getPhoneNumber());
                    newComp.setActive(true);
                    company = companyRepository.save(newComp);
                }

                employer.setCompany(company);
                employer.setActive(true);
                employerRepository.save(employer);
            }
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(normalizedEmail, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        return new AuthResponse(jwt, user.getRole(), "User Registered Successfully!");
    }

    @Override
    public AuthResponse loginUser(LoginUserRequest request) {
        String normalizedEmail = InputSanitizer.normalizeEmail(request.getEmail());

        if (!rateLimiterService.isAllowed("login_" + normalizedEmail)) {
            throw new InvalidDataException("Too many login attempts. Please wait a minute and try again.");
        }

        User user = userRepository.findByEmail(normalizedEmail);

        if (user == null) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        if (request.getRole() != null && !request.getRole().equals(user.getRole())) {
            user.setRole(request.getRole());
            user = userRepository.save(user);
        }

        if (user.getRole() == UserRole.EMPLOYER) {
            Employer employer = employerRepository.findByUserId(user.getId());
            if (employer == null) {
                employer = new Employer();
                employer.setUser(user);
                Company company = new Company();
                company.setName(user.getFullName() + " Technologies");
                company.setLocation(user.getLocation() != null ? user.getLocation() : "Delhi, India");
                company.setOwnerEmail(user.getEmail());
                company.setOwnerName(user.getFullName());
                company.setOwnerPhoneNumber(user.getPhoneNumber());
                company.setActive(true);
                company = companyRepository.save(company);
                employer.setCompany(company);
                employer.setActive(true);
                employerRepository.save(employer);
            }
        }

        rateLimiterService.reset("login_" + normalizedEmail);

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        return new AuthResponse(jwt, user.getRole(), "Login Successful!");
    }

}
