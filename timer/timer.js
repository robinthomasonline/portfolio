class WorkTimer {
    constructor() {
        this.timer = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.currentTask = null;
        this.tasks = this.loadTasks();
        this.history = this.loadHistory();
        this.isCountdown = false;
        this.countdownDuration = 0;
        this.notificationSound = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderTasks();
        this.renderHistory();
        this.updateStats();
        this.setupNotification();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.currentTaskDisplay = document.getElementById('currentTask');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.activeTasksList = document.getElementById('activeTasksList');
        this.taskNameModal = document.getElementById('taskNameModal');
        this.taskNameInput = document.getElementById('taskNameInput');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.exportHistoryBtn = document.getElementById('exportHistoryBtn');
        this.circularTimer = document.getElementById('circularTimer');
        this.regularTimerDisplay = document.getElementById('regularTimerDisplay');
        this.circularTimeDisplay = document.getElementById('circularTimeDisplay');
        this.circularStatus = document.getElementById('circularStatus');
        this.remainingTime = document.getElementById('remainingTime');
        this.progressBar = document.getElementById('progressBar');
        this.circumference = 2 * Math.PI * 90; // radius = 90
        this.timePickerModal = document.getElementById('timePickerModal');
        this.hoursWheel = document.getElementById('hoursWheel');
        this.minutesWheel = document.getElementById('minutesWheel');
        this.hoursContent = document.getElementById('hoursContent');
        this.minutesContent = document.getElementById('minutesContent');
        this.selectedHours = 0;
        this.selectedMinutes = 0;
        this.audioElement = null;
        this.hoursScrollHandler = null;
        this.minutesScrollHandler = null;
        this.hoursScrollTimeout = null;
        this.minutesScrollTimeout = null;
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        if (this.taskNameInput) {
            this.taskNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.confirmTaskAndStart();
            });
        }
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.exportHistoryBtn.addEventListener('click', () => this.exportToCSV());
    }

    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    formatTimeShort(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    formatTimeShortDisplay(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        }
        return `${mins}m`;
    }

    updateDisplay() {
        if (this.isCountdown && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const totalElapsed = this.elapsedTime + elapsed;
            const remaining = Math.max(0, this.countdownDuration - totalElapsed);
            
            if (remaining <= 0 && this.timer) {
                this.onCountdownComplete();
                return;
            }
            
            // Update circular progress
            const progress = (totalElapsed / this.countdownDuration) * 100;
            const offset = this.circumference - (progress / 100) * this.circumference;
            this.progressBar.style.strokeDashoffset = offset;
            
            // Update circular timer display - show elapsed time starting from 0
            if (this.circularTimeDisplay) {
                this.circularTimeDisplay.textContent = this.formatTimeShort(totalElapsed);
            }
            if (this.remainingTime) {
                this.remainingTime.textContent = `Remaining time: ${this.formatTimeShort(remaining)}`;
            }
            
            // Update status
            if (this.pauseBtn.disabled) {
                this.circularStatus.textContent = 'Paused';
                this.circularStatus.style.color = 'var(--warning-color)';
            } else {
                this.circularStatus.textContent = 'Running';
                this.circularStatus.style.color = 'var(--success-color)';
            }
            
            // Change progress color when less than 1 minute remaining
            if (remaining < 60) {
                this.progressBar.style.stroke = 'var(--danger-color)';
            } else {
                this.progressBar.style.stroke = 'var(--success-color)';
            }
            
            // Also update regular display for consistency
            this.timeDisplay.textContent = this.formatTime(remaining);
        } else {
            // Regular timer mode
            const totalSeconds = this.elapsedTime + (this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0);
            this.timeDisplay.textContent = this.formatTime(totalSeconds);
            this.timeDisplay.style.color = '';
        }
    }

    startTimer() {
        // If it's a countdown timer, start it directly
        if (this.isCountdown && this.countdownDuration > 0) {
            this.startTime = Date.now();
            this.timer = setInterval(() => this.updateDisplay(), 100);
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;
            return;
        }

        // Regular task timer
        if (!this.currentTask) {
            this.showTaskNameModal();
            return;
        }

        this.startTime = Date.now();
        this.timer = setInterval(() => this.updateDisplay(), 100);
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;

        // Update task status
        const task = this.tasks.find(t => t.id === this.currentTask);
        if (task) {
            task.isRunning = true;
            this.saveTasks();
            this.renderTasks();
        }
    }

    startPresetTimer(minutes) {
        try {
            // Initialize audio context on user interaction
            if (this.initAudioContext) {
                this.initAudioContext();
            }
            
            // Stop any running timer first
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            
            if (this.startTime) {
                // Calculate elapsed time if timer was running
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.elapsedTime += elapsed;
                this.startTime = null;
            }

            // Reset state for preset timer
            this.elapsedTime = 0;
            this.isCountdown = true;
            this.countdownDuration = minutes * 60;
            this.currentTask = null;

            // Show circular timer, hide regular display
            if (this.circularTimer) {
                this.circularTimer.style.display = 'flex';
            }
            if (this.regularTimerDisplay) {
                this.regularTimerDisplay.style.display = 'none';
            }

            // Reset progress bar
            if (this.progressBar) {
                this.progressBar.style.strokeDashoffset = this.circumference;
                this.progressBar.style.stroke = 'var(--success-color)';
            }

            // Set initial display values
            if (this.circularTimeDisplay) {
                this.circularTimeDisplay.textContent = '00:00';
            }
            if (this.remainingTime) {
                this.remainingTime.textContent = `Remaining time: ${this.formatTimeShort(this.countdownDuration)}`;
            }
            if (this.circularStatus) {
                this.circularStatus.textContent = 'Running';
                this.circularStatus.style.color = 'var(--primary-color)';
            }

            // Also update regular display for consistency
            if (this.timeDisplay) {
                this.timeDisplay.textContent = this.formatTime(this.countdownDuration);
            }
            if (this.currentTaskDisplay) {
                this.currentTaskDisplay.textContent = `Quick Timer - ${minutes} min`;
            }

            // Start the countdown immediately - no need to click Start button
            this.startTime = Date.now();
            this.timer = setInterval(() => this.updateDisplay(), 100);
            
            // Update button states - timer is running
            if (this.startBtn) this.startBtn.disabled = true;
            if (this.pauseBtn) this.pauseBtn.disabled = false;
            if (this.stopBtn) this.stopBtn.disabled = false;
        } catch (error) {
            console.error('Error starting preset timer:', error);
            alert('Error starting timer. Please try again.');
        }
    }

    onCountdownComplete() {
        // Stop the timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Play notification sound
        this.playNotification();

        // Show notification
        if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: `Your ${this.countdownDuration / 60} minute timer has finished.`,
                icon: '/timer/favicon.ico'
            });
        }

        // Update circular timer - show final elapsed time
        this.circularTimeDisplay.textContent = this.formatTimeShort(this.countdownDuration);
        this.remainingTime.textContent = 'Timer Complete!';
        this.circularStatus.textContent = 'Complete';
        this.circularStatus.style.color = 'var(--success-color)';
        this.progressBar.style.strokeDashoffset = 0;
        this.progressBar.style.stroke = 'var(--success-color)';

        // Reset state
        this.elapsedTime = 0;
        this.isCountdown = false;
        this.countdownDuration = 0;
        this.currentTask = null;
        this.currentTaskDisplay.textContent = 'Timer Complete!';
        this.timeDisplay.textContent = '00:00:00';
        this.timeDisplay.style.color = 'var(--success-color)';

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = true;

        // Reset after 3 seconds and switch back to regular display
        setTimeout(() => {
            this.circularTimer.style.display = 'none';
            this.regularTimerDisplay.style.display = 'block';
            this.timeDisplay.style.color = '';
            this.currentTaskDisplay.textContent = 'No active task';
        }, 3000);
    }

    pauseTimer() {
        if (this.startTime) {
            if (this.isCountdown) {
                // For countdown, add elapsed time
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.elapsedTime += elapsed;
                
                // Update circular timer display to show elapsed time
                this.circularTimeDisplay.textContent = this.formatTimeShort(this.elapsedTime);
                const remaining = Math.max(0, this.countdownDuration - this.elapsedTime);
                this.remainingTime.textContent = `Remaining time: ${this.formatTimeShort(remaining)}`;
            } else {
                // For regular timer, add elapsed time
                this.elapsedTime += Math.floor((Date.now() - this.startTime) / 1000);
            }
            this.startTime = null;
        }
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;

        // Update task status
        if (this.currentTask && !this.isCountdown) {
            const task = this.tasks.find(t => t.id === this.currentTask);
            if (task) {
                task.isRunning = false;
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    stopTimer() {
        if (this.startTime) {
            if (this.isCountdown) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.elapsedTime += elapsed;
            } else {
                this.elapsedTime += Math.floor((Date.now() - this.startTime) / 1000);
            }
            this.startTime = null;
        }

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Handle countdown timer
        if (this.isCountdown) {
            const elapsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
            const timeSpent = this.elapsedTime + elapsed;
            if (timeSpent > 0) {
                this.addToHistory(`Quick Timer (${this.countdownDuration / 60} min)`, timeSpent);
                this.saveHistory();
                this.renderHistory();
                this.updateStats();
            }
            this.isCountdown = false;
            this.countdownDuration = 0;
            
            // Hide circular timer, show regular display
            this.circularTimer.style.display = 'none';
            this.regularTimerDisplay.style.display = 'block';
        } else if (this.currentTask && this.elapsedTime > 0) {
            // Handle regular task timer
            const task = this.tasks.find(t => t.id === this.currentTask);
            if (task) {
                task.totalTime += this.elapsedTime;
                task.isRunning = false;
                
                // Add to history
                this.addToHistory(task.name, this.elapsedTime);
                
                this.saveTasks();
                this.saveHistory();
                this.renderTasks();
                this.renderHistory();
                this.updateStats();
            }
        }

        this.elapsedTime = 0;
        this.currentTask = null;
        this.currentTaskDisplay.textContent = 'No active task';
        this.timeDisplay.textContent = '00:00:00';
        this.timeDisplay.style.color = '';

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = true;
    }

    addTask() {
        const taskName = this.taskInput.value.trim();
        if (!taskName) {
            alert('Please enter a task name!');
            return;
        }

        const task = {
            id: Date.now().toString(),
            name: taskName,
            totalTime: 0,
            isRunning: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.renderTasks();
    }

    showTaskNameModal() {
        if (this.taskNameModal) {
            this.taskNameModal.style.display = 'flex';
            if (this.taskNameInput) {
                this.taskNameInput.value = '';
                setTimeout(() => this.taskNameInput.focus(), 100);
            }
        }
    }

    closeTaskNameModal() {
        if (this.taskNameModal) {
            this.taskNameModal.style.display = 'none';
            if (this.taskNameInput) {
                this.taskNameInput.value = '';
            }
        }
    }

    confirmTaskAndStart() {
        const taskName = this.taskNameInput ? this.taskNameInput.value.trim() : '';
        if (!taskName) {
            if (this.taskNameInput) {
                this.taskNameInput.focus();
            }
            return;
        }

        // Create task if it doesn't exist
        let task = this.tasks.find(t => t.name.toLowerCase() === taskName.toLowerCase());
        if (!task) {
            task = {
                id: Date.now().toString(),
                name: taskName,
                totalTime: 0,
                isRunning: false,
                createdAt: new Date().toISOString()
            };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
        }

        // Select the task
        this.currentTask = task.id;
        this.elapsedTime = 0;
        if (this.currentTaskDisplay) {
            this.currentTaskDisplay.textContent = task.name;
        }
        if (this.timeDisplay) {
            this.timeDisplay.textContent = '00:00:00';
        }

        // Close modal
        this.closeTaskNameModal();

        // Start the timer
        this.startTime = Date.now();
        this.timer = setInterval(() => this.updateDisplay(), 100);
        
        if (this.startBtn) this.startBtn.disabled = true;
        if (this.pauseBtn) this.pauseBtn.disabled = false;
        if (this.stopBtn) this.stopBtn.disabled = false;

        // Update task status
        task.isRunning = true;
        this.saveTasks();
        this.renderTasks();
    }

    selectTask(taskId) {
        // Stop current timer if running
        if (this.timer) {
            this.pauseTimer();
        }

        // If selecting the same task, resume it
        if (this.currentTask === taskId) {
            this.startTimer();
            return;
        }

        // Save previous task time if any
        if (this.currentTask && this.elapsedTime > 0) {
            const prevTask = this.tasks.find(t => t.id === this.currentTask);
            if (prevTask) {
                prevTask.totalTime += this.elapsedTime;
            }
        }

        // Set new current task
        this.currentTask = taskId;
        this.elapsedTime = 0;
        const task = this.tasks.find(t => t.id === taskId);
        this.currentTaskDisplay.textContent = task ? task.name : 'No active task';
        this.timeDisplay.textContent = '00:00:00';

        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(taskId) {
        if (this.currentTask === taskId) {
            this.stopTimer();
        }
        
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.activeTasksList.innerHTML = '<div class="empty-state">No active tasks. Add a task to start tracking!</div>';
            return;
        }

        this.activeTasksList.innerHTML = this.tasks.map(task => {
            const isActive = this.currentTask === task.id;
            const totalTime = task.totalTime + (isActive && this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0);
            
            return `
                <div class="task-item ${isActive ? 'active' : ''}">
                    <div class="task-info">
                        <div class="task-name">${task.name}</div>
                        <div class="task-time">Total: ${this.formatTimeShortDisplay(totalTime)}</div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-action" onclick="timer.selectTask('${task.id}')">
                            <i class="fas fa-play"></i> ${isActive ? 'Resume' : 'Start'}
                        </button>
                        <button class="btn-action delete" onclick="timer.deleteTask('${task.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    addToHistory(taskName, timeSpent) {
        const historyItem = {
            id: Date.now().toString(),
            taskName: taskName,
            timeSpent: timeSpent,
            date: new Date().toISOString()
        };

        this.history.unshift(historyItem);
        
        // Keep only last 100 items
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
    }

    renderHistory() {
        const today = new Date().toDateString();
        const todayHistory = this.history.filter(item => {
            const itemDate = new Date(item.date).toDateString();
            return itemDate === today;
        });

        if (todayHistory.length === 0) {
            this.historyList.innerHTML = '<div class="empty-state">No completed tasks today.</div>';
            return;
        }

        this.historyList.innerHTML = todayHistory.map(item => {
            const date = new Date(item.date);
            const timeString = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <div class="history-item" data-id="${item.id}">
                    <div class="history-info">
                        <div class="task-name-editable">
                            <span class="task-name-display">${item.taskName}</span>
                            <input type="text" class="task-name-edit" value="${item.taskName}" style="display: none;">
                        </div>
                        <div class="history-date">${timeString}</div>
                    </div>
                    <div class="history-item-actions">
                        <div class="task-time">${this.formatTimeShortDisplay(item.timeSpent)}</div>
                        <button class="btn-action btn-edit" onclick="timer.editHistoryItem('${item.id}')" title="Edit task name">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    editHistoryItem(itemId) {
        const historyItem = document.querySelector(`.history-item[data-id="${itemId}"]`);
        if (!historyItem) return;

        const displaySpan = historyItem.querySelector('.task-name-display');
        const editInput = historyItem.querySelector('.task-name-edit');
        const editBtn = historyItem.querySelector('.btn-edit');
        const isEditing = editBtn.innerHTML.includes('fa-check');
        
        if (isEditing) {
            // Save the edit
            const newName = editInput.value.trim();
            if (newName) {
                const item = this.history.find(h => h.id === itemId);
                if (item) {
                    item.taskName = newName;
                    this.saveHistory();
                    this.renderHistory();
                    this.updateStats();
                }
            } else {
                // Cancel if empty - restore original value
                const item = this.history.find(h => h.id === itemId);
                if (item) {
                    editInput.value = item.taskName;
                }
                displaySpan.style.display = 'inline';
                editInput.style.display = 'none';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            }
        } else {
            // Start editing
            displaySpan.style.display = 'none';
            editInput.style.display = 'block';
            editInput.focus();
            editInput.select();
            editBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            // Handle Enter key to save and Escape to cancel
            const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const newName = editInput.value.trim();
                    if (newName) {
                        const item = this.history.find(h => h.id === itemId);
                        if (item) {
                            item.taskName = newName;
                            this.saveHistory();
                            this.renderHistory();
                            this.updateStats();
                        }
                    } else {
                        const item = this.history.find(h => h.id === itemId);
                        if (item) {
                            editInput.value = item.taskName;
                        }
                        displaySpan.style.display = 'inline';
                        editInput.style.display = 'none';
                        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    }
                    editInput.removeEventListener('keydown', handleKeyDown);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    const item = this.history.find(h => h.id === itemId);
                    if (item) {
                        editInput.value = item.taskName;
                    }
                    displaySpan.style.display = 'inline';
                    editInput.style.display = 'none';
                    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    editInput.removeEventListener('keydown', handleKeyDown);
                }
            };
            
            editInput.addEventListener('keydown', handleKeyDown);
        }
    }

    updateStats() {
        const today = new Date().toDateString();
        const todayHistory = this.history.filter(item => {
            const itemDate = new Date(item.date).toDateString();
            return itemDate === today;
        });

        const totalSeconds = todayHistory.reduce((sum, item) => sum + item.timeSpent, 0);
        const tasksCompleted = todayHistory.length;
        const avgTime = tasksCompleted > 0 ? Math.floor(totalSeconds / tasksCompleted) : 0;

        document.getElementById('totalTimeToday').textContent = this.formatTimeShortDisplay(totalSeconds);
        document.getElementById('tasksCompleted').textContent = tasksCompleted;
        document.getElementById('avgTaskTime').textContent = this.formatTimeShortDisplay(avgTime);
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.updateStats();
        }
    }

    exportToCSV() {
        if (this.history.length === 0) {
            alert('No history data to export.');
            return;
        }

        // Get current export date
        const exportDate = new Date();
        const exportDateString = exportDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const exportTimeString = exportDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const exportDateTime = `${exportDateString} ${exportTimeString}`;

        // CSV Headers
        const headers = ['Task Name', 'Date', 'Time', 'Duration (seconds)', 'Duration (formatted)'];
        
        // Convert history to CSV rows
        const csvRows = [
            `"Export Date: ${exportDateTime}"`,
            '',
            headers.join(','),
            ...this.history.map(item => {
                const date = new Date(item.date);
                const dateString = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                const timeString = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                const datetimeString = `${dateString} ${timeString}`;
                
                // Escape commas and quotes in task name
                const taskName = `"${item.taskName.replace(/"/g, '""')}"`;
                
                return [
                    taskName,
                    datetimeString,
                    timeString,
                    item.timeSpent,
                    this.formatTimeShortDisplay(item.timeSpent)
                ].join(',');
            })
        ];

        // Create CSV content
        const csvContent = csvRows.join('\n');
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Generate filename with current date
        const now = new Date();
        const filename = `task-history-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    saveTasks() {
        localStorage.setItem('workTimer_tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('workTimer_tasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('workTimer_history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('workTimer_history');
        return saved ? JSON.parse(saved) : [];
    }

    setupNotification() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Create audio element for beep.mp3
        this.audioElement = new Audio('./beep.mp3');
        this.audioElement.volume = 0.7;
        this.audioElement.preload = 'auto';
    }

    playNotification() {
        // Play beep.mp3 file
        if (this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }

    openCustomTimePicker() {
        this.timePickerModal.classList.add('active');
        this.initializeTimeWheels();
    }

    closeCustomTimePicker() {
        this.timePickerModal.classList.remove('active');
    }

    initializeTimeWheels() {
        // Initialize hours wheel (0-23)
        this.hoursContent.innerHTML = '';
        for (let i = 0; i <= 23; i++) {
            const item = document.createElement('div');
            item.className = 'wheel-item';
            item.textContent = String(i).padStart(2, '0');
            item.dataset.value = i;
            this.hoursContent.appendChild(item);
        }
        
        // Initialize minutes wheel (0-59)
        this.minutesContent.innerHTML = '';
        for (let i = 0; i <= 59; i++) {
            const item = document.createElement('div');
            item.className = 'wheel-item';
            item.textContent = String(i).padStart(2, '0');
            item.dataset.value = i;
            this.minutesContent.appendChild(item);
        }

        // Set initial scroll positions
        setTimeout(() => {
            this.updateWheelPosition(this.hoursWheel, this.selectedHours);
            this.updateWheelPosition(this.minutesWheel, this.selectedMinutes);
        }, 50);

        // Remove existing listeners and add new ones
        const hoursHandler = () => {
            this.onWheelScroll(this.hoursWheel, 'hours');
            clearTimeout(this.hoursScrollTimeout);
            this.hoursScrollTimeout = setTimeout(() => {
                this.snapToNearest(this.hoursWheel, 'hours');
            }, 150);
        };

        const minutesHandler = () => {
            this.onWheelScroll(this.minutesWheel, 'minutes');
            clearTimeout(this.minutesScrollTimeout);
            this.minutesScrollTimeout = setTimeout(() => {
                this.snapToNearest(this.minutesWheel, 'minutes');
            }, 150);
        };

        // Remove old listeners if they exist
        if (this.hoursScrollHandler) {
            this.hoursWheel.removeEventListener('scroll', this.hoursScrollHandler);
        }
        if (this.minutesScrollHandler) {
            this.minutesWheel.removeEventListener('scroll', this.minutesScrollHandler);
        }

        // Add new listeners
        this.hoursScrollHandler = hoursHandler;
        this.minutesScrollHandler = minutesHandler;
        this.hoursWheel.addEventListener('scroll', this.hoursScrollHandler);
        this.minutesWheel.addEventListener('scroll', this.minutesScrollHandler);
    }

    updateWheelPosition(wheel, value) {
        const content = wheel.querySelector('.wheel-content');
        const items = content.querySelectorAll('.wheel-item');
        items.forEach(item => item.classList.remove('selected'));
        
        const selectedItem = Array.from(items).find(item => parseInt(item.dataset.value) === value);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            const itemHeight = 40;
            const scrollPosition = value * itemHeight;
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => {
                wheel.scrollTop = scrollPosition;
            }, 10);
        }
    }

    onWheelScroll(wheel, type) {
        const scrollTop = wheel.scrollTop;
        const itemHeight = 40;
        const selectedIndex = Math.round(scrollTop / itemHeight);
        
        const content = wheel.querySelector('.wheel-content');
        const items = content.querySelectorAll('.wheel-item');
        items.forEach(item => item.classList.remove('selected'));
        
        if (items[selectedIndex]) {
            items[selectedIndex].classList.add('selected');
            const value = parseInt(items[selectedIndex].dataset.value);
            
            if (type === 'hours') {
                this.selectedHours = value;
            } else {
                this.selectedMinutes = value;
            }
        }
    }

    snapToNearest(wheel, type) {
        const scrollTop = wheel.scrollTop;
        const itemHeight = 40;
        const nearestIndex = Math.round(scrollTop / itemHeight);
        const snapPosition = nearestIndex * itemHeight;
        
        wheel.scrollTo({
            top: snapPosition,
            behavior: 'smooth'
        });
        
        const content = wheel.querySelector('.wheel-content');
        const items = content.querySelectorAll('.wheel-item');
        if (items[nearestIndex]) {
            const value = parseInt(items[nearestIndex].dataset.value);
            if (type === 'hours') {
                this.selectedHours = value;
            } else {
                this.selectedMinutes = value;
            }
        }
    }

    startCustomTimer() {
        const totalMinutes = (this.selectedHours * 60) + this.selectedMinutes;
        
        if (totalMinutes === 0) {
            alert('Please select a time greater than 0.');
            return;
        }

        this.closeCustomTimePicker();
        this.startPresetTimer(totalMinutes);
    }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Use relative path for service worker
        const swPath = './sw.js';
        navigator.serviceWorker.register(swPath, { scope: './' })
            .then((registration) => {
                console.log('ServiceWorker registration successful:', registration.scope);
                // Check for updates
                registration.update();
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show custom install button or notification
    console.log('PWA install prompt available');
    // You can show a custom install button here
    showInstallButton();
});

// Show install button when PWA can be installed
function showInstallButton() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return; // Already installed
    }
    
    // Create or show install button
    let installBtn = document.getElementById('installBtn');
    if (!installBtn) {
        installBtn = document.createElement('button');
        installBtn.id = 'installBtn';
        installBtn.className = 'btn-install-pwa';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
        installBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; background: linear-gradient(45deg, #4A90E2, #50E3C2); color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1000;';
        document.body.appendChild(installBtn);
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                // Clear the deferredPrompt
                deferredPrompt = null;
                // Hide the install button
                installBtn.style.display = 'none';
            }
        });
    } else {
        installBtn.style.display = 'block';
    }
}

// Hide install button after installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    deferredPrompt = null;
});

// Initialize timer when page loads
let timer;
document.addEventListener('DOMContentLoaded', () => {
    timer = new WorkTimer();
    
    // Make timer globally accessible for onclick handlers
    window.timer = timer;
    
    // Check for preset parameter from PWA shortcuts
    const urlParams = new URLSearchParams(window.location.search);
    const preset = urlParams.get('preset');
    if (preset) {
        const minutes = parseInt(preset);
        if (minutes > 0) {
            // Small delay to ensure everything is initialized
            setTimeout(() => {
                timer.startPresetTimer(minutes);
            }, 100);
        }
    }
    
    // Update display every second
    setInterval(() => {
        if (timer) {
            timer.updateDisplay();
        }
    }, 1000);
});

