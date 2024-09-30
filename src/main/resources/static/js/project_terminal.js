document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let currentStep = 'menu'; // track the current step
    let menuOptions = ['[ ] Create new project', '[ ] Select existing project', '[ ] Delete existing project'];
    let selectedOption = 0;
    let userInput = '';
    let actions = ['create', 'select', 'delete'];

    let projects = []; // To store fetched projects
    let selectedProjectIndex = 0; // To track selected project

    function resetTerminal() {
        currentStep = 'menu';
        selectedOption = 0;
        renderMenu();
        terminal.focus();
    }

    function renderMenu() {
        terminal.clear();
        terminal.write('/projects >\r\n');
        terminal.write('Use arrow keys to navigate and press enter to select:\r\n');
        menuOptions.forEach((option, index) => {
            let prefix = index === selectedOption ? '[x]' : '[ ]';
            terminal.write(`${prefix} ${option.slice(3)}\r\n`);
        });
    }

    resetTerminal(); // Initialize terminal

    terminal.onKey((e) => {
        const char = e.key;
        const domEvent = e.domEvent;

        // Handle menu navigation
        if (currentStep === 'menu') {
            if (domEvent.key === 'ArrowUp') {
                selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
                renderMenu();
            } else if (domEvent.key === 'ArrowDown') {
                selectedOption = (selectedOption + 1) % menuOptions.length;
                renderMenu();
            } else if (char === '\r') { // Enter key pressed
                if (actions[selectedOption] === 'create') {
                    currentStep = 'title'; // Go to the project creation step
                    terminal.write('\nPlease enter the title of your new project:\r\n> ');
                } else if (actions[selectedOption] === 'select') {
                    fetchProjectsForSelection(); // Fetch and select a project
                } else if (actions[selectedOption] === 'delete') {
                    fetchProjectsForDeletion(); // Fetch projects for deletion
                }
            }
        } else if (currentStep === 'title' || currentStep === 'description') {
            if (char === '\r') {
                terminal.write('\r\n');
                if (currentStep === 'title') {
                    title = userInput;
                    terminal.write('\nPlease enter a description:\r\n> ');
                    currentStep = 'description';
                } else if (currentStep === 'description') {
                    terminal.write('\r\nCreating project...\r\n');
                    postProject(title, userInput);
                }
                userInput = '';
            } else if (domEvent.key === 'Backspace') { // Handle Backspace key
                if (userInput.length > 0) {
                    userInput = userInput.slice(0, -1);
                    terminal.write('\b \b');
                }
            } else {
                terminal.write(char);
                userInput += char;
            }
        } else if (currentStep === 'selectProject') {
            if (domEvent.key === 'ArrowUp') {
                selectedProjectIndex = (selectedProjectIndex - 1 + projects.length) % projects.length;
                renderProjectsForSelection();
            } else if (domEvent.key === 'ArrowDown') {
                selectedProjectIndex = (selectedProjectIndex + 1) % projects.length;
                renderProjectsForSelection();
            } else if (char === '\r') { // Enter key pressed
                const projectToSelect = projects[selectedProjectIndex];
                redirectToTasks(projectToSelect.id); // Redirect to tasks.html with the project ID
            }
        }
    });

    // Function to handle project creation
    function postProject(title, description) {
        fetch('/projects/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Project was not created.');
                }
                return response.json();
            })
            .then(() => {
                terminal.write('Project created successfully!\r\n');
                setTimeout(resetTerminal, 3000);
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                terminal.write('Please try again.\r\n');
                setTimeout(resetTerminal, 3000);
            });
    }

    // Function to fetch projects for selection
    function fetchProjectsForSelection() {
        fetch('/projects/', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching projects for selection.');
                }
                return response.json();
            })
            .then(data => {
                projects = data;
                if (projects.length === 0) {
                    terminal.write('\n\nNo projects available to select.\r\n');
                    setTimeout(resetTerminal, 3000);
                } else {
                    currentStep = 'selectProject';
                    renderProjectsForSelection();
                }
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    // Render projects for selection
    function renderProjectsForSelection() {
        terminal.clear();
        terminal.write('Select a project to view its tasks:\r\n');
        projects.forEach((project, index) => {
            let prefix = index === selectedProjectIndex ? '[x]' : '[ ]';
            terminal.write(`${prefix} ${project.title}\r\n`);
        });
        terminal.write("\nUse arrow keys to select and press enter to proceed.");
    }

    // Function to redirect to tasks.html with the selected project ID
    function redirectToTasks(projectId) {
        window.location.href = `/tasks.html?projectId=${projectId}`;
    }

    // Function to fetch projects for deletion
    function fetchProjectsForDeletion() {
        fetch('/projects/', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching projects for deletion.');
                }
                return response.json();
            })
            .then(data => {
                projects = data;
                if (projects.length === 0) {
                    terminal.write('\n\nNo projects available to delete.\r\n');
                    setTimeout(resetTerminal, 3000);
                } else {
                    currentStep = 'deleteProjectSelection';
                    renderProjectsForDeletion();
                }
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    // Render projects for deletion
    function renderProjectsForDeletion() {
        terminal.clear();
        terminal.write('Select a project to delete:\r\n');
        projects.forEach((project, index) => {
            let prefix = index === selectedProjectIndex ? '[x]' : '[ ]';
            terminal.write(`${prefix} ${project.title}\r\n`);
        });
        terminal.write("\nUse arrow keys to select and press enter to delete.");
    }

    // Function to delete a project
    function deleteProject(projectId) {
        fetch(`/projects/${projectId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete project.');
                }
                terminal.write('\nProject deleted successfully!\r\n');
                setTimeout(resetTerminal, 3000);
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }
});
