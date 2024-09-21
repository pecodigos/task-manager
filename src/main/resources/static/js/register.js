// Register a new user
document.getElementById('taskForm_register').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            username: username,
            email: email,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            document.getElementById('taskForm_register').style.display = 'none';

            // Display success message
            showMessage("You're now registered!", true);

            // Show login redirect message
            const redirectLogin = document.getElementById('redirectLogin');
            redirectLogin.innerHTML = "You can now log in <a href='../login.html'>clicking here</a>.";
            redirectLogin.style.display = 'block';
        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
});

// Function to show message
function showMessage(message, isSuccess) {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.style.backgroundColor = isSuccess ? 'lightgreen' : 'lightcoral';
    messageContainer.style.padding = '1rem';
    messageContainer.style.marginTop = '1rem';
    messageContainer.style.textAlign = 'center';
    messageContainer.style.border = '0.1rem solid green';
    messageContainer.style.borderRadius = '0.5rem';

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        document.body.removeChild(messageContainer);
    }, 8000);
}
