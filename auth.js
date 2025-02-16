// auth.js

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:7777/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
        window.location.href = 'home.html'; // Redirect to home page
    } else {
        alert('Login failed. Please check your credentials.');
    }
});

// Signup Form Submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('http://localhost:7777/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.msg); // User created successfully
        window.location.href = 'index.html'; // Redirect to login page
    } else {
        alert('Signup failed. Please try again.');
    }
});