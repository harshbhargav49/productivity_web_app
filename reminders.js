// reminders.js

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html'; // Redirect to login if no token
}

const remindersList = document.getElementById('reminders-list');

// Fetch and Display Reminders
function fetchReminders() {
    // Inside fetchReminders function

    fetch('http://localhost:7777/api/reminders', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            remindersList.innerHTML = ''; // Clear existing reminders
            data.forEach(reminder => {
                const reminderItem = document.createElement('div');
                reminderItem.className = 'reminder-item';
                reminderItem.innerHTML = `
          <h3>${reminder.title}</h3>
          <p class="description">${reminder.description}</p>
          <p class="repeat">${reminder.repeat}</p>
          <p class="due-date">Due: ${new Date(reminder.dateTime).toLocaleString()}</p>
          <p class="due-date">Created: ${new Date(reminder.createdAt).toLocaleString()}</p>
          <div class="actions">
            <button class="edit" onclick="editReminder('${reminder._id}')">Edit</button>
            <button class="delete" onclick="deleteReminder('${reminder._id}')">Delete</button>
          </div>
        `;
                remindersList.appendChild(reminderItem);
                reminderItem.setAttribute('data-id', reminder._id);
            });
        })
        .catch(error => {
            console.error('Error fetching reminders:', error);
        });
}

// Add Reminder
document.getElementById('add-reminder-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('reminder-title').value;
    const description = document.getElementById('reminder-description').value;
    const dateTime = document.getElementById('reminder-due-date').value;

    const response = await fetch('http://localhost:7777/api/reminders', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dateTime }),
    });

    if (response.ok) {
        fetchReminders(); // Refresh the reminders list
        document.getElementById('add-reminder-form').reset(); // Clear the form
    } else {
        alert('Failed to add reminder.');
    }
});

// Delete Reminder
function deleteReminder(reminderId) {
    fetch(`http://localhost:7777/api/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (response.ok) {
                fetchReminders(); // Refresh the reminders list
            } else {
                alert('Failed to delete reminder.');
            }
        })
        .catch(error => {
            console.error('Error deleting reminder:', error);
        });
}

// Edit Reminder (You can implement this similarly to deleteReminder)
function editReminder(reminderId) {
    // Implement edit functionality
    alert('Edit functionality to be implemented.');
}

// Initial fetch
fetchReminders();

let currentReminderId = null;

// Open Edit Modal
function editReminder(reminderId) {
    currentReminderId = reminderId;
    const reminder = remindersList.querySelector(`[data-id="${reminderId}"]`);
    document.getElementById('edit-reminder-title').value = reminder.querySelector('h3').textContent;
    document.getElementById('edit-reminder-description').value = reminder.querySelector('.description').textContent;
    document.getElementById('edit-reminder-repeat').value = reminder.querySelector('.repeat').textContent;
    document.getElementById('edit-reminder-due-date').value = new Date(reminder.querySelector('.due-date').textContent.split(': ')[1]).toISOString().slice(0, 16);
    document.getElementById('edit-reminder-modal').style.display = 'flex';
}

// Close Edit Modal
function closeEditReminderModal() {
    document.getElementById('edit-reminder-modal').style.display = 'none';
}

// Save Edited Reminder
document.getElementById('edit-reminder-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('edit-reminder-title').value;
    const description = document.getElementById('edit-reminder-description').value;
    const dateTime = document.getElementById('edit-reminder-due-date').value;
    const repeat = document.getElementById('edit-reminder-repeat').value;

    const response = await fetch(`http://localhost:7777/api/reminders/${currentReminderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dateTime, repeat }),
    });

    if (response.ok) {
        fetchReminders(); // Refresh the reminders list
        closeEditReminderModal();
    } else {
        alert('Failed to update reminder.');
    }
});