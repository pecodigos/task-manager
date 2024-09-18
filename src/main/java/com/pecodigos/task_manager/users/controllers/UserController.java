package com.pecodigos.task_manager.users.controllers;

import com.pecodigos.task_manager.users.dtos.UserDTO;
import com.pecodigos.task_manager.users.models.User;
import com.pecodigos.task_manager.users.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUser(@PathVariable(value = "id") UUID id) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found.");
        }
        optionalUser.get().add(linkTo(methodOn(UserController.class).getAllUsers()).withSelfRel());


        return ResponseEntity.status(HttpStatus.OK).body(optionalUser.get());
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> userList = userRepository.findAll();

        if (!userList.isEmpty()) {
            for (User user : userList) {
                user.add(linkTo(methodOn(UserController.class).getUser(user.getId())).withSelfRel());
            }
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(userList);
    }

    @PostMapping("/")
    public ResponseEntity<Object> saveUser(@Valid @RequestBody UserDTO userDTO) {

        if (userRepository.findByUsername(userDTO.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists.");
        }
        if (userRepository.findByEmail(userDTO.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("There's already an account with that email.");
        }
        var user = new User();
        BeanUtils.copyProperties(userDTO, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUser(@PathVariable(value = "id") UUID id, @Valid @RequestBody UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        var user = optionalUser.get();
        BeanUtils.copyProperties(userDTO, user);

        return ResponseEntity.status(HttpStatus.OK).body(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable(value = "id") UUID id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        userRepository.delete(optionalUser.get());

        return ResponseEntity.status(HttpStatus.OK).body("User was deleted successfully.");
    }
}
