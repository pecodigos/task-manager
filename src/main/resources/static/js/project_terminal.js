document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let currentStep = 'title'; // track the current step
    let title = '';
    let description = '';
    let userInput = '';

    function resetTerminal() {
        terminal.clear();
        currentStep = 'title';
        title = '';
        description = '';
        userInput = '';
        terminal.write('Start a new project\r\n');
        terminal.write('Please enter the title of your new project:\r\n> ');
    }

    resetTerminal(); // Call this once at the start

    terminal.onKey((e) => {
        const char = e.key;
        const domEvent = e.domEvent;

        if (char === '\r') { // Enter key pressed
            terminal.write('\r\n');
            if (currentStep === 'title') {
                title = userInput;
                terminal.write('Please enter a description:\r\n> ');
                currentStep = 'description';
                userInput = ''; // Reset input for the next step
            } else if (currentStep === 'description') {
                description = userInput;
                terminal.write('\nCreating project...\r\n');
                postProject(title, description);
            }
        } else if (char === '\u007F' || (domEvent.ctrlKey && char === '\b')) { // Backspace key
            if (userInput.length > 0) {
                terminal.write('\b \b');
                userInput = userInput.slice(0, -1);
            }
        } else {
            terminal.write(char);
            userInput += char;
        }
    });

    // Actual login
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
                terminal.write('Project created successful!\r\n');
            }) // Redirect after successful login
            .catch(error => {
                resetTerminal();
                terminal.write(`Error: ${error.message}\r\n`);
                terminal.write('Please try again.\r\n');
                setTimeout(resetTerminal, 3000); // Reset terminal after a brief delay
            });
    }
});
