// Register new user
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
        .then(response => response.json())
        .then(data => {
            console.log('User registered:', data);
        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
});