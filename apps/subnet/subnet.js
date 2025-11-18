// Subnet Calculator
// DOM Elements - will be initialized on page load
let ipInput;
let calculateBtn;
let errorMessage;
let resultsSection;
let toast;
let toastMessage;
let subnetInput;
let cidrSelect;
let clearBtn;
let networkClassRadios;

// Convert IP address to integer
function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

// Convert integer to IP address
function intToIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

// Convert IP to binary string
function ipToBinary(ip) {
    const parts = ip.split('.').map(Number);
    return parts.map(part => part.toString(2).padStart(8, '0')).join('.');
}

// Validate IP address
function isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split('.').map(Number);
    return parts.every(part => part >= 0 && part <= 255);
}

// Validate CIDR notation
function isValidCIDR(cidr) {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    if (!cidrRegex.test(cidr)) return false;
    
    const [ip, prefix] = cidr.split('/');
    if (!isValidIP(ip)) return false;
    
    const prefixNum = parseInt(prefix, 10);
    return prefixNum >= 0 && prefixNum <= 32;
}

// Calculate subnet mask from CIDR prefix
function getSubnetMask(prefix) {
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    return intToIp(mask);
}

// Calculate network address
function getNetworkAddress(ip, prefix) {
    const ipInt = ipToInt(ip);
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const networkInt = (ipInt & mask) >>> 0;
    return intToIp(networkInt);
}

// Calculate broadcast address
function getBroadcastAddress(ip, prefix) {
    const ipInt = ipToInt(ip);
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const networkInt = (ipInt & mask) >>> 0;
    const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;
    return intToIp(broadcastInt);
}

// Calculate number of hosts
function getNumberOfHosts(prefix) {
    if (prefix === 32) {
        return 1; // Single host
    } else if (prefix === 31) {
        return 2; // Point-to-point, both addresses are usable
    }
    return Math.pow(2, 32 - prefix) - 2; // Subtract network and broadcast
}

// Calculate number of usable hosts
function getUsableHosts(prefix) {
    if (prefix === 32) {
        return 1; // Single host
    } else if (prefix === 31) {
        return 2; // Point-to-point, both addresses are usable
    }
    return Math.pow(2, 32 - prefix) - 2;
}

// Get first usable host
function getFirstHost(networkAddress, prefix) {
    if (prefix === 32) {
        return networkAddress; // Single host, network address is the host
    } else if (prefix === 31) {
        return networkAddress; // Point-to-point, network address is usable
    }
    const ipInt = ipToInt(networkAddress);
    const firstHostInt = (ipInt + 1) >>> 0;
    return intToIp(firstHostInt);
}

// Get last usable host
function getLastHost(broadcastAddress, prefix) {
    if (prefix === 32) {
        return broadcastAddress; // Single host, broadcast address is the host
    } else if (prefix === 31) {
        return broadcastAddress; // Point-to-point, broadcast address is usable
    }
    const ipInt = ipToInt(broadcastAddress);
    const lastHostInt = (ipInt - 1) >>> 0;
    return intToIp(lastHostInt);
}

// Format binary with network/host bits highlighted
function formatBinaryWithHighlight(ip, prefix) {
    const binary = ipToBinary(ip);
    const octets = binary.split('.');
    const binaryString = octets.join('');
    
    let result = '';
    for (let i = 0; i < 4; i++) {
        const start = i * 8;
        const end = start + 8;
        const octetBinary = binaryString.substring(start, end);
        
        // Determine if this octet is network or host
        const octetStart = i * 8;
        const octetEnd = (i + 1) * 8;
        
        if (octetEnd <= prefix) {
            // Entire octet is network
            result += `<span class="binary-octet network">${octetBinary}</span>`;
        } else if (octetStart >= prefix) {
            // Entire octet is host
            result += `<span class="binary-octet host">${octetBinary}</span>`;
        } else {
            // Octet is split between network and host
            const networkBits = prefix - octetStart;
            const hostBits = 8 - networkBits;
            const networkPart = octetBinary.substring(0, networkBits);
            const hostPart = octetBinary.substring(networkBits);
            result += `<span class="binary-octet network">${networkPart}</span><span class="binary-octet host">${hostPart}</span>`;
        }
        
        if (i < 3) {
            result += '<span style="color: var(--text-secondary); margin: 0 0.5rem;">.</span>';
        }
    }
    
    return result;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Copy to clipboard function
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy');
        }
        document.body.removeChild(textArea);
    }
}

