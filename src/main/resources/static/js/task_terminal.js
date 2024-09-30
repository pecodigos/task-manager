document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let currentStep = 'menu'; // Track the current step
    let menuOptions = ['[ ] Create new task', '[ ] View/Edit existing tasks', '[ ] Delete existing task'];
    let selectedOption = 0;
    let userInput = '';
    let actions = ['create', 'view', 'delete']; // Actions for the menu

    // Function to reset the terminal
    function resetTerminal() {
        currentStep = 'menu';
        selectedOption = 0;
        renderMenu();
        terminal.focus();
    }

    // Function to render the menu
    function renderMenu() {
        terminal.clear();
        terminal.write('/tasks >\r\n');
        terminal.write('Use arrow keys to navigate and press enter to select:\r\n');
        menuOptions.forEach((option, index) => {
            let prefix = index === selectedOption ? '[x]' : '[ ]';
            terminal.write(`${prefix} ${option.slice(3)}\r\n`);
        });
    }

    resetTerminal(); // Initialize the terminal

    // Function to handle task creation
    function createTask() {
        terminal.write('\nPlease enter the task title:\r\n> ');
        currentStep = 'createTitle';
    }

    // Function to handle viewing or editing tasks
    function viewEditTasks() {
        fetch('/tasks/', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(tasks => {
                if (tasks.length === 0) {
                    terminal.write('\n\nNo tasks found.\r\n');
                    setTimeout(resetTerminal, 3000);
                } else {
                    terminal.write('\nSelect a task to view/edit:\r\n');
                    tasks.forEach((task, index) => {
                        terminal.write(`[${index + 1}] ${task.title}: ${task.description}\r\n`);
                    });
                    currentStep = 'selectTask';
                }
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    // Function to handle task deletion
    function deleteTask() {
        terminal.write('\nFetching tasks...\r\n');
        fetch('/tasks/', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(tasks => {
                if (tasks.length === 0) {
                    terminal.write('\n\nNo tasks to delete.\r\n');
                    setTimeout(resetTerminal, 3000);
                } else {
                    terminal.write('\nSelect a task to delete:\r\n');
                    tasks.forEach((task, index) => {
                        terminal.write(`[${index + 1}] ${task.title}: ${task.description}\r\n`);
                    });
                    currentStep = 'selectDeleteTask';
                }
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    // Handling key events for the menu and tasks
    terminal.onKey((e) => {
        const char = e.key;
        const domEvent = e.domEvent;

        if (currentStep === 'menu') {
            if (domEvent.key === 'ArrowUp') {
                selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
                renderMenu();
            } else if (domEvent.key === 'ArrowDown') {
                selectedOption = (selectedOption + 1) % menuOptions.length;
                renderMenu();
            } else if (char === '\r') {
                if (actions[selectedOption] === 'create') {
                    currentStep = 'createTitle';
                    terminal.write('\nPlease enter the task title:\r\n> ');
                } else if (actions[selectedOption] === 'view') {
                    viewTasks();
                } else if (actions[selectedOption] === 'delete') {
                    deleteTask();
                }
            }
        } else if (currentStep === 'createTitle' || currentStep === 'createDescription') {
            if (char === '\r') {
                terminal.write('\r\n');
                if (currentStep === 'createTitle') {
                    title = userInput;
                    userInput = '';
                    terminal.write('\nPlease enter the task description:\r\n> ');
                    currentStep = 'createDescription';
                } else if (currentStep === 'createDescription') {
                    description = userInput;
                    terminal.write('\r\nCreating task...\r\n');
                    postTask(title, description);
                }
                userInput = '';
            } else if (domEvent.key === 'Backspace') {
                if (userInput.length > 0) {
                    userInput = userInput.slice(0, -1);
                    terminal.write('\b \b');
                }
            } else {
                terminal.write(char);
                userInput += char;
            }
        }
    });

    // Function to post a new task
    function postTask(description) {
        fetch('/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description })
        })
            .then(response => {
                if (!response.ok) throw new Error('Task not created.');
                return response.json();
            })
            .then(() => {
                terminal.write('Task created successfully!\r\n');
                setTimeout(resetTerminal, 3000);
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    // Function to delete a selected task
    function deleteSelectedTask(taskIndex) {
        fetch(`/tasks/${taskIndex}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete task.');
                terminal.write('\nTask deleted successfully!\r\n');
                setTimeout(resetTerminal, 3000);
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }
});
