package com.pecodigos.task_manager.users.models;

import com.pecodigos.task_manager.tasks.models.Task;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.Length;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_users")
public class User extends RepresentationModel<User> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank
    private String name;

    @Pattern(regexp = "\\S+", message = "The field username should not contain spaces")
    private String username;

    @Email
    private String email;

    @Length(min = 10, max = 100)
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Task> tasks;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
