document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    terminal.open(document.getElementById('terminal'));

    let currentStep = 'name'; // track which input we are asking for
    let name = '';
    let username = '';
    let email = '';
    let password = '';
    let userInput = '';

    terminal.write('Welcome to terminal task manager!\r\n');
    terminal.write('Please enter your name:\r\n> ');

    terminal.onKey((e) => {
        const char = e.key;

        if (char === '\r') { // Enter key pressed
            terminal.write('\r\n');

            if (currentStep === 'name') {
                name = userInput;
                terminal.write('Please enter your username:\r\n> ');
                currentStep = 'username';
                userInput = ''; // reset input for the next step
            } else if (currentStep === 'username') {
                username = userInput;
                terminal.write('Please enter your email:\r\n> ');
                currentStep = 'email';
                userInput = ''; // reset input for the next step
            } else if (currentStep === 'email') {
                email = userInput;
                terminal.write('Please enter your password:\r\n> ');
                currentStep = 'password';
                userInput = ''; // reset input for the next step
            } else if (currentStep === 'password') {
                password = userInput;
                terminal.write('Registering...\r\n');
                registerUser(name, username, email, password); // simulate registration process
            }
        } else if (char === '\u007F') { // Backspace key
            if (userInput.length > 0) {
                terminal.write('\b \b');
                userInput = userInput.slice(0, -1);
            }
        } else {
            terminal.write(char);
            userInput += char;
        }
    });

    // Simulate registration (you would replace this with actual logic)
    function registerUser(name, username, email, password) {
        terminal.write(`Attempting to register ${username}...\r\n`);

        // Simulate a successful registration after 2 seconds
        setTimeout(() => {
            terminal.write('Registration successful!\r\n');
            document.getElementById('redirectLogin').style.display = 'block';
            document.getElementById('redirectLogin').innerText = 'Redirecting to login page...';
            window.location.href = '/login.html'; // redirect to login page
        }, 2000);
    }
});
