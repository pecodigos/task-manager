package com.pecodigos.task_manager.projects.repositories;

import com.pecodigos.task_manager.projects.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByTitle(String title);
}
