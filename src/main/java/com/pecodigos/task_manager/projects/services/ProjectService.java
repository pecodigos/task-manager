package com.pecodigos.task_manager.projects.services;

import com.pecodigos.task_manager.projects.dtos.ProjectDTO;
import com.pecodigos.task_manager.projects.models.Project;
import com.pecodigos.task_manager.projects.repositories.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProjectService implements ProjectServiceInterface{

    @Autowired
    private final ProjectRepository projectRepository;

    @Override
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project saveProject(ProjectDTO projectDTO) {
        var project = new Project();
        BeanUtils.copyProperties(projectDTO, project);

        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(Long id, ProjectDTO projectDTO) {
        Optional<Project> optionalProject = projectRepository.findById(id);

        if (optionalProject.isEmpty()) {
            throw new NoSuchElementException("No project found.");
        }
        var project = optionalProject.get();
        BeanUtils.copyProperties(projectDTO, project);

        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long id) {
        Optional<Project> optionalProject = projectRepository.findById(id);

        if (optionalProject.isEmpty()) {
            throw new NoSuchElementException("No project found.");
        }
        projectRepository.delete(optionalProject.get());
    }
}