// Create info item element with copy button
function createInfoItem(label, value, icon = 'fa-info-circle') {
    const item = document.createElement('div');
    item.className = 'info-item';
    
    item.innerHTML = `
        <div class="info-label">
            <i class="fas ${icon}"></i>
            <span>${label}</span>
        </div>
        <div class="info-value-wrapper">
            <div class="info-value">${value}</div>
            <button class="copy-btn" data-value="${value.replace(/"/g, '&quot;')}" title="Copy to clipboard">
                <i class="fas fa-copy"></i>
            </button>
        </div>
    `;
    
    // Add copy functionality
    const copyBtn = item.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        copyToClipboard(value);
    });
    
    return item;
}

// Create binary display item with copy button
function createBinaryItem(label, binaryHtml, binaryText, icon = 'fa-code') {
    const item = document.createElement('div');
    item.className = 'binary-item';
    
    item.innerHTML = `
        <div class="binary-label">
            <i class="fas ${icon}"></i>
            <span>${label}</span>
        </div>
        <div class="binary-value-wrapper">
            <div class="binary-value">${binaryHtml}</div>
            <button class="copy-btn" data-value="${binaryText.replace(/"/g, '&quot;')}" title="Copy to clipboard">
                <i class="fas fa-copy"></i>
            </button>
        </div>
    `;
    
    // Add copy functionality
    const copyBtn = item.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        copyToClipboard(binaryText);
    });
    
    return item;
}

// Calculate and display subnet information
function calculateSubnet(input) {
    try {
        // Parse input
        const [ip, prefixStr] = input.split('/');
        const prefix = parseInt(prefixStr, 10);
        
        if (!isValidIP(ip)) {
            throw new Error('Invalid IP address format');
        }
        
        if (prefix < 0 || prefix > 32) {
            throw new Error('CIDR prefix must be between 0 and 32');
        }
        
        // Calculate all values
        const subnetMask = getSubnetMask(prefix);
        const networkAddress = getNetworkAddress(ip, prefix);
        const broadcastAddress = getBroadcastAddress(ip, prefix);
        const numberOfHosts = getNumberOfHosts(prefix);
        const usableHosts = getUsableHosts(prefix);
        const firstHost = getFirstHost(networkAddress, prefix);
        const lastHost = getLastHost(broadcastAddress, prefix);
        
        // Display subnet information
        const subnetInfoGrid = document.getElementById('subnetInfoGrid');
        subnetInfoGrid.innerHTML = '';
        subnetInfoGrid.appendChild(createInfoItem('IP Address', ip, 'fa-network-wired'));
        subnetInfoGrid.appendChild(createInfoItem('CIDR Notation', `${ip}/${prefix}`, 'fa-hashtag'));
        subnetInfoGrid.appendChild(createInfoItem('Subnet Mask', subnetMask, 'fa-mask'));
        subnetInfoGrid.appendChild(createInfoItem('Prefix Length', `/${prefix}`, 'fa-ruler'));
        
        // Display network details
        const networkGrid = document.getElementById('networkGrid');
        networkGrid.innerHTML = '';
        networkGrid.appendChild(createInfoItem('Network Address', networkAddress, 'fa-network-wired'));
        networkGrid.appendChild(createInfoItem('Broadcast Address', broadcastAddress, 'fa-broadcast-tower'));
        networkGrid.appendChild(createInfoItem('Total Hosts', numberOfHosts.toLocaleString(), 'fa-server'));
        networkGrid.appendChild(createInfoItem('Usable Hosts', usableHosts.toLocaleString(), 'fa-desktop'));
        
        // Display address range
        const rangeGrid = document.getElementById('rangeGrid');
        rangeGrid.innerHTML = '';
        if (prefix === 32) {
            rangeGrid.appendChild(createInfoItem('Host Address', firstHost, 'fa-desktop'));
            rangeGrid.appendChild(createInfoItem('Note', 'Single host subnet (/32)', 'fa-info-circle'));
        } else if (prefix === 31) {
            rangeGrid.appendChild(createInfoItem('First Usable Host', firstHost, 'fa-arrow-down'));
            rangeGrid.appendChild(createInfoItem('Last Usable Host', lastHost, 'fa-arrow-up'));
            rangeGrid.appendChild(createInfoItem('Note', 'Point-to-point subnet (/31)', 'fa-info-circle'));
        } else {
            rangeGrid.appendChild(createInfoItem('First Usable Host', firstHost, 'fa-arrow-down'));
            rangeGrid.appendChild(createInfoItem('Last Usable Host', lastHost, 'fa-arrow-up'));
            rangeGrid.appendChild(createInfoItem('Host Range', `${firstHost} - ${lastHost}`, 'fa-list'));
        }
        
        // Display binary representation
        const binaryContainer = document.getElementById('binaryContainer');
        binaryContainer.innerHTML = '';
        binaryContainer.appendChild(createBinaryItem('IP Address (Binary)', formatBinaryWithHighlight(ip, prefix), ipToBinary(ip), 'fa-network-wired'));
        binaryContainer.appendChild(createBinaryItem('Subnet Mask (Binary)', formatBinaryWithHighlight(subnetMask, prefix), ipToBinary(subnetMask), 'fa-mask'));
        binaryContainer.appendChild(createBinaryItem('Network Address (Binary)', formatBinaryWithHighlight(networkAddress, prefix), ipToBinary(networkAddress), 'fa-network-wired'));
        binaryContainer.appendChild(createBinaryItem('Broadcast Address (Binary)', formatBinaryWithHighlight(broadcastAddress, prefix), ipToBinary(broadcastAddress), 'fa-broadcast-tower'));
        
        // Add legend for binary representation
        const legend = document.createElement('div');
        legend.className = 'binary-item';
        legend.innerHTML = `
            <div class="binary-label">
                <i class="fas fa-info-circle"></i>
                <span>Legend</span>
            </div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="binary-octet network">Network Bits</span>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Network portion</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="binary-octet host">Host Bits</span>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Host portion</span>
                </div>
            </div>
        `;
        binaryContainer.appendChild(legend);
        
        // Show results
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        showToast('Subnet calculated successfully!');
        
    } catch (error) {
        console.error('Error calculating subnet:', error);
        showError(error.message || 'An error occurred while calculating the subnet');
        resultsSection.style.display = 'none';
    }
}

