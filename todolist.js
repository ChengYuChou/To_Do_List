document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

let totalTask = 0;
let completedTasks = 0;
function updateStats() {
    document.getElementById('total-tasks').textContent = `事項總數： ${totalTask}`;
    document.getElementById('completed-tasks').textContent = `已完成： ${completedTasks}`;
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    const mission_level = document.getElementById('mission_level');
    const task_level = mission_level.value;
    const deadline = document.getElementById('deadline');
    const taskdeadline = deadline.value;


    if (taskText !== '') {
        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task_level}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';

        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';
        taskContent.textContent = `${taskText}`;

        const deadlineContent = document.createElement('span');
        deadlineContent.className = 'task-deadline';
        deadlineContent.textContent = `截止日期： ${taskdeadline}`;
        

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                taskItem.classList.add('completed');
                deadlineContent.classList.add('completed');
                completedTasks++;
            } else {
                taskItem.classList.remove('completed');
                deadlineContent.classList.remove('completed');
                completedTasks--;
            }
            updateStats();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            if (checkbox.checked){
                completedTasks--;
            }
            totalTask--;
            taskList.removeChild(taskItem);
            updateStats();
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(deadlineContent);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        sortTaskList(taskList);
        taskInput.value = '';
        deadline.value = '';

        totalTask++;
        updateStats();
    }
}

function sortTaskList(taskList) {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
        const priorities = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorities[b.className.split(' ')[1]] - priorities[a.className.split(' ')[1]];
    });

    tasks.forEach(task => taskList.appendChild(task));
}



