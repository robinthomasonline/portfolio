// Compliance Presets Configuration
const compliancePresets = {
    iso: {
        name: 'ISO 27001',
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
        description: 'ISO 27001: Minimum 16 characters, mixed case, numbers, and symbols'
    },
    pci: {
        name: 'PCI DSS',
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
        description: 'PCI DSS: Minimum 12 characters, mixed case, numbers, and symbols'
    },
    csa: {
        name: 'CSA',
        length: 14,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: true,
        excludeAmbiguous: false,
        description: 'CSA: Minimum 14 characters with mixed case, numbers, and symbols'
    },
    hipaa: {
        name: 'HIPAA',
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
        description: 'HIPAA: Minimum 12 characters, mixed case, numbers, and symbols'
    },
    nist: {
        name: 'NIST',
        length: 14,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: true,
        excludeAmbiguous: true,
        description: 'NIST: Minimum 14 characters, excludes similar and ambiguous characters'
    },
    gdpr: {
        name: 'GDPR',
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
        description: 'GDPR: Minimum 16 characters, mixed case, numbers, and symbols'
    },
    custom: {
        name: 'Custom',
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
        description: 'Custom: Configure your own password requirements'
    }
};

// Character sets
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Similar and ambiguous characters
const similarChars = 'il1Lo0O';
const ambiguousChars = '{}[]()/\\\'"~,;:.<>';

// DOM Elements
const elements = {
    length: document.getElementById('length'),
    lengthValue: document.getElementById('lengthValue'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    numbers: document.getElementById('numbers'),
    symbols: document.getElementById('symbols'),
    excludeSimilar: document.getElementById('excludeSimilar'),
    excludeAmbiguous: document.getElementById('excludeAmbiguous'),
    generateBtn: document.getElementById('generateBtn'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    passwordsList: document.getElementById('passwordsList'),
    resultsCard: document.getElementById('resultsCard'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// Initialize
let currentPreset = 'custom';

// Event Listeners
elements.length.addEventListener('input', () => {
    elements.lengthValue.textContent = elements.length.value;
});

elements.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        applyPreset(preset);
    });
});

elements.generateBtn.addEventListener('click', generatePasswords);

// Apply preset configuration
function applyPreset(preset, showNotification = true) {
    currentPreset = preset;
    const config = compliancePresets[preset];
    
    // Update UI
    elements.presetBtns.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-preset="${preset}"]`).classList.add('active');
    
    // Apply settings
    elements.length.value = config.length;
    elements.lengthValue.textContent = config.length;
    elements.uppercase.checked = config.uppercase;
    elements.lowercase.checked = config.lowercase;
    elements.numbers.checked = config.numbers;
    elements.symbols.checked = config.symbols;
    elements.excludeSimilar.checked = config.excludeSimilar;
    elements.excludeAmbiguous.checked = config.excludeAmbiguous;
    
    // Show toast only if requested
    if (showNotification) {
        showToast(`${config.name} preset applied`);
    }
}

// Generate passwords
function generatePasswords() {
    // Validate at least one character type is selected
    if (!elements.uppercase.checked && 
        !elements.lowercase.checked && 
        !elements.numbers.checked && 
        !elements.symbols.checked) {
        showToast('Please select at least one character type', 'error');
        return;
    }
    
    const length = parseInt(elements.length.value);
    
    if (length < 8) {
        showToast('Password length must be at least 8 characters', 'error');
        return;
    }
    
    // Build character pool
    let charPool = '';
    if (elements.uppercase.checked) {
        charPool += charSets.uppercase;
    }
    if (elements.lowercase.checked) {
        charPool += charSets.lowercase;
    }
    if (elements.numbers.checked) {
        charPool += charSets.numbers;
    }
    if (elements.symbols.checked) {
        charPool += charSets.symbols;
    }
    
    // Remove excluded characters
    if (elements.excludeSimilar.checked) {
        charPool = charPool.split('').filter(c => !similarChars.includes(c)).join('');
    }
    if (elements.excludeAmbiguous.checked) {
        charPool = charPool.split('').filter(c => !ambiguousChars.includes(c)).join('');
    }
    
    if (charPool.length === 0) {
        showToast('No characters available after exclusions', 'error');
        return;
    }
    
    // Generate password
    const password = generatePassword(length, charPool);
    
    // Display password
    displayPassword(password);
}

// Generate a single password
function generatePassword(length, charPool) {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charPool[array[i] % charPool.length];
    }
    
    // Ensure at least one character from each selected type
    if (elements.uppercase.checked && !/[A-Z]/.test(password)) {
        const index = Math.floor(Math.random() * length);
        password = password.substring(0, index) + 
                  charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)] + 
                  password.substring(index + 1);
    }
    if (elements.lowercase.checked && !/[a-z]/.test(password)) {
        const index = Math.floor(Math.random() * length);
        password = password.substring(0, index) + 
                  charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)] + 
                  password.substring(index + 1);
    }
    if (elements.numbers.checked && !/[0-9]/.test(password)) {
        const index = Math.floor(Math.random() * length);
        password = password.substring(0, index) + 
                  charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)] + 
                  password.substring(index + 1);
    }
    if (elements.symbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        const index = Math.floor(Math.random() * length);
        const symbols = elements.excludeAmbiguous.checked 
            ? charSets.symbols.split('').filter(c => !ambiguousChars.includes(c)).join('')
            : charSets.symbols;
        password = password.substring(0, index) + 
                  symbols[Math.floor(Math.random() * symbols.length)] + 
                  password.substring(index + 1);
    }
    
    return password;
}

// Display generated password
function displayPassword(password) {
    elements.passwordsList.innerHTML = '';
    
    const item = document.createElement('div');
    item.className = 'password-item';
    item.innerHTML = `
        <div class="password-display" id="password-0">${password}</div>
        <button class="copy-btn" onclick="copyPassword(0)">
            <i class="fas fa-copy"></i> Copy
        </button>
    `;
    elements.passwordsList.appendChild(item);
}

// Copy password to clipboard (exposed globally for inline handlers)
window.copyPassword = function(index) {
    const passwordElement = document.getElementById(`password-${index}`);
    const password = passwordElement.textContent;
    
    navigator.clipboard.writeText(password).then(() => {
        showToast('Password copied to clipboard!');
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Password copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy password', 'error');
        }
        document.body.removeChild(textArea);
    });
}


// Show toast notification
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    if (type === 'error') {
        elements.toast.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E8E)';
    } else {
        elements.toast.style.background = 'linear-gradient(135deg, #4A90E2, #50E3C2)';
    }
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
        setTimeout(() => {
            elements.toast.style.background = '';
        }, 300);
    }, 3000);
}

// Initialize with custom preset (without notification)
applyPreset('custom', false);

// Auto-generate password on page load with default settings (length 16, all requirements)
// Since script is loaded at end of body, DOM is already ready
setTimeout(() => {
    // Generate initial password
    generatePasswords();
}, 100);