// Network class CIDR ranges
const networkClassRanges = {
    any: { min: 1, max: 32 },
    a: { min: 8, max: 15 },
    b: { min: 16, max: 23 },
    c: { min: 24, max: 32 }
};

// Update subnet input when CIDR is selected
function updateSubnetInput() {
    const selectedCidr = cidrSelect.value;
    if (selectedCidr) {
        const subnetMask = getSubnetMask(parseInt(selectedCidr, 10));
        subnetInput.value = `${subnetMask} /${selectedCidr}`;
    }
}

// Filter CIDR options based on network class
function filterCIDROptions() {
    const selectedClass = document.querySelector('input[name="networkClass"]:checked').value;
    const range = networkClassRanges[selectedClass];
    
    const options = cidrSelect.querySelectorAll('option');
    options.forEach(option => {
        const value = parseInt(option.value, 10);
        if (value >= range.min && value <= range.max) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
    
    // If current selection is not in range, select the first available option
    const currentValue = parseInt(cidrSelect.value, 10);
    if (currentValue < range.min || currentValue > range.max) {
        const firstAvailable = Array.from(options).find(opt => {
            const val = parseInt(opt.value, 10);
            return val >= range.min && val <= range.max;
        });
        if (firstAvailable) {
            cidrSelect.value = firstAvailable.value;
            updateSubnetInput();
        }
    }
}

// Initialize
window.addEventListener('load', () => {
    // Initialize DOM elements
    ipInput = document.getElementById('ipInput');
    calculateBtn = document.getElementById('calculateBtn');
    errorMessage = document.getElementById('errorMessage');
    resultsSection = document.getElementById('resultsSection');
    toast = document.getElementById('toast');
    toastMessage = document.getElementById('toastMessage');
    subnetInput = document.getElementById('subnetInput');
    cidrSelect = document.getElementById('cidrSelect');
    clearBtn = document.getElementById('clearBtn');
    networkClassRadios = document.querySelectorAll('input[name="networkClass"]');
    
    // Clear any initial data
    resultsSection.style.display = 'none';
    
    // Initialize subnet input
    updateSubnetInput();
    
    // Filter CIDR options based on default network class
    filterCIDROptions();
    
    // Event Listeners
    cidrSelect.addEventListener('change', () => {
        updateSubnetInput();
    });

    networkClassRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            filterCIDROptions();
            updateSubnetInput();
        });
    });

    calculateBtn.addEventListener('click', () => {
        const ip = ipInput.value.trim();
        const cidr = cidrSelect.value;
        
        if (!ip) {
            showError('Please enter an IP address');
            return;
        }
        
        if (!isValidIP(ip)) {
            showError('Invalid IP address format');
            return;
        }
        
        if (!cidr) {
            showError('Please select a CIDR prefix');
            return;
        }
        
        const input = `${ip}/${cidr}`;
        hideError();
        calculateSubnet(input);
    });

    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });

    clearBtn.addEventListener('click', () => {
        ipInput.value = '';
        cidrSelect.value = '24';
        document.getElementById('classAny').checked = true;
        filterCIDROptions();
        updateSubnetInput();
        resultsSection.style.display = 'none';
        hideError();
        showToast('Fields cleared');
    });
});

