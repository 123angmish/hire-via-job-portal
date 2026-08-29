package com.hirevia.controllers.candidate;

import com.hirevia.models.User;
import com.hirevia.requests.UserEditProfileRequest;
import com.hirevia.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String jwt) {
        User user = userService.findByJwt(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/edit-profile")
    public ResponseEntity<User> editProfile(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody UserEditProfileRequest request
    ) {
        User user = userService.findByJwt(jwt);
        User editedProfile = userService.editProfile(user, request);
        return new ResponseEntity<>(editedProfile, HttpStatus.OK);
    }
}
