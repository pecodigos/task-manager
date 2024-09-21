package com.pecodigos.task_manager.users.services;

import com.pecodigos.task_manager.users.dtos.LoginDTO;
import com.pecodigos.task_manager.users.dtos.UserDTO;
import com.pecodigos.task_manager.users.models.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserServiceInterface {
    Optional<User> getUserById(UUID id);
    List<User> getAllUsers();
    User saveUser(UserDTO userDTO);
    User loginUser(LoginDTO loginDTO);
    User updateUser(UUID id, UserDTO userDTO);
    void deleteUser(UUID id);
}
