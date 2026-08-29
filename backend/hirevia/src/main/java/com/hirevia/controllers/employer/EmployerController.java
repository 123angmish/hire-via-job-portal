package com.hirevia.controllers.employer;

import com.hirevia.models.Employer;
import com.hirevia.models.User;
import com.hirevia.service.EmployerService;
import com.hirevia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmployerService employerService;

    @GetMapping("/profile")
    public ResponseEntity<Employer> getEmployerProfileHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        Employer employer = employerService.getEmployer(user);

        return new ResponseEntity<>(employer, HttpStatus.OK);
    }
}
