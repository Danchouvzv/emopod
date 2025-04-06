const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Data directory setup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// User routes
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const userFile = path.join(DATA_DIR, `${username}.json`);

    if (fs.existsSync(userFile)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const userData = {
        username,
        password: require('bcryptjs').hashSync(password, 10),
        createdAt: new Date(),
        emotions: []
    };

    fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
    res.json({ message: 'Registration successful' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const userFile = path.join(DATA_DIR, `${username}.json`);

    if (!fs.existsSync(userFile)) {
        return res.status(400).json({ error: 'User not found' });
    }

    const userData = JSON.parse(fs.readFileSync(userFile));
    const validPassword = require('bcryptjs').compareSync(password, userData.password);

    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    req.session.user = { username };
    res.json({ message: 'Login successful' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

// Emotion tracking routes
app.post('/api/emotions', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { emotion, note } = req.body;
    const userFile = path.join(DATA_DIR, `${req.session.user.username}.json`);
    const userData = JSON.parse(fs.readFileSync(userFile));

    userData.emotions.push({
        emotion,
        note,
        timestamp: new Date()
    });

    fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
    res.json({ message: 'Emotion recorded' });
});

app.get('/api/emotions', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userFile = path.join(DATA_DIR, `${req.session.user.username}.json`);
    const userData = JSON.parse(fs.readFileSync(userFile));

    res.json(userData.emotions);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 