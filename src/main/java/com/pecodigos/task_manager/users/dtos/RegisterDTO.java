package com.pecodigos.task_manager.users.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterDTO(@NotBlank String name, @NotBlank String username, @Email @NotBlank String email, @NotBlank String password) {
}
