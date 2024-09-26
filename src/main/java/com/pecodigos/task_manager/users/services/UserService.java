package com.pecodigos.task_manager.users.services;

import com.pecodigos.task_manager.users.dtos.LoginDTO;
import com.pecodigos.task_manager.users.dtos.UserDTO;
import com.pecodigos.task_manager.users.models.User;
import com.pecodigos.task_manager.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserServiceInterface{

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    @Override
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User saveUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (userRepository.findByEmail(userDTO.email()).isPresent()) {
            throw new IllegalArgumentException("There's an account with that email");
        }
        var user = new User();
        BeanUtils.copyProperties(userDTO, user);
        user.setPassword(hashPassword(userDTO.password()));

        return userRepository.save(user);
    }

    @Override
    public User loginUser(LoginDTO loginDTO) {
        Optional<User> optionalUser = userRepository.findByUsername(loginDTO.username());

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password.");
        }
        var user = optionalUser.get();

        if (!passwordEncoder.matches(loginDTO.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        return user;
    }

    @Override
    public User updateUser(UUID id, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            throw new NoSuchElementException("User not found.");
        }
        var user = optionalUser.get();
        BeanUtils.copyProperties(userDTO, user);

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(UUID id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            throw new NoSuchElementException("User not found.");
        }
        userRepository.delete(optionalUser.get());
    }
}
