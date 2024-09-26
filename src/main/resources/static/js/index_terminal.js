document.addEventListener("DOMContentLoaded", function () {
    const terminal = new Terminal();
    const fitAddon = new FitAddon.FitAddon(); // Global FitAddon object
    terminal.loadAddon(fitAddon);

    terminal.open(document.getElementById('terminal'));
    fitAddon.fit(); // Fit the terminal to its container

    let menuOptions = ['[ ] /login', '[ ] /register'];
    let selectedOption = 0;
    let actions = ['login', 'register']; // action options

    function resetTerminal() {
        selectedOption = 0;
        renderMenu();
        terminal.focus();
    }

    function renderMenu() {
        terminal.clear();
        terminal.write('/ >\r\n');
        terminal.write('Use arrow keys to navigate and press enter to select if you want to login or register:\r\n');
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
        if (domEvent.key === 'ArrowUp') {
            selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
            renderMenu();
        } else if (domEvent.key === 'ArrowDown') {
            selectedOption = (selectedOption + 1) % menuOptions.length;
            renderMenu();
        } else if (char === '\r') {
            if (actions[selectedOption] === 'login') {
                terminal.write('Redirecting to /login...\r\n> ');
                setTimeout(window.location.href = "../login.html", 3000);
            } else if (actions[selectedOption] === 'register') {
                terminal.write('Redirecting to /register...\r\n> ');
                setTimeout(window.location.href = "../register.html", 3000);
            }
        }
    });
});
