package com.pecodigos.task_manager.projects.controllers;

import com.pecodigos.task_manager.projects.dtos.ProjectDTO;
import com.pecodigos.task_manager.projects.models.Project;
import com.pecodigos.task_manager.projects.services.ProjectService;
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
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getProject(@PathVariable(name = "id") Long id) {
        Optional<Project> optionalProject = projectService.getProjectById(id);

        if (optionalProject.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found.");
        }
        optionalProject.get().add(linkTo(methodOn(ProjectController.class).getAllProjects()).withSelfRel());

        return ResponseEntity.status(HttpStatus.OK).body(optionalProject.get());
    }

    @GetMapping("/")
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projectList = projectService.getAllProjects();

        if (!projectList.isEmpty()) {
            for (Project project : projectList) {
                project.add(linkTo(methodOn(ProjectController.class).getProject(project.getId())).withSelfRel());
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(projectList);
    }

    @PostMapping("/")
    public ResponseEntity<Object> saveProject(@Valid @RequestBody ProjectDTO projectDTO) {
        try {
            var project = projectService.saveProject(projectDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(project);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProject(@PathVariable(name = "id") Long id, @Valid @RequestBody ProjectDTO projectDTO) {
        try {
            var project = projectService.updateProject(id, projectDTO);
            return ResponseEntity.status(HttpStatus.OK).body(project);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProject(@PathVariable(name = "id") Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.status(HttpStatus.OK).body("Project deleted successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
