package com.pecodigos.task_manager.tasks.services;

import com.pecodigos.task_manager.tasks.dtos.TaskDTO;
import com.pecodigos.task_manager.tasks.models.Task;

import java.util.List;
import java.util.Optional;

public interface TaskServiceInterface {
    Optional<Task> getTaskById(Long id);
    List<Task> getAllTasks();
    Task saveTask(TaskDTO taskDTO);
    Task updateTask(Long id, TaskDTO taskDTO);
    void deleteTask(Long id);
}
