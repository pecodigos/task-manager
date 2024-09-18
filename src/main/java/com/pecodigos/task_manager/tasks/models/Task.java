package com.pecodigos.task_manager.tasks.models;

import com.pecodigos.task_manager.tasks.enums.Priority;
import com.pecodigos.task_manager.tasks.enums.Status;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tb_tasks")
public class Task extends RepresentationModel<Task> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;
    private Status status = Status.IN_PROGRESS;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
