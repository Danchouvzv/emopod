require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const CHAT_HISTORY_FILE = path.join(__dirname, '../db/chatHistory.json');

const API_KEY = process.env.GEMINI_API_KEY;
console.log('Using API key:', API_KEY);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to read chat history
async function readChatHistory() {
    try {
        const data = await fs.readFile(CHAT_HISTORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty object
        if (error.code === 'ENOENT') {
            await fs.writeFile(CHAT_HISTORY_FILE, '{}');
            return {};
        }
        throw error;
    }
}

// Helper function to write chat history
async function writeChatHistory(history) {
    await fs.writeFile(CHAT_HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Send message to Gemini AI
const chatWithGemini = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);

        const { prompt } = req.body;
        const userId = req.user.id;

        console.log('Extracted prompt:', prompt);
        console.log('User ID:', userId);

        if (!prompt) {
            console.log('Prompt is missing from request body');
            return res.status(400).json({ message: 'Prompt is required' });
        }

        if (!API_KEY) {
            console.log('API key is missing');
            return res.status(500).json({ message: 'API key is not configured' });
        }

        console.log('Sending prompt to Gemini AI:', prompt);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Received response from Gemini:', text);

        // Save to chat history
        const chatHistory = await readChatHistory();
        if (!chatHistory[userId]) {
            chatHistory[userId] = [];
        }

        const messageEntry = {
            prompt,
            response: text,
            timestamp: new Date().toISOString()
        };

        chatHistory[userId].push(messageEntry);
        await writeChatHistory(chatHistory);

        console.log('Sending response to client:', {
            message: text,
            timestamp: messageEntry.timestamp
        });

        res.json({ 
            message: text,
            timestamp: messageEntry.timestamp
        });
    } catch (error) {
        console.error('Error in chatWithGemini:', error);
        res.status(500).json({ 
            message: 'Error processing chat message',
            error: error.message 
        });
    }
};

// Get chat history
const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const chatHistory = await readChatHistory();
        const userHistory = chatHistory[userId] || [];

        res.json({
            history: userHistory
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Error getting chat history' });
    }
};

// Create a new chat
const createChat = async (req, res) => {
    try {
        const { title } = req.body;
        const chat = new Chat({
            title,
            user: req.user.id
        });
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating chat' });
    }
};

// Get user's chat history
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching chats' });
    }
};

// Send a message in a chat
const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const message = new Message({
            chat: chatId,
            content,
            sender: req.user.id
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

module.exports = {
    chatWithGemini,
    getHistory,
    createChat,
    getChats,
    sendMessage
}; 