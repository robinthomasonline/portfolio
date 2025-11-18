// Kanban Board - State Management and DOM Manipulation
class KanbanBoard {
    constructor() {
        this.tasks = [];
        this.currentEditId = null;
        this.draggedElement = null;
        this.dragOverElement = null;
        
        this.initializeElements();
        this.loadTasks();
        this.attachEventListeners();
        this.updateTaskCounts();
    }

    initializeElements() {
        // Modal elements
        this.modal = document.getElementById('taskModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeModal = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.saveTaskBtn = document.getElementById('saveTaskBtn');
        
        // Form elements
        this.taskTitle = document.getElementById('taskTitle');
        this.taskDescription = document.getElementById('taskDescription');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskUser = document.getElementById('taskUser');
        
        // Button elements
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFileInput = document.getElementById('importFileInput');
        
        // Column lists
        this.todoList = document.getElementById('todoList');
        this.inprogressList = document.getElementById('inprogressList');
        this.doneList = document.getElementById('doneList');
        
        // Task count elements
        this.todoCount = document.getElementById('todoCount');
        this.inprogressCount = document.getElementById('inprogressCount');
        this.doneCount = document.getElementById('doneCount');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    attachEventListeners() {
        // Modal controls
        this.addTaskBtn.addEventListener('click', () => this.openAddModal());
        this.closeModal.addEventListener('click', () => this.closeModalHandler());
        this.cancelBtn.addEventListener('click', () => this.closeModalHandler());
        this.saveTaskBtn.addEventListener('click', () => this.saveTask());
        
        // Export/Import controls
        this.exportBtn.addEventListener('click', () => this.exportToCSV());
        this.importBtn.addEventListener('click', () => this.importFileInput.click());
        this.importFileInput.addEventListener('change', (e) => this.importFromCSV(e));
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModalHandler();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModalHandler();
            }
        });
        
