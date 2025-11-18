// Daybook Application
class Daybook {
    constructor() {
        this.entries = this.loadEntries();
        this.shopSettings = this.loadShopSettings();
        this.currentFilter = 'all';
        this.editingEntryId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderEntries();
        this.updateSummary();
        this.loadShopSettingsToForm();
    }

    // Local Storage
    loadEntries() {
        const stored = localStorage.getItem('daybookEntries');
        return stored ? JSON.parse(stored) : [];
    }

    saveEntries() {
        localStorage.setItem('daybookEntries', JSON.stringify(this.entries));
    }

    loadShopSettings() {
        const stored = localStorage.getItem('daybookShopSettings');
        return stored ? JSON.parse(stored) : {
            shopName: '',
            address: '',
            email: '',
            phone: ''
        };
    }

    saveShopSettings() {
        localStorage.setItem('daybookShopSettings', JSON.stringify(this.shopSettings));
    }

    // Event Listeners
    setupEventListeners() {
        // Income Modal
        document.getElementById('addIncomeBtn').addEventListener('click', () => this.openIncomeModal());
        document.getElementById('closeIncomeModal').addEventListener('click', () => this.closeIncomeModal());
        document.getElementById('cancelIncomeBtn').addEventListener('click', () => this.closeIncomeModal());
        document.getElementById('saveIncomeBtn').addEventListener('click', () => this.saveIncomeEntry());

        // Expense Modal
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.openExpenseModal());
        document.getElementById('closeExpenseModal').addEventListener('click', () => this.closeExpenseModal());
        document.getElementById('cancelExpenseBtn').addEventListener('click', () => this.closeExpenseModal());
        document.getElementById('saveExpenseBtn').addEventListener('click', () => this.saveExpenseEntry());

