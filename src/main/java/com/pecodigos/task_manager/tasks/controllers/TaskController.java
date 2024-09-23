package com.pecodigos.task_manager.tasks.controllers;

import com.pecodigos.task_manager.tasks.dtos.TaskDTO;
import com.pecodigos.task_manager.tasks.models.Task;
import com.pecodigos.task_manager.tasks.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/tasks")
    public String tasksPage() {
        return "tasks";
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getTask(@PathVariable(name = "id") Long id) {
        Optional<Task> optionalTask = taskService.getTaskById(id);

        if (optionalTask.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        optionalTask.get().add(linkTo(methodOn(TaskController.class).getAllTasks()).withSelfRel());

        return ResponseEntity.status(HttpStatus.OK).body(optionalTask.get());
    }

    @GetMapping("/")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> taskList = taskService.getAllTasks();

        if (!taskList.isEmpty()) {
            for (Task task : taskList) {
                task.add(linkTo(methodOn(TaskController.class).getTask(task.getId())).withSelfRel());
            }
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(taskList);
    }

    @PostMapping("/")
    public ResponseEntity<Object> saveTask(@Valid @RequestBody TaskDTO taskDTO) {
        try {
            var task = taskService.saveTask(taskDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateTask(@PathVariable(name = "id") Long id, @Valid @RequestBody TaskDTO taskDTO) {
        try {
            var updatedTask = taskService.updateTask(id, taskDTO);
            return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable(name = "id") Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.status(HttpStatus.OK).body("Task deleted successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
