package com.pecodigos.task_manager.users.dtos;

import jakarta.validation.constraints.NotBlank;

public record UserDTO(@NotBlank String name, @NotBlank String username, @NotBlank String email, @NotBlank String password) {
}
