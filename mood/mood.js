// Mood Logger Application
class MoodLogger {
    constructor() {
        this.moods = this.loadMoods();
        this.selectedMood = null;
        this.charts = {};
        this.currentPeriod = 7;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderEntries();
        this.updateCharts();
    }

    // Load moods from localStorage
    loadMoods() {
        const stored = localStorage.getItem('moodEntries');
        return stored ? JSON.parse(stored) : [];
    }

    // Save moods to localStorage
    saveMoods() {
        localStorage.setItem('moodEntries', JSON.stringify(this.moods));
    }

    // Setup event listeners
    setupEventListeners() {
        // Mood button selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMood(e.currentTarget);
            });
        });

        // Save mood button
        document.getElementById('save-mood-btn').addEventListener('click', () => {
            this.saveMood();
        });

        // Period filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentPeriod = e.currentTarget.dataset.period;
                this.updateCharts();
            });
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Notes textarea auto-resize
        const notesTextarea = document.getElementById('mood-notes');
        notesTextarea.addEventListener('input', () => {
            notesTextarea.style.height = 'auto';
            notesTextarea.style.height = notesTextarea.scrollHeight + 'px';
        });
    }

    // Select a mood
    selectMood(button) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        this.selectedMood = {
            emoji: button.dataset.mood,
            label: button.dataset.label
        };
        document.getElementById('save-mood-btn').disabled = false;
    }

    // Save mood entry
    saveMood() {
        if (!this.selectedMood) return;

        const notes = document.getElementById('mood-notes').value.trim();
        const now = new Date();

        const entry = {
            id: Date.now(),
            emoji: this.selectedMood.emoji,
            label: this.selectedMood.label,
            notes: notes,
            date: now.toISOString(),
            timestamp: now.getTime()
        };

        this.moods.unshift(entry); // Add to beginning
        this.saveMoods();

        // Reset form
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('mood-notes').value = '';
        document.getElementById('save-mood-btn').disabled = true;
        const savedMoodLabel = this.selectedMood.label;
        this.selectedMood = null;

        // Show success message
        this.showSuccessMessage();

        // Show mood improvement suggestion if negative
        this.showMoodSuggestion(savedMoodLabel);

        // Update UI
        this.renderEntries();
        this.updateCharts();
    }

    // Show success message
    showSuccessMessage() {
        const messageEl = document.getElementById('success-message');
        messageEl.textContent = 'Mood entry saved successfully! ✨';
        messageEl.classList.add('show');
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    }

    // Check if mood is negative
    isNegativeMood(label) {
        const negativeMoods = [
            'Sad', 'Upset', 'Angry', 'Anxious', 'Frustrated', 
            'Stressed', 'Worried', 'Disappointed', 'Overwhelmed', 
            'Bored', 'Lonely', 'Confused', 'Tired', 'Stuck', 'Burned Out'
        ];
        return negativeMoods.includes(label);
    }

    // Get mood improvement suggestions
    getMoodSuggestion(label) {
        const suggestions = {
            'Sad': {
                title: '💙 Feeling Better',
                tips: [
                    'Take a few deep breaths and practice mindfulness',
                    'Listen to your favorite uplifting music',
                    'Reach out to a friend or loved one',
                    'Go for a short walk in nature',
                    'Write down three things you\'re grateful for'
                ]
            },
            'Upset': {
                title: '💚 Finding Calm',
                tips: [
                    'Try the 4-7-8 breathing technique (inhale 4, hold 7, exhale 8)',
                    'Take a warm shower or bath',
                    'Practice gentle stretching or yoga',
                    'Write about what\'s bothering you',
                    'Do something creative like drawing or coloring'
                ]
            },
            'Angry': {
                title: '🧘 Cooling Down',
                tips: [
                    'Step away from the situation and take a break',
                    'Count to 10 slowly before responding',
                    'Go for a brisk walk or do some exercise',
                    'Practice progressive muscle relaxation',
                    'Express your feelings in a journal'
                ]
            },
            'Anxious': {
                title: '🌿 Grounding Yourself',
                tips: [
                    'Try the 5-4-3-2-1 grounding technique (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste)',
                    'Practice box breathing (4 counts in, hold, out, hold)',
                    'Focus on the present moment, not future worries',
                    'Listen to calming music or nature sounds',
                    'Do a quick body scan meditation'
                ]
            },
            'Frustrated': {
                title: '✨ Shifting Perspective',
                tips: [
                    'Break the problem into smaller, manageable steps',
                    'Take a 10-minute break and do something different',
                    'Talk it through with someone you trust',
                    'Focus on what you can control',
                    'Remember past challenges you\'ve overcome'
                ]
            },
            'Stressed': {
                title: '🌊 Releasing Tension',
                tips: [
                    'Practice deep breathing exercises',
                    'Take a short break and stretch your body',
                    'Prioritize your tasks - focus on one thing at a time',
                    'Spend 10 minutes in nature or fresh air',
                    'Try a quick meditation or mindfulness exercise'
                ]
            },
            'Worried': {
                title: '🦋 Easing Concerns',
                tips: [
                    'Write down your worries and challenge negative thoughts',
                    'Focus on what you can control right now',
                    'Practice gratitude - list 3 good things today',
                    'Talk to someone about your concerns',
                    'Do something kind for yourself or others'
                ]
            },
            'Disappointed': {
                title: '🌟 Moving Forward',
                tips: [
                    'Acknowledge your feelings - it\'s okay to feel this way',
                    'Look for the lesson or opportunity in the situation',
                    'Focus on what you can learn from this experience',
                    'Set a new goal or try a different approach',
                    'Remember that setbacks are part of growth'
                ]
            },
            'Overwhelmed': {
                title: '🎯 Taking It Step by Step',
                tips: [
                    'Make a list and prioritize - tackle one thing at a time',
                    'Break large tasks into smaller, manageable pieces',
                    'Take a 15-minute break to recharge',
                    'Say no to non-essential commitments',
                    'Ask for help - you don\'t have to do everything alone'
                ]
            },
            'Bored': {
                title: '🎨 Sparking Interest',
                tips: [
                    'Try something new - a hobby, skill, or activity',
                    'Read a book or listen to a podcast',
                    'Go for a walk and explore your neighborhood',
                    'Learn something new online',
                    'Connect with friends or join a community activity'
                ]
            },
            'Lonely': {
                title: '🤝 Connecting',
                tips: [
                    'Reach out to a friend or family member',
                    'Join a club, class, or community group',
                    'Volunteer for a cause you care about',
                    'Spend time in public spaces like cafes or parks',
                    'Consider joining online communities with shared interests'
                ]
            },
            'Confused': {
                title: '💡 Finding Clarity',
                tips: [
                    'Take a step back and look at the bigger picture',
                    'Write down your questions and thoughts',
                    'Talk to someone who can provide perspective',
                    'Break complex issues into smaller parts',
                    'Give yourself time - clarity often comes with patience'
                ]
            },
            'Tired': {
                title: '⚡ Recharging',
                tips: [
                    'Take a 20-minute power nap if possible',
                    'Get some fresh air and natural light',
                    'Stay hydrated and have a healthy snack',
                    'Do some light stretching or gentle movement',
                    'Prioritize rest - your body needs it'
                ]
            },
            'Stuck': {
                title: '🚀 Breaking Through',
                tips: [
                    'Step away from the problem and take a short break',
                    'Try a different approach or perspective',
                    'Ask for help or collaborate with a colleague',
                    'Break the task into smaller, manageable steps',
                    'Review what has worked in similar situations before'
                ]
            },
            'Burned Out': {
                title: '🛑 Time to Restore',
                tips: [
                    'Take a complete break - your wellbeing comes first',
                    'Set clear boundaries between work and personal time',
                    'Prioritize self-care activities you enjoy',
                    'Consider talking to a supervisor about workload',
                    'Remember: rest is not laziness, it\'s necessary for recovery'
                ]
            }
        };

        return suggestions[label] || null;
    }

    // Show mood improvement suggestion
    showMoodSuggestion(moodLabel) {
        const overlayEl = document.getElementById('mood-suggestion-overlay');
        const suggestionEl = document.getElementById('mood-suggestion');
        
        if (!this.isNegativeMood(moodLabel)) {
            overlayEl.classList.remove('show');
            return;
        }

        const suggestion = this.getMoodSuggestion(moodLabel);
        if (!suggestion) return;

        const randomTip = suggestion.tips[Math.floor(Math.random() * suggestion.tips.length)];

        suggestionEl.innerHTML = `
            <div class="suggestion-header">
                <h3>${suggestion.title}</h3>
                <button class="close-suggestion">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="suggestion-content">
                <p class="suggestion-tip">${randomTip}</p>
                <div class="suggestion-footer">
                    <span>💭 Remember: This feeling is temporary. You've got this!</span>
                </div>
            </div>
        `;

        // Add event listeners (remove old ones first to prevent duplicates)
        const oldCloseBtn = overlayEl.querySelector('.close-suggestion');
        if (oldCloseBtn) {
            oldCloseBtn.replaceWith(oldCloseBtn.cloneNode(true));
        }

        const closeBtn = suggestionEl.querySelector('.close-suggestion');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlayEl.classList.remove('show');
            });
        }

        // Close on overlay click (use once to prevent duplicates)
        const handleOverlayClick = (e) => {
            if (e.target === overlayEl) {
                overlayEl.classList.remove('show');
                overlayEl.removeEventListener('click', handleOverlayClick);
            }
        };
        overlayEl.addEventListener('click', handleOverlayClick);

        // Show popup
        overlayEl.classList.add('show');

        // Auto-hide after 15 seconds
        setTimeout(() => {
            overlayEl.classList.remove('show');
        }, 15000);
    }

    // Render mood entries
    renderEntries() {
        const entriesList = document.getElementById('entries-list');
        const emptyState = document.getElementById('empty-state');

        if (this.moods.length === 0) {
            entriesList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        entriesList.innerHTML = this.moods.map(entry => {
            const date = new Date(entry.date);
            const dateStr = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            return `
                <div class="mood-entry-item">
                    <div class="mood-entry-emoji">${entry.emoji}</div>
                    <div class="mood-entry-details">
                        <div class="mood-entry-label">${entry.label}</div>
                        <div class="mood-entry-date">${dateStr} at ${timeStr}</div>
                        ${entry.notes ? `<div class="mood-entry-notes">"${entry.notes}"</div>` : ''}
                    </div>
                    <button class="delete-btn" onclick="moodLogger.deleteEntry(${entry.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Delete entry
    deleteEntry(id) {
        if (confirm('Are you sure you want to delete this mood entry?')) {
            this.moods = this.moods.filter(entry => entry.id !== id);
            this.saveMoods();
            this.renderEntries();
            this.updateCharts();
        }
    }

    // Get filtered moods based on period
    getFilteredMoods() {
        if (this.currentPeriod === 'all') {
            return this.moods;
        }

        const days = parseInt(this.currentPeriod);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return this.moods.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= cutoffDate;
        });
    }

    // Update all charts
    updateCharts() {
        const filteredMoods = this.getFilteredMoods();
        
        if (filteredMoods.length === 0) {
            this.showEmptyCharts();
            return;
        }

        this.updateTrendChart(filteredMoods);
        this.updateDailyAvgChart(filteredMoods);
        this.updateFrequencyChart(filteredMoods);
        this.updateMonthlyChart(filteredMoods);
    }

    // Show empty charts
    showEmptyCharts() {
        const chartIds = ['trend-chart', 'daily-avg-chart', 'frequency-chart', 'monthly-chart'];
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            const ctx = canvas.getContext('2d');
            
            if (this.charts[id]) {
                this.charts[id].destroy();
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        });
    }

    // Update trend chart
    updateTrendChart(moods) {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        
        if (this.charts['trend-chart']) {
            this.charts['trend-chart'].destroy();
        }

        // Sort by date
        const sortedMoods = [...moods].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Map mood labels to numeric values for trend
        const moodValues = {
            'Happy': 5, 'Excited': 5, 'Confident': 5,
            'Calm': 4, 'Tired': 2, 'Neutral': 3, 'Thoughtful': 3,
            'Confused': 2, 'Sad': 2, 'Upset': 1, 'Angry': 0,
            'Anxious': 1, 'Frustrated': 1, 'Stressed': 1, 'Worried': 1,
            'Disappointed': 1, 'Overwhelmed': 1, 'Bored': 2, 'Lonely': 1,
            'Grateful': 5, 'Peaceful': 4, 'Relaxed': 4, 'Hopeful': 4,
            'Energetic': 5, 'Motivated': 5, 'Proud': 5, 'Loved': 5, 'Blessed': 5,
            'Focused': 5, 'Productive': 5, 'Busy': 3, 'Accomplished': 5,
            'Creative': 5, 'Challenged': 3, 'Stuck': 1, 'Burned Out': 0,
            'Optimistic': 5, 'Determined': 5, 'Curious': 4, 'Satisfied': 5
        };

        const labels = sortedMoods.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const data = sortedMoods.map(entry => moodValues[entry.label] || 3);

        this.charts['trend-chart'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood Score',
                    data: data,
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#50E3C2',
                    pointBorderColor: '#4A90E2',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            },
                            maxRotation: window.innerWidth < 768 ? 45 : 0
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Update daily average chart
    updateDailyAvgChart(moods) {
        const ctx = document.getElementById('daily-avg-chart').getContext('2d');
        
        if (this.charts['daily-avg-chart']) {
            this.charts['daily-avg-chart'].destroy();
        }

        const moodValues = {
            'Happy': 5, 'Excited': 5, 'Confident': 5,
            'Calm': 4, 'Tired': 2, 'Neutral': 3, 'Thoughtful': 3,
            'Confused': 2, 'Sad': 2, 'Upset': 1, 'Angry': 0,
            'Anxious': 1, 'Frustrated': 1, 'Stressed': 1, 'Worried': 1,
            'Disappointed': 1, 'Overwhelmed': 1, 'Bored': 2, 'Lonely': 1,
            'Grateful': 5, 'Peaceful': 4, 'Relaxed': 4, 'Hopeful': 4,
            'Energetic': 5, 'Motivated': 5, 'Proud': 5, 'Loved': 5, 'Blessed': 5,
            'Focused': 5, 'Productive': 5, 'Busy': 3, 'Accomplished': 5,
            'Creative': 5, 'Challenged': 3, 'Stuck': 1, 'Burned Out': 0,
            'Optimistic': 5, 'Determined': 5, 'Curious': 4, 'Satisfied': 5
        };

        // Group by day
        const dailyData = {};
        moods.forEach(entry => {
            const date = new Date(entry.date);
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            if (!dailyData[dayKey]) {
                dailyData[dayKey] = { sum: 0, count: 0 };
            }
            dailyData[dayKey].sum += moodValues[entry.label] || 3;
            dailyData[dayKey].count++;
        });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const labels = days.filter(day => dailyData[day]);
        const data = labels.map(day => (dailyData[day].sum / dailyData[day].count).toFixed(1));

        this.charts['daily-avg-chart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Mood',
                    data: data,
                    backgroundColor: 'rgba(80, 227, 194, 0.6)',
                    borderColor: '#50E3C2',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Update frequency chart
    updateFrequencyChart(moods) {
        const ctx = document.getElementById('frequency-chart').getContext('2d');
        
        if (this.charts['frequency-chart']) {
            this.charts['frequency-chart'].destroy();
        }

        // Count frequency of each mood
        const frequency = {};
        moods.forEach(entry => {
            frequency[entry.label] = (frequency[entry.label] || 0) + 1;
        });

        const labels = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
        const data = labels.map(label => frequency[label]);

        this.charts['frequency-chart'] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(80, 227, 194, 0.8)',
                        'rgba(255, 107, 107, 0.8)',
                        'rgba(255, 206, 84, 0.8)',
                        'rgba(156, 136, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(201, 203, 207, 0.8)'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: window.innerWidth < 768 ? 1.2 : 1.5,
                plugins: {
                    legend: {
                        position: window.innerWidth < 768 ? 'bottom' : 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: window.innerWidth < 768 ? 10 : 15,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Update monthly chart
    updateMonthlyChart(moods) {
        const ctx = document.getElementById('monthly-chart').getContext('2d');
        
        if (this.charts['monthly-chart']) {
            this.charts['monthly-chart'].destroy();
        }

        const moodValues = {
            'Happy': 5, 'Excited': 5, 'Confident': 5,
            'Calm': 4, 'Tired': 2, 'Neutral': 3, 'Thoughtful': 3,
            'Confused': 2, 'Sad': 2, 'Upset': 1, 'Angry': 0,
            'Anxious': 1, 'Frustrated': 1, 'Stressed': 1, 'Worried': 1,
            'Disappointed': 1, 'Overwhelmed': 1, 'Bored': 2, 'Lonely': 1,
            'Grateful': 5, 'Peaceful': 4, 'Relaxed': 4, 'Hopeful': 4,
            'Energetic': 5, 'Motivated': 5, 'Proud': 5, 'Loved': 5, 'Blessed': 5,
            'Focused': 5, 'Productive': 5, 'Busy': 3, 'Accomplished': 5,
            'Creative': 5, 'Challenged': 3, 'Stuck': 1, 'Burned Out': 0,
            'Optimistic': 5, 'Determined': 5, 'Curious': 4, 'Satisfied': 5
        };

        // Group by month
        const monthlyData = {};
        moods.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { sum: 0, count: 0 };
            }
            monthlyData[monthKey].sum += moodValues[entry.label] || 3;
            monthlyData[monthKey].count++;
        });

        const labels = Object.keys(monthlyData).sort();
        const data = labels.map(month => (monthlyData[month].sum / monthlyData[month].count).toFixed(1));

        this.charts['monthly-chart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Mood',
                    data: data,
                    backgroundColor: 'rgba(74, 144, 226, 0.6)',
                    borderColor: '#4A90E2',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Export to CSV
    exportToCSV() {
        if (this.moods.length === 0) {
            alert('No mood entries to export.');
            return;
        }

        // CSV header
        let csv = 'Date,Time,Mood Emoji,Mood Label,Notes\n';

        // CSV rows
        this.moods.forEach(entry => {
            const date = new Date(entry.date);
            const dateStr = date.toLocaleDateString('en-US');
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Escape notes if they contain commas or quotes
            let notes = entry.notes || '';
            if (notes.includes(',') || notes.includes('"')) {
                notes = `"${notes.replace(/"/g, '""')}"`;
            }

            csv += `${dateStr},${timeStr},${entry.emoji},${entry.label},${notes}\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `mood-log-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the app when DOM is loaded
let moodLogger;
document.addEventListener('DOMContentLoaded', () => {
    moodLogger = new MoodLogger();
});

