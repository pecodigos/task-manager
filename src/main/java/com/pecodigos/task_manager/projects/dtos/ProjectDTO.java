package com.pecodigos.task_manager.projects.dtos;

import jakarta.validation.constraints.NotBlank;

public record ProjectDTO(@NotBlank String title, @NotBlank String description) {
}
