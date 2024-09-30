# Terminal Task Manager

A **task management terminal interface** built using **Spring Boot**, **Spring Security**, **PostgreSQL**, and **Docker Compose**. This project enables users to create, view/edit, and delete tasks through a terminal-like interface built with **xterm.js**. The back-end of the project is implemented using **Java** (with **Maven** for dependency management) and follows a REST architecture.

## Features

- **Project Management**: Create, view, and delete projects.
- **Task Management**: Create, view, edit, and delete tasks within projects.
- **Authentication**: Secure user login and registration with **Spring Security**.
- **Terminal Interface**: A custom terminal interface using **xterm.js** for an interactive command-line style experience.

## Technologies Used

- **Back-end**:
    - Java (Spring Boot, Spring Security)
    - PostgreSQL (Database)
    - Docker Compose (Database setup and deployment)
    - Maven (Dependency management)

- **Front-end**:
    - xterm.js (Terminal interface for project and task management)

## Prerequisites

- **Java 17+**
- **Maven**
- **Docker** and **Docker Compose**
- **Node.js** and **npm** (for front-end)
- **PostgreSQL** (installed locally or in Docker)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. Build the back-end:
   ```bash
   ./mvnw clean install
   ```

3. Start the PostgreSQL database using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

5. Install front-end dependencies and start the development server for the terminal interface:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Docker Setup

The project includes a `docker-compose.yml` file that sets up a **PostgreSQL** instance for the application:

```yaml
services:
  postgresql:
    container_name: task_manager_postgres
    image: postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=task_manager
```

To start the database, use:

```bash
docker-compose up -d
```

## API Endpoints

- **Projects**
    - `GET /projects/`: Get all projects.
    - `POST /projects/`: Create a new project.
    - `DELETE /projects/{id}`: Delete a project.

- **Tasks**
    - `GET /tasks/`: Get all tasks for a project.
    - `POST /tasks/`: Create a new task.
    - `PUT /tasks/{id}`: Edit an existing task.
    - `DELETE /tasks/{id}`: Delete a task.

## Security

The application uses **Spring Security** to handle authentication and authorization. Upon starting the server, you can register new users via the `/register` endpoint and log in via the `/login` endpoint.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
