package com.pecodigos.task_manager.tasks.services;

import com.pecodigos.task_manager.projects.models.Project;
import com.pecodigos.task_manager.projects.repositories.ProjectRepository;
import com.pecodigos.task_manager.tasks.dtos.TaskDTO;
import com.pecodigos.task_manager.tasks.enums.Priority;
import com.pecodigos.task_manager.tasks.enums.Status;
import com.pecodigos.task_manager.tasks.models.Task;
import com.pecodigos.task_manager.tasks.repositories.TaskRepository;
import com.pecodigos.task_manager.users.models.User;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TaskService implements TaskServiceInterface{

    @Autowired
    private final TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task saveTask(TaskDTO taskDTO, User user) {
        var project = projectRepository.findById(taskDTO.projectId()).orElseThrow(() -> new NoSuchElementException("Project not found with ID:" + taskDTO.projectId()));

        var task = new Task();
        BeanUtils.copyProperties(taskDTO, task);

        task.setStatus(Status.IN_PROGRESS);
        task.setPriority(Priority.MEDIUM);
        task.setProject(project);
        task.setUser(user);

        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, TaskDTO taskDTO) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            throw new NoSuchElementException("No task found");
        }
        var task = optionalTask.get();
        BeanUtils.copyProperties(taskDTO, task);

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            throw new NoSuchElementException("No task found.");
        }
        taskRepository.delete(optionalTask.get());
    }
}
