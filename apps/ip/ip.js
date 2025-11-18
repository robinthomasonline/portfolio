// IP Address Locator using IPAPI
const API_BASE = 'https://ipapi.co';
// CORS proxy as fallback (using a public CORS proxy)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// DOM Elements
const ipInput = document.getElementById('ipInput');
const lookupBtn = document.getElementById('lookupBtn');
const myIpBtn = document.getElementById('myIpBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingCard = document.getElementById('loadingCard');
const resultsSection = document.getElementById('resultsSection');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Field mappings for organized display
const fieldMappings = {
    ipInfo: {
        ip: { label: 'IP Address', icon: 'fa-network-wired' },
        version: { label: 'IP Version', icon: 'fa-code' }
    },
    location: {
        city: { label: 'City', icon: 'fa-city' },
        region: { label: 'Region', icon: 'fa-map' },
        region_code: { label: 'Region Code', icon: 'fa-hashtag' },
        postal: { label: 'Postal Code', icon: 'fa-envelope' },
        latitude: { label: 'Latitude', icon: 'fa-map-pin' },
        longitude: { label: 'Longitude', icon: 'fa-map-pin' }
    },
    network: {
        asn: { label: 'ASN', icon: 'fa-network-wired' },
        org: { label: 'Organization', icon: 'fa-building' }
    },
    country: {
        country_name: { label: 'Country', icon: 'fa-flag' },
        country: { label: 'Country', icon: 'fa-flag' }, // Fallback
        country_code: { label: 'Country Code', icon: 'fa-globe' },
        country_code_iso3: { label: 'ISO3 Code', icon: 'fa-globe' },
        country_capital: { label: 'Capital', icon: 'fa-building' },
        country_tld: { label: 'TLD', icon: 'fa-link' },
        continent_code: { label: 'Continent', icon: 'fa-globe-americas' },
        in_eu: { label: 'In EU', icon: 'fa-euro-sign' },
        country_calling_code: { label: 'Calling Code', icon: 'fa-phone' },
        country_area: { label: 'Area (km²)', icon: 'fa-ruler-combined' },
        country_population: { label: 'Population', icon: 'fa-users' },
        languages: { label: 'Languages', icon: 'fa-language' }
    },
    timezone: {
        timezone: { label: 'Timezone', icon: 'fa-clock' },
        utc_offset: { label: 'UTC Offset', icon: 'fa-clock' },
        currency: { label: 'Currency', icon: 'fa-dollar-sign' },
        currency_name: { label: 'Currency Name', icon: 'fa-coins' }
    }
};

// Validate IP address
function isValidIP(ip) {
    if (!ip) return true; // Empty is valid (will use user's IP)
    
    // IPv4 regex
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 regex (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    
    if (ipv4Regex.test(ip)) {
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    }
    
    return ipv6Regex.test(ip);
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

// Clear all displayed data
function clearAllData() {
    const ipInfoGrid = document.getElementById('ipInfoGrid');
    const locationGrid = document.getElementById('locationGrid');
    const networkGrid = document.getElementById('networkGrid');
    const countryGrid = document.getElementById('countryGrid');
    const timezoneGrid = document.getElementById('timezoneGrid');
    
    if (ipInfoGrid) ipInfoGrid.innerHTML = '';
    if (locationGrid) locationGrid.innerHTML = '';
    if (networkGrid) networkGrid.innerHTML = '';
    if (countryGrid) countryGrid.innerHTML = '';
    if (timezoneGrid) timezoneGrid.innerHTML = '';
    
    // Clear map
    const mapFrame = document.getElementById('mapFrame');
    if (mapFrame) {
        mapFrame.src = '';
    }
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.style.display = 'none';
    }
}

// Show loading state
function showLoading() {
    loadingCard.style.display = 'block';
    resultsSection.style.display = 'none';
    hideError();
    
    // Disable buttons during loading
    lookupBtn.disabled = true;
    myIpBtn.disabled = true;
    lookupBtn.style.opacity = '0.6';
    myIpBtn.style.opacity = '0.6';
    lookupBtn.style.cursor = 'not-allowed';
    myIpBtn.style.cursor = 'not-allowed';
    
    // Clear all previous data
    clearAllData();
}

// Hide loading state
function hideLoading() {
    loadingCard.style.display = 'none';
    
    // Re-enable buttons
    lookupBtn.disabled = false;
    myIpBtn.disabled = false;
    lookupBtn.style.opacity = '1';
    myIpBtn.style.opacity = '1';
    lookupBtn.style.cursor = 'pointer';
    myIpBtn.style.cursor = 'pointer';
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format value for display
function formatValue(key, value) {
    if (value === null || value === undefined || value === '') {
        return { value: 'N/A', isEmpty: true };
    }
    
    // Format boolean values
    if (typeof value === 'boolean') {
        return { value: value ? 'Yes' : 'No', isEmpty: false };
    }
    
    // Format numbers with commas
    if (typeof value === 'number') {
        if (key === 'latitude' || key === 'longitude') {
            return { value: value.toFixed(6), isEmpty: false };
        }
        if (key === 'country_area' || key === 'country_population') {
            return { value: value.toLocaleString(), isEmpty: false };
        }
        return { value: value.toString(), isEmpty: false };
    }
    
    // Format arrays (like languages)
    if (Array.isArray(value)) {
        return { value: value.join(', '), isEmpty: value.length === 0 };
    }
    
    return { value: value.toString(), isEmpty: false };
}

// Create info item element
function createInfoItem(key, config, value) {
    const item = document.createElement('div');
    item.className = 'info-item';
    
    const formatted = formatValue(key, value);
    
    item.innerHTML = `
        <div class="info-label">
            <i class="fas ${config.icon}"></i>
            <span>${config.label}</span>
        </div>
        <div class="info-value ${formatted.isEmpty ? 'empty' : ''}">${formatted.value}</div>
    `;
    
    return item;
}

// Display IP information
function displayIPInfo(data) {
    const ipInfoGrid = document.getElementById('ipInfoGrid');
    ipInfoGrid.innerHTML = '';
    
    // Add IP address
    if (data.ip) {
        const ipItem = createInfoItem('ip', fieldMappings.ipInfo.ip, data.ip);
        ipInfoGrid.appendChild(ipItem);
    }
    
    // Add IP version if available
    if (data.version) {
        const versionItem = createInfoItem('version', fieldMappings.ipInfo.version, data.version);
        ipInfoGrid.appendChild(versionItem);
    }
}

// Display location information
function displayLocationInfo(data) {
    const locationGrid = document.getElementById('locationGrid');
    locationGrid.innerHTML = '';
    
    Object.keys(fieldMappings.location).forEach(key => {
        if (data[key] !== undefined) {
            const item = createInfoItem(key, fieldMappings.location[key], data[key]);
            locationGrid.appendChild(item);
        }
    });
}

// Display network information
function displayNetworkInfo(data) {
    const networkGrid = document.getElementById('networkGrid');
    networkGrid.innerHTML = '';
    
    Object.keys(fieldMappings.network).forEach(key => {
        if (data[key] !== undefined) {
            const item = createInfoItem(key, fieldMappings.network[key], data[key]);
            networkGrid.appendChild(item);
        }
    });
}

// Display country information
function displayCountryInfo(data) {
    const countryGrid = document.getElementById('countryGrid');
    countryGrid.innerHTML = '';
    
    // Handle country_name or country field
    const countryFields = Object.keys(fieldMappings.country);
    const displayedFields = new Set();
    
    countryFields.forEach(key => {
        if (data[key] !== undefined && !displayedFields.has(key)) {
            // Skip 'country' if 'country_name' exists
            if (key === 'country' && data.country_name) {
                return;
            }
            const item = createInfoItem(key, fieldMappings.country[key], data[key]);
            countryGrid.appendChild(item);
            displayedFields.add(key);
        }
    });
}

// Display timezone and currency information
function displayTimezoneInfo(data) {
    const timezoneGrid = document.getElementById('timezoneGrid');
    timezoneGrid.innerHTML = '';
    
    Object.keys(fieldMappings.timezone).forEach(key => {
        if (data[key] !== undefined) {
            const item = createInfoItem(key, fieldMappings.timezone[key], data[key]);
            timezoneGrid.appendChild(item);
        }
    });
}

// Display map
function displayMap(latitude, longitude) {
    const mapContainer = document.getElementById('mapContainer');
    const mapFrame = document.getElementById('mapFrame');
    
    if (latitude && longitude) {
        // Use OpenStreetMap for free, no API key required
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(longitude)-0.1},${parseFloat(latitude)-0.1},${parseFloat(longitude)+0.1},${parseFloat(latitude)+0.1}&layer=mapnik&marker=${latitude},${longitude}`;
        mapFrame.src = mapUrl;
        mapContainer.style.display = 'block';
    } else {
        mapContainer.style.display = 'none';
    }
}

// Fetch IP information from IPAPI with fallback
async function fetchIPInfo(ip = '', useProxy = false) {
    try {
        showLoading();
        
        // Build API URL
        let url = ip ? `${API_BASE}/${ip}/json/` : `${API_BASE}/json/`;
        
        // Use CORS proxy if needed
        if (useProxy) {
            url = CORS_PROXY + encodeURIComponent(url);
        }
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        
        // If using proxy, the response might be wrapped
        if (useProxy && typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error('Invalid response format');
            }
        }
        
        // Check for API errors
        if (data.error) {
            throw new Error(data.reason || data.error || 'Failed to fetch IP information');
        }
        
        // Log the response for debugging (remove in production if needed)
        console.log('IPAPI Response:', data);
        
        // Display all information
        displayIPInfo(data);
        displayLocationInfo(data);
        displayNetworkInfo(data);
        displayCountryInfo(data);
        displayTimezoneInfo(data);
        
        // Display map if coordinates are available
        if (data.latitude && data.longitude) {
            displayMap(data.latitude, data.longitude);
        }
        
        // Show results
        hideLoading();
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        showToast('IP information loaded successfully!');
        return data; // Return data on success
        
    } catch (error) {
        console.error('Error fetching IP info:', error);
        
        // If first attempt failed and we haven't tried proxy, retry with proxy
        if (!useProxy && (error.name === 'TypeError' || error.message.includes('fetch'))) {
            console.log('Retrying with CORS proxy...');
            return fetchIPInfo(ip, true);
        }
        
        hideLoading();
        
        // Provide more specific error messages
        let errorMsg = 'Failed to fetch IP information. ';
        
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
            errorMsg += 'Request timed out. Please check your internet connection and try again.';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMsg += 'Network error or CORS issue. Please try again or check your browser settings.';
        } else if (error.message.includes('HTTP error')) {
            errorMsg += `Server returned error: ${error.message}`;
        } else {
            errorMsg += error.message || 'Please try again.';
        }
        
        showError(errorMsg);
        throw error; // Re-throw to allow .catch() to handle it
    }
}

// Event Listeners
lookupBtn.addEventListener('click', () => {
    const ip = ipInput.value.trim();
    
    if (ip && !isValidIP(ip)) {
        showError('Please enter a valid IP address');
        return;
    }
    
    fetchIPInfo(ip);
});

myIpBtn.addEventListener('click', async () => {
    try {
        // Clear the input field
        ipInput.value = '';
        const originalPlaceholder = ipInput.placeholder;
        ipInput.placeholder = 'Fetching your IP address...';
        
        // Fetch user's IP (empty string means use current IP)
        await fetchIPInfo('');
        
        // Reset placeholder after successful fetch
        ipInput.placeholder = originalPlaceholder;
    } catch (error) {
        // Reset placeholder on error
        ipInput.placeholder = 'Enter IP address (e.g., 8.8.8.8) or leave empty for your IP';
        console.error('Error in Use My IP:', error);
    }
});

ipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        lookupBtn.click();
    }
});

// Initialize - don't auto-fetch on load
window.addEventListener('load', () => {
    // Clear any initial data
    clearAllData();
    // Don't auto-fetch - user must click a button
});

