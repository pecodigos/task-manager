package com.pecodigos.task_manager.tasks.dtos;

import com.pecodigos.task_manager.tasks.enums.Priority;
import com.pecodigos.task_manager.tasks.enums.Status;
import jakarta.validation.constraints.NotBlank;

public record TaskDTO(@NotBlank String title, @NotBlank String description, Priority priority, Status status) {
}
