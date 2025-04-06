// Constants
const API_URL = 'http://localhost:3000/api';

// Router
function handleRoute() {
    const path = window.location.pathname;
    
    if (path.includes('/login')) {
        handleLoginPage();
    } else if (path.includes('/register')) {
        handleRegisterPage();
    } else if (path.includes('/chat')) {
        handleChatPage();
    } else {
        // Redirect to login if no valid route
        window.location.href = '/login';
    }
}

// Auth functions
async function register(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/chat';
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error during registration');
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/chat';
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error during login');
    }
}

// Chat functions
async function sendMessage(prompt) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/chat/message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            showError(data.message);
            return null;
        }
    } catch (error) {
        showError('Error sending message');
        return null;
    }
}

async function getChatHistory() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/chat/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            return data.history;
        } else {
            showError(data.message);
            return [];
        }
    } catch (error) {
        showError('Error getting chat history');
        return [];
    }
}

// UI functions
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

function typeText(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Page handlers
function handleLoginPage() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('[name="email"]').value;
            const password = form.querySelector('[name="password"]').value;
            login(email, password);
        });
    }
}

function handleRegisterPage() {
    const form = document.getElementById('register-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('[name="email"]').value;
            const password = form.querySelector('[name="password"]').value;
            register(email, password);
        });
    }
}

function handleChatPage() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const form = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    const historyButton = document.getElementById('show-history');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prompt = messageInput.value.trim();
            if (!prompt) return;

            // Add user message to chat
            const userMessage = document.createElement('div');
            userMessage.className = 'bg-blue-100 p-4 rounded-lg mb-4';
            userMessage.textContent = prompt;
            chatContainer.appendChild(userMessage);

            // Clear input
            messageInput.value = '';

            // Add loading indicator
            const loading = document.createElement('div');
            loading.className = 'bg-gray-100 p-4 rounded-lg mb-4';
            loading.textContent = 'EMOPOD печатает...';
            chatContainer.appendChild(loading);

            // Get response
            const response = await sendMessage(prompt);
            
            // Remove loading
            chatContainer.removeChild(loading);

            if (response) {
                // Add AI response with typing effect
                const aiMessage = document.createElement('div');
                aiMessage.className = 'bg-gray-100 p-4 rounded-lg mb-4';
                chatContainer.appendChild(aiMessage);
                typeText(aiMessage, response.message);
            }
        });
    }

    if (historyButton) {
        historyButton.addEventListener('click', async () => {
            const history = await getChatHistory();
            if (history.length > 0) {
                chatContainer.innerHTML = '';
                history.forEach(entry => {
                    const userMessage = document.createElement('div');
                    userMessage.className = 'bg-blue-100 p-4 rounded-lg mb-4';
                    userMessage.textContent = entry.prompt;
                    chatContainer.appendChild(userMessage);

                    const aiMessage = document.createElement('div');
                    aiMessage.className = 'bg-gray-100 p-4 rounded-lg mb-4';
                    aiMessage.textContent = entry.response;
                    chatContainer.appendChild(aiMessage);
                });
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', handleRoute);

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and contents
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding content
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const typingText = answer.querySelector('.typing-text');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                // Reset and restart typing animation
                typingText.style.animation = 'none';
                void typingText.offsetWidth; // Trigger reflow
                typingText.style.animation = 'typing 3s steps(40, end)';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    document.querySelectorAll('.content-card, .review-card, .feature, .faq-item').forEach(el => {
        observer.observe(el);
    });

    // Add animation classes
    const addAnimationClasses = () => {
        document.querySelectorAll('.content-card, .review-card, .feature, .faq-item').forEach(el => {
            el.classList.add('fade-in');
        });
    };

    // Initial animation
    addAnimationClasses();
}); 