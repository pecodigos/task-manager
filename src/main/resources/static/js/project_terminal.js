document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let currentStep = 'menu'; // track the current step
    let menuOptions = ['[ ] Create new project', '[ ] View existing projects'];
    let selectedOption = 0;
    let userInput = '';
    let actions = ['create', 'view']; // action options

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
                    terminal.write('Please enter the title of your new project:\r\n> ');
                } else if (actions[selectedOption] === 'view') {
                    viewProjects(); // Function to handle fetching and displaying projects
                }
            }
        } else if (currentStep === 'title') {
            if (char === '\r') { // Enter key pressed
                terminal.write('\r\n');
                title = userInput;
                terminal.write('\nPlease enter a description:\r\n> ');
                currentStep = 'description';
                userInput = '';
            } else {
                terminal.write(char);
                userInput += char;
            }
        } else if (currentStep === 'description') {
            if (char === '\r') { // Enter key pressed
                terminal.write('\nCreating project...\r\n');
                postProject(title, userInput); // Create project
            } else {
                terminal.write(char);
                userInput += char;
            }
        }
        else if (currentStep === 'viewProjects') {
            if (char === '\r') {
                resetTerminal();
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
                setTimeout(resetTerminal, 3000); // Reset the terminal after creating a project
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                terminal.write('Please try again.\r\n');
                setTimeout(resetTerminal, 3000); // Reset terminal after delay
            });
    }

    function viewProjects() {
        fetch('/projects/', {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    console.log('Error fetching projects');
                }
                return response.text();  // Get the raw text response
            })
            .then(text => {
                const data = text ? JSON.parse(text) : [];  // Parse only if text is not empty
                if (data.length === 0) {
                    terminal.write('\n\nNo projects found.\r\n');
                } else {
                    terminal.write('\nYour projects:\r\n');
                    data.forEach(project => {
                        terminal.write(`- ${project.title}: ${project.description}\r\n`);
                    });
                }
                currentStep = 'viewProjects';
                terminal.write("\n\nPress enter to go back...\r\n");
            })
            .catch(error => {
                terminal.write(`Error: ${error.message}\r\n`);
                setTimeout(resetTerminal, 3000);
            });
    }
});
