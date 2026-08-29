package com.hirevia.service;

import java.util.List;

import com.hirevia.models.User;
import com.hirevia.requests.UserEditProfileRequest;

public interface UserService {
    User findByJwt(String jwt);

    User findById(Long userId);

    List<User> findAllUsers();

    void deleteUser(Long userId);

    User getLoggedInUser();

    User editProfile(User user, UserEditProfileRequest request);
}
