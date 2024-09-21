document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    terminal.open(document.getElementById('terminal'));

    // Simulate the login prompt
    let currentStep = 'username'; // track the current step (username or password)
    let username = '';
    let password = '';
    let userInput = '';

    terminal.write('Welcome to terminal task manager!\r\n');
    terminal.write('Please enter your username:\r\n> ');

    terminal.onKey((e) => {
        const char = e.key;

        if (char === '\r') { // Enter key
            terminal.write('\r\n');
            if (currentStep === 'username') {
                username = userInput;
                terminal.write('Please enter your password:\r\n> ');
                currentStep = 'password';
                userInput = '';
            } else if (currentStep === 'password') {
                password = userInput;
                terminal.write('Password accepted.\r\n');
                terminal.write('Logging in...\r\n');
                loginUser(username, password);
            }
        } else if (char === '\u007F') {
            if (userInput.length > 0) {
                terminal.write('\b \b');
                userInput = userInput.slice(0, -1);
            }
        } else {
            terminal.write(char);
            userInput += char;
        }
    });

    // Simulate login (replace this with actual logic if needed)
    function loginUser(username, password) {
        terminal.write(`Attempting login for ${username}...\r\n`);

        // Simulate a successful login after 2 seconds
        setTimeout(() => {
            terminal.write('Login successful!\r\n');
            document.getElementById('redirectLogin').style.display = 'block';
            document.getElementById('redirectLogin').innerText = 'Redirecting...';
            window.location.href = '../task.html';2
        }, 2000);
    }
});
