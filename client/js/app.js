// Auth functions
async function register(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('Registration successful! Please login.', 'success');
            setTimeout(() => window.location.href = '/login.html', 2000);
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/dashboard.html';
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login.html';
    } catch (error) {
        showMessage('An error occurred during logout.', 'error');
    }
}

// Emotion tracking functions
async function recordEmotion(event) {
    event.preventDefault();
    const emotion = document.getElementById('emotion').value;
    const note = document.getElementById('note').value;

    try {
        const response = await fetch('/api/emotions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emotion, note })
        });

        const data = await response.json();
        
        if (response.ok) {
            showMessage('Emotion recorded successfully!', 'success');
            document.getElementById('emotion-form').reset();
            loadEmotions();
        } else {
            showMessage(data.error, 'error');
        }
    } catch (error) {
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function loadEmotions() {
    try {
        const response = await fetch('/api/emotions');
        const emotions = await response.json();
        
        if (response.ok) {
            displayEmotions(emotions);
        } else {
            showMessage('Failed to load emotions.', 'error');
        }
    } catch (error) {
        showMessage('An error occurred while loading emotions.', 'error');
    }
}

function displayEmotions(emotions) {
    const container = document.getElementById('emotions-list');
    container.innerHTML = '';

    emotions.reverse().forEach(entry => {
        const date = new Date(entry.timestamp).toLocaleString();
        const card = document.createElement('div');
        card.className = 'emotion-card';
        card.innerHTML = `
            <h3>${entry.emotion}</h3>
            <p>${entry.note}</p>
            <small>${date}</small>
        `;
        container.appendChild(card);
    });
}

// Utility functions
function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Initialize dashboard if on dashboard page
if (window.location.pathname === '/dashboard.html') {
    loadEmotions();
} 