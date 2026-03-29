// 初始化變數
let totalTask = 0;
let completedTasks = 0;
let isConfirming = false; // 二次確認狀態位元

// 頁面載入後自動讀取存檔
window.onload = function() {
    loadTasks();
};

// 監聽按鈕點擊
document.getElementById('add-task').addEventListener('click', () => {
    addTask();
    resetInputState();
});

// 監聽 Enter 鍵：二次確認邏輯
document.getElementById('new-task').addEventListener('keydown', function(event) {
    const taskInput = event.target;
    if (event.key === 'Enter') {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        if (!isConfirming) {
            // 第一次按 Enter
            isConfirming = true;
            taskInput.style.borderColor = "#E09132";
            taskInput.style.backgroundColor = "#fff9f0";
            taskInput.placeholder = "請再按一次 Enter 以確認新增";
        } else {
            // 第二次按 Enter
            addTask();
            resetInputState();
        }
    }
});

// 輸入文字時若處於確認狀態，則重置 (防止改了字沒確認就送出)
document.getElementById('new-task').addEventListener('input', function() {
    if (isConfirming) resetInputState();
});

function resetInputState() {
    const taskInput = document.getElementById('new-task');
    isConfirming = false;
    taskInput.style.borderColor = "#ccc";
    taskInput.style.backgroundColor = "#fff";
    taskInput.placeholder = "有什麼想做的？";
}

function updateStats() {
    document.getElementById('total-tasks').textContent = `事項總數： ${totalTask}`;
    document.getElementById('completed-tasks').textContent = `已完成： ${completedTasks}`;
}

function addTask(taskData = null) {
    const taskInput = document.getElementById('new-task');
    const mission_level = document.getElementById('mission_level');
    const deadline = document.getElementById('deadline');

    // 如果有傳入 taskData，代表是從 LocalStorage 讀取的
    const text = taskData ? taskData.text : taskInput.value.trim();
    const level = taskData ? taskData.level : mission_level.value;
    const date = taskData ? taskData.date : deadline.value;
    const isDone = taskData ? taskData.completed : false;

    if (text !== '') {
        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${level}`;
        if (isDone) taskItem.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = isDone;

        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';
        taskContent.textContent = text;

        const deadlineContent = document.createElement('span');
        deadlineContent.className = 'task-deadline';
        deadlineContent.textContent = `截止日期： ${date}`;
        if (isDone) deadlineContent.classList.add('completed');

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
            saveTasks(); // 狀態改變即存檔
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            if (checkbox.checked) completedTasks--;
            totalTask--;
            taskList.removeChild(taskItem);
            updateStats();
            saveTasks(); // 刪除即存檔
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(deadlineContent);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        sortTaskList(taskList);
        
        if (!taskData) { // 如果是手動新增而非讀取
            taskInput.value = '';
            deadline.value = '';
            totalTask++;
            updateStats();
            saveTasks(); 
        } else {
            totalTask++;
            if (isDone) completedTasks++;
            updateStats();
        }
    }
}

function sortTaskList(taskList) {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
        const priorities = { 'high': 3, 'medium': 2, 'low': 1 };
        const pA = a.className.split(' ')[1] || 'low';
        const pB = b.className.split(' ')[1] || 'low';
        return priorities[pB] - priorities[pA];
    });
    tasks.forEach(task => taskList.appendChild(task));
}

// --- 存檔功能 (LocalStorage) ---
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-content').textContent,
            level: item.className.split(' ')[1],
            date: item.querySelector('.task-deadline').textContent.replace('截止日期： ', ''),
            completed: item.querySelector('.checkbox').checked
        });
    });
    localStorage.setItem('myTodoList', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('myTodoList');
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => addTask(task));
    }
}