        // Settings Modal
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveShopSettings());

        // Export Dropdown
        const exportBtn = document.getElementById('exportBtn');
        const exportDropdown = document.getElementById('exportDropdown');
        
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = exportDropdown.classList.toggle('show');
            exportBtn.classList.toggle('active', isOpen);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!exportBtn.contains(e.target) && !exportDropdown.contains(e.target)) {
                exportDropdown.classList.remove('show');
                exportBtn.classList.remove('active');
            }
        });
        
        // Handle export format selection
        document.querySelectorAll('#exportDropdown .dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const format = e.currentTarget.dataset.format;
                exportDropdown.classList.remove('show');
                exportBtn.classList.remove('active');
                this.exportData(format);
            });
        });

        // Invoice Modal
        document.getElementById('closeInvoiceModal').addEventListener('click', () => {
            document.getElementById('invoiceModal').classList.remove('active');
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderEntries();
            });
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // Date/Time Helpers
    setDefaultDate() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        
        document.getElementById('incomeDate').value = dateStr;
        document.getElementById('incomeTime').value = timeStr;
        document.getElementById('expenseDate').value = dateStr;
        document.getElementById('expenseTime').value = timeStr;
    }

    // Income Modal
    openIncomeModal(entryId = null) {
        const modal = document.getElementById('incomeModal');
        const modalHeader = modal.querySelector('.modal-header h2');
        this.editingEntryId = entryId;
        
        const saveBtn = document.getElementById('saveIncomeBtn');
        
        if (entryId) {
            // Edit mode
            const entry = this.entries.find(e => e.id === entryId);
            if (entry && entry.type === 'income') {
                modalHeader.innerHTML = '<i class="fas fa-edit"></i> Edit Income Entry';
                saveBtn.textContent = 'Update Income';
                document.getElementById('incomeDate').value = entry.date;
                document.getElementById('incomeTime').value = entry.time;
                document.getElementById('incomeCustomerName').value = entry.customerName || '';
                document.getElementById('incomeDescription').value = entry.description || '';
                document.getElementById('incomeAmount').value = entry.amount || entry.total;
            } else {
                return;
            }
        } else {
            // Add mode
            modalHeader.innerHTML = '<i class="fas fa-arrow-up"></i> Add Income Entry';
            saveBtn.textContent = 'Save Income';
            this.setDefaultDate();
            document.getElementById('incomeDescription').value = '';
            document.getElementById('incomeCustomerName').value = '';
            document.getElementById('incomeAmount').value = '';
        }
        
        modal.classList.add('active');
    }

    closeIncomeModal() {
        document.getElementById('incomeModal').classList.remove('active');
        this.editingEntryId = null;
    }

    saveIncomeEntry() {
        const date = document.getElementById('incomeDate').value;
        const time = document.getElementById('incomeTime').value;
        const customerName = document.getElementById('incomeCustomerName').value.trim();
        const description = document.getElementById('incomeDescription').value;
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        
        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        if (this.editingEntryId) {
            // Update existing entry
            const entryIndex = this.entries.findIndex(e => e.id === this.editingEntryId);
            if (entryIndex !== -1) {
                this.entries[entryIndex] = {
                    ...this.entries[entryIndex],
                    date: date,
                    time: time,
                    customerName: customerName || '',
                    description: description || 'Income Entry',
                    amount: amount,
                    total: amount,
                    timestamp: new Date(`${date}T${time}`).getTime()
                };
                this.entries.sort((a, b) => b.timestamp - a.timestamp);
                this.saveEntries();
                this.renderEntries();
                this.updateSummary();
                this.closeIncomeModal();
                this.showToast('Income entry updated successfully!');
            }
        } else {
            // Create new entry
            const entry = {
                id: Date.now(),
                type: 'income',
                date: date,
                time: time,
                customerName: customerName || '',
                description: description || 'Income Entry',
                amount: amount,
                total: amount,
                timestamp: new Date(`${date}T${time}`).getTime()
            };
            
            this.entries.push(entry);
            this.entries.sort((a, b) => b.timestamp - a.timestamp);
            this.saveEntries();
            this.renderEntries();
            this.updateSummary();
            this.closeIncomeModal();
            this.showToast('Income entry saved successfully!');
        }
    }

    // Expense Modal
    openExpenseModal(entryId = null) {
        const modal = document.getElementById('expenseModal');
        const modalHeader = modal.querySelector('.modal-header h2');
        this.editingEntryId = entryId;
        
        const saveBtn = document.getElementById('saveExpenseBtn');
        
        if (entryId) {
            // Edit mode
            const entry = this.entries.find(e => e.id === entryId);
            if (entry && entry.type === 'expense') {
                modalHeader.innerHTML = '<i class="fas fa-edit"></i> Edit Expense Entry';
                saveBtn.textContent = 'Update Expense';
                document.getElementById('expenseDate').value = entry.date;
                document.getElementById('expenseTime').value = entry.time;
                document.getElementById('expenseDescription').value = entry.description || '';
                document.getElementById('expenseAmount').value = entry.amount || entry.total;
            } else {
                return;
            }
        } else {
            // Add mode
            modalHeader.innerHTML = '<i class="fas fa-arrow-down"></i> Add Expense Entry';
            saveBtn.textContent = 'Save Expense';
            this.setDefaultDate();
            document.getElementById('expenseDescription').value = '';
            document.getElementById('expenseAmount').value = '';
        }
        
        modal.classList.add('active');
    }

    closeExpenseModal() {
        document.getElementById('expenseModal').classList.remove('active');
        this.editingEntryId = null;
    }

    saveExpenseEntry() {
        const date = document.getElementById('expenseDate').value;
        const time = document.getElementById('expenseTime').value;
        const description = document.getElementById('expenseDescription').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        
        if (!description) {
            this.showToast('Please enter a description', 'error');
            return;
        }
        
        if (!amount || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        if (this.editingEntryId) {
            // Update existing entry
            const entryIndex = this.entries.findIndex(e => e.id === this.editingEntryId);
            if (entryIndex !== -1) {
                this.entries[entryIndex] = {
                    ...this.entries[entryIndex],
                    date: date,
                    time: time,
                    description: description,
                    amount: amount,
                    total: amount,
                    timestamp: new Date(`${date}T${time}`).getTime()
                };
                this.entries.sort((a, b) => b.timestamp - a.timestamp);
                this.saveEntries();
                this.renderEntries();
                this.updateSummary();
                this.closeExpenseModal();
                this.showToast('Expense entry updated successfully!');
            }
        } else {
            // Create new entry
            const entry = {
                id: Date.now(),
                type: 'expense',
                date: date,
                time: time,
                description: description,
                amount: amount,
                total: amount,
                timestamp: new Date(`${date}T${time}`).getTime()
            };
            
            this.entries.push(entry);
            this.entries.sort((a, b) => b.timestamp - a.timestamp);
            this.saveEntries();
            this.renderEntries();
            this.updateSummary();
            this.closeExpenseModal();
            this.showToast('Expense entry saved successfully!');
        }
    }

    // Settings Modal
    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('active');
        this.loadShopSettingsToForm();
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    loadShopSettingsToForm() {
        document.getElementById('shopName').value = this.shopSettings.shopName || '';
        document.getElementById('shopAddress').value = this.shopSettings.address || '';
        document.getElementById('shopEmail').value = this.shopSettings.email || '';
        document.getElementById('shopPhone').value = this.shopSettings.phone || '';
    }

    saveShopSettings() {
        this.shopSettings = {
            shopName: document.getElementById('shopName').value.trim(),
            address: document.getElementById('shopAddress').value.trim(),
            email: document.getElementById('shopEmail').value.trim(),
            phone: document.getElementById('shopPhone').value.trim()
        };
        
        this.saveShopSettings();
        this.closeSettingsModal();
        this.showToast('Shop settings saved successfully!');
    }

    // Render Entries
    renderEntries() {
        const tbody = document.getElementById('entriesTableBody');
        const emptyState = document.getElementById('emptyState');
        
        let filteredEntries = this.entries;
        if (this.currentFilter !== 'all') {
            filteredEntries = this.entries.filter(e => e.type === this.currentFilter);
        }
        
        if (filteredEntries.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        tbody.innerHTML = filteredEntries.map(entry => {
            const dateTime = `${this.formatDate(entry.date)} ${entry.time}`;
            const typeClass = entry.type === 'income' ? 'income' : 'expense';
            const typeLabel = entry.type === 'income' ? 'Income' : 'Expense';
            
            const description = entry.description || '-';
            
            return `
                <tr>
                    <td>${dateTime}</td>
                    <td><span class="entry-type ${typeClass}">${typeLabel}</span></td>
                    <td>${description}</td>
                    <td><strong>₹${entry.total.toFixed(2)}</strong></td>
                    <td>
                        <div class="entry-actions">
                            <button class="action-btn edit" onclick="daybook.${entry.type === 'income' ? 'openIncomeModal' : 'openExpenseModal'}(${entry.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            ${entry.type === 'income' ? `
                                <button class="action-btn view" onclick="daybook.generateInvoice(${entry.id})">
                                    <i class="fas fa-file-invoice"></i> Invoice
                                </button>
                            ` : ''}
                            <button class="action-btn delete" onclick="daybook.deleteEntry(${entry.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Update Summary
    updateSummary() {
        const totalIncome = this.entries
            .filter(e => e.type === 'income')
            .reduce((sum, e) => sum + e.total, 0);
        
        const totalExpense = this.entries
            .filter(e => e.type === 'expense')
            .reduce((sum, e) => sum + e.total, 0);
        
        const netBalance = totalIncome - totalExpense;
        
        document.getElementById('totalIncome').textContent = `₹${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `₹${totalExpense.toFixed(2)}`;
        document.getElementById('netBalance').textContent = `₹${netBalance.toFixed(2)}`;
        
        // Update balance color
        const balanceEl = document.getElementById('netBalance');
        balanceEl.parentElement.parentElement.style.borderLeft = netBalance >= 0 
            ? '4px solid var(--income-color)' 
            : '4px solid var(--expense-color)';
    }

    // Delete Entry
    deleteEntry(id) {
        if (confirm('Are you sure you want to delete this entry?')) {
            this.entries = this.entries.filter(e => e.id !== id);
            this.saveEntries();
            this.renderEntries();
            this.updateSummary();
            this.showToast('Entry deleted successfully!');
        }
    }

    // Generate Invoice Number
    generateInvoiceNumber(entry) {
        // Format: INV-DDMMYYYY-XXXXXXX
        // entry.date is in format "YYYY-MM-DD"
        const dateParts = entry.date.split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        const dateStr = `${day}${month}${year}`;
        
        // Get last 7 digits from entry.id and pad to 7 digits
        const idStr = String(entry.id);
        const lastDigits = idStr.slice(-7);
        const paddedId = lastDigits.padStart(7, '0');
        
        // Ensure it's within range 0001-9999999
        const numId = parseInt(paddedId);
        const finalId = Math.min(Math.max(numId, 1), 9999999).toString().padStart(7, '0');
        
        return `INV-${dateStr}-${finalId}`;
    }

    // Generate Invoice
    generateInvoice(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry || entry.type !== 'income') {
            this.showToast('Invalid entry for invoice generation', 'error');
            return;
        }
        
        const invoiceBody = document.getElementById('invoiceBody');
        const shopName = this.shopSettings.shopName || 'Your Shop Name';
        const address = this.shopSettings.address || 'Your Shop Address';
        const email = this.shopSettings.email || 'your.email@example.com';
        const phone = this.shopSettings.phone || 'Your Phone Number';
        
        const invoiceNumber = this.generateInvoiceNumber(entry);
        const invoiceDate = this.formatDate(entry.date);
        
        invoiceBody.innerHTML = `
            <div class="invoice-header">
                <h1>INVOICE</h1>
                <p>Invoice #${invoiceNumber}</p>
            </div>
            
            <div class="invoice-details">
                <div class="invoice-shop-info">
                    <h3>${shopName}</h3>
                    <p>${address.replace(/\n/g, '<br>')}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                </div>
                <div>
                    <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
                    <p><strong>Time:</strong> ${entry.time}</p>
                    ${entry.description ? `<p><strong>Description:</strong> ${entry.description}</p>` : ''}
                </div>
            </div>
            
            ${entry.customerName ? `
                <div style="margin-bottom: 20px;">
                    <p><strong>Customer:</strong> ${entry.customerName}</p>
                </div>
            ` : ''}
            <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.25rem;">
                    <strong>Amount:</strong>
                    <strong style="color: var(--income-color);">₹${entry.total.toFixed(2)}</strong>
                </div>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 0.875rem;">
                <p>Thank you for your business!</p>
            </div>
        `;
        
        document.getElementById('invoiceModal').classList.add('active');
        
        // Print button
        document.getElementById('printInvoiceBtn').onclick = () => {
            window.print();
        };
    }

    // Export Data
    exportData(format = 'csv') {
        if (this.entries.length === 0) {
            this.showToast('No data to export', 'error');
            return;
        }
        
        if (format === 'csv') {
            this.exportToCSV();
        } else {
            this.exportToJSON();
        }
    }

    exportToCSV() {
        const headers = ['Date', 'Time', 'Type', 'Customer Name', 'Description', 'Amount', 'Total'];
        const rows = this.entries.map(entry => {
            return [
                entry.date,
                entry.time,
                entry.type.toUpperCase(),
                entry.customerName || '',
                entry.description || '',
                entry.amount || entry.total,
                entry.total
            ];
        });
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `daybook_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Data exported to CSV successfully!');
    }

    exportToJSON() {
        const data = {
            exportDate: new Date().toISOString(),
            shopSettings: this.shopSettings,
            entries: this.entries
        };
        
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `daybook_export_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Data exported to JSON successfully!');
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toast.style.background = 'var(--expense-color)';
        } else {
            toast.style.background = 'var(--income-color)';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application
let daybook;
document.addEventListener('DOMContentLoaded', () => {
    daybook = new Daybook();
});