        // Setup drag and drop for all columns
        this.setupDragAndDrop();
    }

    // Generate unique ID for tasks
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Local Storage Management
    saveTasks() {
        try {
            localStorage.setItem('kanbanTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            this.showToast('Error saving tasks to local storage', 'error');
        }
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('kanbanTasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
                // Ensure backward compatibility - add user field if missing
                this.tasks = this.tasks.map(task => ({
                    ...task,
                    user: task.user || ''
                }));
                this.renderTasks();
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    // Task Management
    addTask(title, description, priority, user) {
        if (!title.trim()) {
            this.showToast('Task title is required', 'error');
            return;
        }

        const task = {
            id: this.generateId(),
            title: title.trim(),
            description: description.trim(),
            priority: priority || 'medium',
            user: user ? user.trim() : '',
            status: 'todo',
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounts();
        this.showToast('Task added successfully!');
    }

    updateTask(id, title, description, priority, user) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.title = title.trim();
        task.description = description.trim();
        task.priority = priority || 'medium';
        task.user = user ? user.trim() : '';

        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounts();
        this.showToast('Task updated successfully!');
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounts();
            this.showToast('Task deleted successfully!');
        }
    }

    moveTask(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounts();
        }
    }

    // DOM Rendering
    renderTasks() {
        // Clear all lists
        this.todoList.innerHTML = '';
        this.inprogressList.innerHTML = '';
        this.doneList.innerHTML = '';

        // Group tasks by status
        const tasksByStatus = {
            todo: this.tasks.filter(t => t.status === 'todo'),
            inprogress: this.tasks.filter(t => t.status === 'inprogress'),
            done: this.tasks.filter(t => t.status === 'done')
        };

        // Render tasks in each column
        Object.keys(tasksByStatus).forEach(status => {
            const list = this.getListByStatus(status);
            const tasks = tasksByStatus[status];

            if (tasks.length === 0) {
                list.innerHTML = this.createEmptyState(status);
            } else {
                tasks.forEach(task => {
                    list.appendChild(this.createTaskElement(task));
                });
            }
        });
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.draggable = true;
        taskElement.dataset.taskId = task.id;
        taskElement.dataset.status = task.status;

        const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button class="task-action-btn edit" data-action="edit" data-id="${task.id}" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete" data-action="delete" data-id="${task.id}" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
            ${task.user ? `<div class="task-user"><i class="fas fa-user"></i> ${this.escapeHtml(task.user)}</div>` : ''}
            <div class="task-footer">
                <span class="task-priority ${task.priority}">${task.priority}</span>
                <span class="task-date">${formattedDate}</span>
            </div>
        `;

        // Attach event listeners
        const editBtn = taskElement.querySelector('[data-action="edit"]');
        const deleteBtn = taskElement.querySelector('[data-action="delete"]');

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditModal(task.id);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        return taskElement;
    }

    createEmptyState(status) {
        const messages = {
            todo: 'No tasks to do',
            inprogress: 'No tasks in progress',
            done: 'No completed tasks'
        };

        const icons = {
            todo: 'fa-clipboard-list',
            inprogress: 'fa-spinner',
            done: 'fa-check-circle'
        };

        return `
            <div class="empty-column">
                <i class="fas ${icons[status]}"></i>
                <p>${messages[status]}</p>
            </div>
        `;
    }

    getListByStatus(status) {
        const statusMap = {
            todo: this.todoList,
            inprogress: this.inprogressList,
            done: this.doneList
        };
        return statusMap[status] || this.todoList;
    }

    updateTaskCounts() {
        const counts = {
            todo: this.tasks.filter(t => t.status === 'todo').length,
            inprogress: this.tasks.filter(t => t.status === 'inprogress').length,
            done: this.tasks.filter(t => t.status === 'done').length
        };

        this.todoCount.textContent = counts.todo;
        this.inprogressCount.textContent = counts.inprogress;
        this.doneCount.textContent = counts.done;
    }

    // Modal Management
    openAddModal() {
        this.currentEditId = null;
        this.modalTitle.textContent = 'Add Task';
        this.taskTitle.value = '';
        this.taskDescription.value = '';
        this.taskPriority.value = 'medium';
        this.taskUser.value = '';
        this.modal.classList.add('show');
        this.taskTitle.focus();
    }

    openEditModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentEditId = taskId;
        this.modalTitle.textContent = 'Edit Task';
        this.taskTitle.value = task.title;
        this.taskDescription.value = task.description || '';
        this.taskPriority.value = task.priority;
        this.taskUser.value = task.user || '';
        this.modal.classList.add('show');
        this.taskTitle.focus();
    }

    closeModalHandler() {
        this.modal.classList.remove('show');
        this.currentEditId = null;
        // Reset form
        this.taskTitle.value = '';
        this.taskDescription.value = '';
        this.taskPriority.value = 'medium';
        this.taskUser.value = '';
    }

    saveTask() {
        const title = this.taskTitle.value;
        const description = this.taskDescription.value;
        const priority = this.taskPriority.value;
        const user = this.taskUser.value;

        if (!title.trim()) {
            this.showToast('Task title is required', 'error');
            return;
        }

        if (this.currentEditId) {
            this.updateTask(this.currentEditId, title, description, priority, user);
        } else {
            this.addTask(title, description, priority, user);
        }

        this.closeModalHandler();
    }

    // Drag and Drop Implementation
    setupDragAndDrop() {
        const columns = [this.todoList, this.inprogressList, this.doneList];

        columns.forEach(column => {
            // Allow drop
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                const taskItem = e.target.closest('.task-item');
                if (taskItem && taskItem !== this.draggedElement) {
                    taskItem.classList.add('drag-over');
                    this.dragOverElement = taskItem;
                }
            });

            column.addEventListener('dragleave', (e) => {
                const taskItem = e.target.closest('.task-item');
                if (taskItem) {
                    taskItem.classList.remove('drag-over');
                }
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                const taskItem = e.target.closest('.task-item');
                if (taskItem) {
                    taskItem.classList.remove('drag-over');
                }

                if (this.draggedElement) {
                    const taskId = this.draggedElement.dataset.taskId;
                    const newStatus = column.dataset.status;
                    this.moveTask(taskId, newStatus);
                    this.draggedElement.classList.remove('dragging');
                    this.draggedElement = null;
                }
            });

            // Handle task item drag events
            column.addEventListener('dragstart', (e) => {
                const taskItem = e.target.closest('.task-item');
                if (taskItem) {
                    this.draggedElement = taskItem;
                    taskItem.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', taskItem.outerHTML);
                }
            });

            column.addEventListener('dragend', (e) => {
                const taskItem = e.target.closest('.task-item');
                if (taskItem) {
                    taskItem.classList.remove('dragging');
                    // Remove drag-over from all items
                    document.querySelectorAll('.task-item').forEach(item => {
                        item.classList.remove('drag-over');
                    });
                }
                this.draggedElement = null;
            });
        });
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        const icon = this.toast.querySelector('i');
        
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            icon.style.color = 'var(--danger-color)';
        } else {
            icon.className = 'fas fa-check-circle';
            icon.style.color = 'var(--success-color)';
        }

        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // CSV Export/Import
    exportToCSV() {
        if (this.tasks.length === 0) {
            this.showToast('No tasks to export', 'error');
            return;
        }

        // CSV Headers
        const headers = ['Title', 'Description', 'Priority', 'Status', 'Assigned To', 'Created At'];
        
        // Convert tasks to CSV rows
        const rows = this.tasks.map(task => {
            return [
                this.escapeCsvField(task.title),
                this.escapeCsvField(task.description || ''),
                task.priority,
                task.status,
                this.escapeCsvField(task.user || ''),
                new Date(task.createdAt).toLocaleString()
            ];
        });

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `kanban-tasks-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Tasks exported successfully!');
    }

    importFromCSV(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(line => line.trim());
                
                if (lines.length < 2) {
                    this.showToast('CSV file is empty or invalid', 'error');
                    return;
                }

                // Parse CSV (simple parser - handles basic cases)
                const headers = lines[0].split(',').map(h => h.trim());
                const importedTasks = [];

                for (let i = 1; i < lines.length; i++) {
                    const values = this.parseCSVLine(lines[i]);
                    if (values.length < headers.length) continue;

                    const task = {
                        id: this.generateId(),
                        title: this.unescapeCsvField(values[0] || ''),
                        description: this.unescapeCsvField(values[1] || ''),
                        priority: values[2] || 'medium',
                        status: values[3] || 'todo',
                        user: this.unescapeCsvField(values[4] || ''),
                        createdAt: values[5] ? new Date(values[5]).toISOString() : new Date().toISOString()
                    };

                    // Validate task
                    if (task.title && ['todo', 'inprogress', 'done'].includes(task.status) && 
                        ['low', 'medium', 'high'].includes(task.priority)) {
                        importedTasks.push(task);
                    }
                }

                if (importedTasks.length === 0) {
                    this.showToast('No valid tasks found in CSV file', 'error');
                    return;
                }

                // Ask user if they want to replace or merge
                const action = confirm(
                    `Found ${importedTasks.length} task(s). Click OK to replace all tasks, or Cancel to merge with existing tasks.`
                );

                if (action) {
                    this.tasks = importedTasks;
                } else {
                    this.tasks = [...this.tasks, ...importedTasks];
                }

                this.saveTasks();
                this.renderTasks();
                this.updateTaskCounts();
                this.showToast(`Successfully imported ${importedTasks.length} task(s)!`);

            } catch (error) {
                console.error('Error importing CSV:', error);
                this.showToast('Error importing CSV file. Please check the format.', 'error');
            }
        };

        reader.onerror = () => {
            this.showToast('Error reading file', 'error');
        };

        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    escapeCsvField(field) {
        if (!field) return '';
        const stringField = String(field);
        // If field contains comma, newline, or quote, wrap in quotes and escape quotes
        if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    }

    unescapeCsvField(field) {
        if (!field) return '';
        // Remove surrounding quotes if present
        if (field.startsWith('"') && field.endsWith('"')) {
            return field.slice(1, -1).replace(/""/g, '"');
        }
        return field;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }
}

// Initialize the Kanban Board when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KanbanBoard();
});

