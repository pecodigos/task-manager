package com.pecodigos.task_manager.tasks.services;

import com.pecodigos.task_manager.tasks.dtos.TaskDTO;
import com.pecodigos.task_manager.tasks.models.Task;
import com.pecodigos.task_manager.users.models.User;

import java.util.List;
import java.util.Optional;

public interface TaskServiceInterface {
    Optional<Task> getTaskById(Long id);
    List<Task> getAllTasks();
    Task saveTask(TaskDTO taskDTO, User user);
    Task updateTask(Long id, TaskDTO taskDTO);
    void deleteTask(Long id);
}
