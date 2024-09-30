document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit();

    let currentStep = 'menu';
    let menuOptions = ['[ ] Create new project', '[ ] Select existing project', '[ ] Delete existing project'];
    let selectedOption = 0;
    let userInput = '';
    let actions = ['create', 'select', 'delete'];

    let projects = [];
    let selectedProjectIndex = 0;

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

    resetTerminal();

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
                    currentStep = 'title';
                    terminal.write('\nPlease enter the title of your new project:\r\n> ');
                } else if (actions[selectedOption] === 'select') {
                    fetchProjectsForSelection();
                } else if (actions[selectedOption] === 'delete') {
                    fetchProjectsForDeletion();
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
            } else if (domEvent.key === 'Backspace') {
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
            } else if (char === '\r') {
                const projectToSelect = projects[selectedProjectIndex];
                redirectToTasks(projectToSelect.id);
            }
        } else if (currentStep === 'deleteProjectSelection') {
            if (domEvent.key === 'ArrowUp') {
                selectedProjectIndex = (selectedProjectIndex - 1 + projects.length) % projects.length;
                renderProjectsForDeletion();
            } else if (domEvent.key === 'ArrowDown') {
                selectedProjectIndex = (selectedProjectIndex + 1) % projects.length;
                renderProjectsForDeletion();
            } else if (char === '\r') {
                const projectToDelete = projects[selectedProjectIndex];
                deleteProject(projectToDelete.id);
            }
        }
    });

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
                    selectedProjectIndex = 0; // Reset the selected project index
                    renderProjectsForSelection();
                }
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    function renderProjectsForSelection() {
        terminal.clear();
        terminal.write('Select a project to view its tasks:\r\n');
        projects.forEach((project, index) => {
            let prefix = index === selectedProjectIndex ? '[x]' : '[ ]';
            terminal.write(`${prefix} ${project.title}\r\n`);
        });
        terminal.write("\nUse arrow keys to select and press enter to proceed.");
    }

    function redirectToTasks(projectId) {
        window.location.href = `/tasks.html?projectId=${projectId}`;
    }

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
                    selectedProjectIndex = 0; // Reset the selected project index
                    renderProjectsForDeletion();
                }
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }

    function renderProjectsForDeletion() {
        terminal.clear();
        terminal.write('Select a project to delete:\r\n');
        projects.forEach((project, index) => {
            let prefix = index === selectedProjectIndex ? '[x]' : '[ ]';
            terminal.write(`${prefix} ${project.title}\r\n`);
        });
        terminal.write("\nUse arrow keys to select and press enter to delete.");
    }

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
