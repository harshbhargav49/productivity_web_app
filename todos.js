// todos.js

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html'; // Redirect to login if no token
}

const todosList = document.getElementById('todos-list');

// Fetch and Display Todos
function fetchTodos(filters) {
  // Inside fetchTodos function

  fetch('http://localhost:7777/api/todos', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      todosList.innerHTML = ''; // Clear existing todos

      if (filters) {
        data = data.filter(todo => todo.priority === filters.priority)
      }

      data.forEach(todo => {
        const todoItem = document.createElement('div');

        const dueDate = new Date(todo.dueDate);
        const createdAt = new Date(todo.createdAt);
        const currentDate = new Date();

        // Calculate delay in days
        const delayInDays = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));

        let delayMessage = "On track"; // Default message
        if (delayInDays > 0) {
          delayMessage = `Delayed by ${delayInDays} day(s)`;
        } else if (delayInDays < 0) {
          delayMessage = `Due in ${Math.abs(delayInDays)} day(s)`;
        }

        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
          <h3>Title: ${todo.title}</h3>
          <p class="description">Description: ${todo.description}</p>
          <p class="priority">Priority: ${todo.priority}</p>
          <p class="status">Status: ${todo.status}</p>
          <p class="due-date">Due Date: ${dueDate.toLocaleString()}</p>
          <p class="date">Created Date: ${createdAt.toLocaleString()}</p>
          <p class="status">${delayMessage}</p>
          <div class="actions">
            <button class="edit" onclick="editTodo('${todo._id}')">Edit</button>
            <button class="delete" onclick="deleteTodo('${todo._id}')">Delete</button>
          </div>
        `;
        todosList.appendChild(todoItem);
        todoItem.setAttribute('data-id', todo._id);
      });
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
    });
}

// Add Todo
document.getElementById('add-todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('todo-title').value;
  const description = document.getElementById('todo-description').value;
  const priority = document.getElementById('todo-priority').value;
  const dueDate = document.getElementById('todo-due-date').value;

  const response = await fetch('http://localhost:7777/api/todos', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, priority, status: 'Pending', dueDate }),
  });

  if (response.ok) {
    fetchTodos(); // Refresh the todos list
    document.getElementById('add-todo-form').reset(); // Clear the form
  } else {
    alert('Failed to add todo.');
  }
});

// Delete Todo
function deleteTodo(todoId) {
  fetch(`http://localhost:7777/api/todos/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (response.ok) {
        fetchTodos(); // Refresh the todos list
      } else {
        alert('Failed to delete todo.');
      }
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
}

// Initial fetch
fetchTodos();

let currentTodoId = null;

// Open Edit Modal
function editTodo(todoId) {
  currentTodoId = todoId;
  const todo = todosList.querySelector(`[data-id="${todoId}"]`);
  document.getElementById('edit-todo-title').value = todo.querySelector('h3').textContent;
  document.getElementById('edit-todo-description').value = todo.querySelector('.description').textContent;
  document.getElementById('edit-todo-priority').value = todo.querySelector('.priority').textContent.split(': ')[1];
  document.getElementById('edit-todo-status').value = todo.querySelector('.status').textContent.split(': ')[1];
  document.getElementById('edit-todo-modal').style.display = 'flex';
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById('edit-todo-modal').style.display = 'none';
}

// Save Edited Todo
document.getElementById('edit-todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('edit-todo-title').value;
  const description = document.getElementById('edit-todo-description').value;
  const priority = document.getElementById('edit-todo-priority').value;
  const status = document.getElementById('edit-todo-status').value;

  const response = await fetch(`http://localhost:7777/api/todos/${currentTodoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, priority, status }),
  });

  if (response.ok) {
    fetchTodos(); // Refresh the todos list
    closeEditModal();
  } else {
    alert('Failed to update todo.');
  }
});

// Function to filter todos based on selected priority
function filterTodos() {
  const selectedPriority = document.getElementById("todo-filter-priority").value;
  fetchTodos({ priority: selectedPriority })
}

// Event listener for dropdown change
document.getElementById("todo-filter-priority").addEventListener("change", filterTodos);