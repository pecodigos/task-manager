function logout() {
    fetch('user/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    })
        .then(response => {
            if (response.ok) {
                window.location.href='../login.html'
            } else {
                throw new Error('Logout failed.');
            }
        })
        .catch(error => {
            console.log(`${error.message}`);
        })
}