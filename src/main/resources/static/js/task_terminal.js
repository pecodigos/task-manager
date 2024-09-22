document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let currentStep = 'username'; // track the current step (username or password)
    let username = '';
    let password = '';
    let userInput = '';

    function resetTerminal() {
        terminal.clear();
        currentStep = 'username';
        username = '';
        password = '';
        userInput = '';
        terminal.write('Welcome to terminal task manager\r\n');
        terminal.write('Please enter your username:\r\n> ');
    }

    resetTerminal(); // Call this once at the start

    terminal.onKey((e) => {
        const char = e.key;
        const domEvent = e.domEvent;

        if (char === '\r') { // Enter key pressed
            terminal.write('\r\n');
            if (currentStep === 'username') {
                username = userInput;
                terminal.write('Please enter your password:\r\n> ');
                currentStep = 'password';
                userInput = ''; // Reset input for the next step
            } else if (currentStep === 'password') {
                password = userInput;
                terminal.write('\nLogging in...\r\n');
                loginUser(username, password);
            }
        } else if (char === '\u007F' || (domEvent.ctrlKey && char === '\b')) { // Backspace key
            if (userInput.length > 0) {
                terminal.write('\b \b');
                userInput = userInput.slice(0, -1);
            }
        } else {
            if (currentStep === 'password') {
                // Append the actual character to userInput but display an asterisk
                userInput += char;
                terminal.write('*'); // Show asterisk instead of the character
            } else {
                terminal.write(char);
                userInput += char; // Regular input for username
            }
        }
    });

    // Actual login
    function loginUser(username, password) {
        fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(() => {
                terminal.write('Login successful!\r\n');
                terminal.write("\nRedirecting...");
                setTimeout(() => {
                    window.location.href = '/tasks.html'; // Redirect to login page
                }, 3000);
            }) // Redirect after successful login
            .catch(error => {
                resetTerminal();
                terminal.write(`Error: ${error.message}\r\n`);
                terminal.write('Please try again.\r\n');
                setTimeout(resetTerminal, 3000); // Reset terminal after a brief delay
            });
    }
});
