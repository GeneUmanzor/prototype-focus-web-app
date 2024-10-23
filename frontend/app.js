document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');

  //fetch/display tasks on page load
  fetchTasks();
  
  addTaskButton.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if(task) {
      addTask(task);
      taskInput.value = '';
    }
});

async function fetchTasks(){
  try {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    tasks.forEach(task => displayTask(task));
  } catch (error) {
      console.error('Error fetching tasks:', error);
  }
}

function displayTask(task) {
  const li = document.createElement('li');
  li.textContent = task.name;
  li.dataset.id = task.id;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteTask(task.id, li));

  li.appendChild(deleteButton);
  taskList.appendChild(li);
}

async function addTask(taskname) {
  try {
    const response = await fetch('https://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: taskName });
    });
    const newTask = await response.json();
    displayTask({ id: newTask.id, name: taskName });
  } catch (error) {
      console.error('Error adding task: ', error);
  }
}

async function deleteTask(taskId, taskElement) {
  try {
    await fetch('http://localhost:3000/tasks/${taskId}', { method: 'DELETE' });
    taskList.removeChild(taskElement);
  } catch (error) {
      console.error('Error deleting task:', error);
  }
}
});
