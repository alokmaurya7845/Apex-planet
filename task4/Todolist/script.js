document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const categoryInput = document.getElementById('category-input');
    const priorityInput = document.getElementById('priority-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const themeSwitcher = document.getElementById('theme-switcher');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const progressBar = document.getElementById('progress-bar');
    const completeSound = document.getElementById('complete-sound');
    const exportJsonBtn = document.getElementById('export-json-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');

    // Edit Modal Elements
    const editModal = document.getElementById('edit-modal');
    const closeButton = document.querySelector('.modal .close-button');
    const editTaskText = document.getElementById('edit-task-text');
    const editDueDate = document.getElementById('edit-due-date');
    const editCategory = document.getElementById('edit-category');
    const editPriority = document.getElementById('edit-priority');
    const saveEditBtn = document.getElementById('save-edit-btn');
    let currentEditTaskId = null;

    // Initialize Flatpickr for date inputs
    flatpickr(dueDateInput, {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
    });
    flatpickr(editDueDate, {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
    });

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentTheme = localStorage.getItem('theme') || 'light';

    // --- THEME ---
    function applyTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        themeSwitcher.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
        currentTheme = theme;
    }

    themeSwitcher.addEventListener('click', () => {
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // --- LOCALSTORAGE ---
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- TASK RENDERING ---
    function renderTasks(filteredTasks = null) {
        taskList.innerHTML = '';
        const tasksToRender = filteredTasks || filterAndSearchTasks();
        
        tasksToRender.forEach((task, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            li.setAttribute('draggable', true); // For drag-and-drop
            li.classList.add(`priority-${task.priority.toLowerCase()}`);
            if (task.completed) {
                li.classList.add('completed');
            }

            const today = new Date();
            today.setHours(0,0,0,0); // Normalize today's date
            const taskDueDate = task.dueDate ? new Date(task.dueDate + "T00:00:00") : null; // Ensure date is parsed correctly, treat as local time

            let dueDateStatus = '';
            let dueDateClass = '';
            if (taskDueDate && !task.completed) {
                const diffTime = taskDueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    dueDateStatus = '(Overdue)';
                    dueDateClass = 'overdue';
                } else if (diffDays === 0) {
                    dueDateStatus = '(Due Today)';
                    dueDateClass = 'due-soon';
                } else if (diffDays <= 2) { // Due within 2 days
                    dueDateStatus = `(Due in ${diffDays} day${diffDays > 1 ? 's' : ''})`;
                    dueDateClass = 'due-soon';
                }
            }
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-details">
                        <span class="task-text">${task.text}</span>
                        <div class="task-meta">
                            <span class="category">Cat: ${task.category}</span>
                            ${task.dueDate ? `<span class="due-date ${dueDateClass}">Due: ${new Date(task.dueDate + "T00:00:00").toLocaleDateString()} ${dueDateStatus}</span>` : ''}
                            <span class="priority priority-${task.priority.toLowerCase()}">Prio: ${task.priority}</span>
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            `;

            // Add animation class for newly added tasks (if it's the last one and not initial load)
            if (filteredTasks === null && index === tasks.length - 1 && taskList.children.length < tasks.length) {
                li.classList.add('task-item-enter');
            }


            taskList.appendChild(li);

            // Event listeners for task actions
            li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => toggleComplete(task.id, e.target.closest('li')));
            li.querySelector('.edit-btn').addEventListener('click', () => openEditModal(task.id));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

            // Drag and Drop
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                updateTaskOrder();
            });
        });
        updateProgress();
        checkDueTodayNotifications();
    }

    // Drag and Drop helpers
    taskList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            if (afterElement == null) {
                taskList.appendChild(draggable);
            } else {
                taskList.insertBefore(draggable, afterElement);
            }
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    function updateTaskOrder() {
        const orderedIds = [...taskList.querySelectorAll('li')].map(li => li.dataset.id);
        tasks.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
        saveTasks();
        // No need to re-render here if only order changed, unless other derived data depends on order.
    }

    // --- TASK OPERATIONS ---
    function addTask() {
        const text = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const category = categoryInput.value;
        const priority = priorityInput.value;

        if (text === '') {
            alert('Task description cannot be empty!');
            return;
        }

        const newTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More robust ID
            text,
            dueDate,
            category,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks(); // Re-render all tasks
        taskInput.value = '';
        dueDateInput.value = ''; // Or flatpickrInstance.clear();
        flatpickr(dueDateInput).clear(); // Clear Flatpickr instance
        taskInput.focus();
    }

    function toggleComplete(id, listItemElement) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            
            // Add visual feedback
            if (listItemElement) {
                listItemElement.classList.toggle('completed', task.completed);
                 if (task.completed) {
                    listItemElement.classList.add('task-item-completed-feedback');
                    setTimeout(() => listItemElement.classList.remove('task-item-completed-feedback'), 300); // Remove after animation
                    
                    // Play sound
                    if (completeSound.readyState >= 2) { // Ensure sound is loaded
                        completeSound.currentTime = 0; // Rewind if already playing
                        completeSound.play().catch(error => console.warn("Sound play failed:", error));
                    }
                }
            }
            renderTasks(); // Re-render to update status indicators and progress
        }
    }

    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    function openEditModal(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            currentEditTaskId = id;
            editTaskText.value = task.text;
            flatpickr(editDueDate).setDate(task.dueDate || "");
            editCategory.value = task.category;
            editPriority.value = task.priority;
            editModal.style.display = 'block';
            editTaskText.focus();
        }
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        currentEditTaskId = null;
    }

    saveEditBtn.addEventListener('click', () => {
        if (currentEditTaskId) {
            const task = tasks.find(t => t.id === currentEditTaskId);
            if (task) {
                task.text = editTaskText.value.trim();
                task.dueDate = editDueDate.value;
                task.category = editCategory.value;
                task.priority = editPriority.value;

                if (task.text === '') {
                    alert('Task description cannot be empty!');
                    return;
                }
                saveTasks();
                renderTasks();
                closeEditModal();
            }
        }
    });

    // --- FILTERING & SEARCHING ---
    function filterAndSearchTasks() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        return tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(searchTerm) ||
                                  task.category.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }

    searchBar.addEventListener('input', () => renderTasks());
    categoryFilter.addEventListener('change', () => renderTasks());


    // --- UI & UX FEATURES ---
    function updateProgress() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        progressBar.textContent = `${completedTasks} of ${totalTasks} tasks completed.`;
    }

    function checkDueTodayNotifications() {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const dueTodayTasks = tasks.filter(task => task.dueDate === todayStr && !task.completed);
        
        if (dueTodayTasks.length > 0) {
            // For simplicity, using alert. More advanced would use Notification API.
            // Only show once per session or if new tasks become due today.
            // This basic implementation will alert every time tasks are rendered and there are due tasks.
            if (!sessionStorage.getItem('dueTodayAlerted')) {
                 // alert(`You have ${dueTodayTasks.length} task(s) due today: \n${dueTodayTasks.map(t => t.text).join('\n')}`);
                 // sessionStorage.setItem('dueTodayAlerted', 'true'); // Avoid repeated alerts in same session
            }
        }
    }
    // Reset session storage for alert when page is reloaded for testing
    // window.onbeforeunload = () => { sessionStorage.removeItem('dueTodayAlerted'); };


    // --- EXPORT ---
    function exportTasks(format) {
        if (tasks.length === 0) {
            alert("No tasks to export.");
            return;
        }

        let dataStr, fileName, mimeType;

        if (format === 'json') {
            dataStr = JSON.stringify(tasks, null, 2); // Pretty print JSON
            fileName = 'tasks.json';
            mimeType = 'application/json';
        } else if (format === 'csv') {
            const headers = ['id', 'text', 'dueDate', 'category', 'priority', 'completed', 'createdAt'];
            const csvRows = [
                headers.join(','), // Header row
                ...tasks.map(task => headers.map(header => `"${String(task[header]).replace(/"/g, '""')}"`).join(',')) // Data rows, escape quotes
            ];
            dataStr = csvRows.join('\r\n');
            fileName = 'tasks.csv';
            mimeType = 'text/csv';
        } else {
            return;
        }

        const blob = new Blob([dataStr], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportJsonBtn.addEventListener('click', () => exportTasks('json'));
    exportCsvBtn.addEventListener('click', () => exportTasks('csv'));


    // --- EVENT LISTENERS ---
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Modal close events
    closeButton.addEventListener('click', closeEditModal);
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && editModal.style.display === 'block') {
            closeEditModal();
        }
    });


    // --- INITIALIZATION ---
    applyTheme(currentTheme); // Apply saved theme
    renderTasks(); // Initial render of tasks
});