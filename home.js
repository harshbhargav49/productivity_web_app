// home.js

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html'; // Redirect to login if no token
}

// Fetch Todos Count
fetch('http://localhost:7777/api/todos', {
    headers: {
        'Authorization': `Bearer ${token}`,
    },
})
    .then(response => response.json())
    .then(data => {
        document.getElementById('todos-count').textContent = `${data.length} todos`;
    })
    .catch(error => {
        console.error('Error fetching todos:', error);
    });

// Fetch Reminders Count (Replace with your reminders API endpoint)
fetch('http://localhost:7777/api/reminders', {
    headers: {
        'Authorization': `Bearer ${token}`,
    },
})
    .then(response => response.json())
    .then(data => {
        document.getElementById('reminders-count').textContent = `${data.length} reminders`;
    })
    .catch(error => {
        console.error('Error fetching reminders:', error);
    });

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});