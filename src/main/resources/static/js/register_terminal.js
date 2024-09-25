document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let currentStep = 'name';
    let name = '';
    let username = '';
    let email = '';
    let password = '';
    let userInput = '';

    function resetTerminal() {
        terminal.clear();
        currentStep = 'name';
        name = '';
        username = '';
        email = '';
        password = '';
        userInput = '';
        terminal.write('/register >\r\n');
        terminal.write('Please enter your name:\r\n> ');
        terminal.focus();
    }

    resetTerminal();

    terminal.onKey((e) => {
        const char = e.key;
        const domEvent = e.domEvent;

        if (char === '\r') { // Enter key pressed
            terminal.write('\r\n');
            if (currentStep === 'name') {
                name = userInput;
                terminal.write('Please enter your username:\r\n> ');
                currentStep = 'username';
                userInput = ''; // Reset input for the next step
            } else if (currentStep === 'username') {
                username = userInput;
                terminal.write('Please enter your email:\r\n> ');
                currentStep = 'email';
                userInput = ''; // Reset input for the next step
            } else if (currentStep === 'email') {
                email = userInput;
                terminal.write('Please enter your password:\r\n> ');
                currentStep = 'password';
                userInput = ''; // Reset input for the next step
            } else if (currentStep === 'password') {
                password = userInput;
                terminal.write('Registering...\r\n');
                registerUser(name, username, email, password);
            }
        } else if (char === '\u007F' || (char === '\b' && domEvent.ctrlKey)) { // Backspace key
            if (userInput.length > 0) {
                terminal.write('\b \b');
                userInput = userInput.slice(0, -1);
                // If current step is password, we need to handle masking
                if (currentStep === 'password') {
                    terminal.write('\b \b'); // Remove the last asterisk too
                }
            }
        } else {
            if (currentStep === 'password') {
                terminal.write('*'); // Show asterisk instead of the character
            } else {
                terminal.write(char);
            }
            userInput += char; // Always append the actual character
        }
    });

    // Actual registration
    function registerUser(name, username, email, password) {
        fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, username, email, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                return response.json();
            })
            .then(() => {
                terminal.write('\nRegistration successful!\r\n');
                terminal.write("\nRedirecting...");
                setTimeout(() => {
                    window.location.href = '/tasks.html'; // Redirect to login page
                }, 3000);
            })
            .catch(error => {
                resetTerminal();
                terminal.write(`Error: ${error.message}\r\n`);
                terminal.write('Please, try again.\r\n');
                setTimeout(resetTerminal, 2000); // Reset terminal after a brief delay
            });
    }
});
