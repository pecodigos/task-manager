// Fetch all tasks and display them
function fetchTasks() {
    fetch('http://localhost:8080/tasks/')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.title;
                taskList.appendChild(li);
            });
        });
}

// Create a new task
document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;

    fetch('http://localhost:8080/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: taskTitle,
            description: taskDescription
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task created:', data);
            fetchTasks();  // Refresh the task list
        })
        .catch(error => {
            console.error('Error creating task:', error);
        });
});

// Load tasks on page load
window.onload = fetchTasks;
