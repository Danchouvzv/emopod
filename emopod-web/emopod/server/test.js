const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAuth() {
    try {
        // Test registration
        console.log('Testing registration...');
        const registerResponse = await axios.post(`${API_URL}/auth/register`, {
            email: 'test17@example.com',
            password: 'password123'
        });
        console.log('Registration successful:', registerResponse.data);

        // Test login
        console.log('\nTesting login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'test17@example.com',
            password: 'password123'
        });
        console.log('Login successful:', loginResponse.data);

        const token = loginResponse.data.token;

        // Test get current user
        console.log('\nTesting get current user...');
        const meResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get current user successful:', meResponse.data);

        // Test chat message
        console.log('\nTesting chat message...');
        const chatResponse = await axios.post(
            `${API_URL}/chat/message`,
            { 
                prompt: "Привет, расскажи, зачем нужен EMOPOD?"
            },
            { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Chat message successful:', chatResponse.data);

        // Test get chat history
        console.log('\nTesting get chat history...');
        const historyResponse = await axios.get(`${API_URL}/chat/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get chat history successful:', historyResponse.data);

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testAuth(); 