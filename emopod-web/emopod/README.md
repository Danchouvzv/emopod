# EMOPOD - Emotional AI Assistant

EMOPOD is an AI-powered emotional wellness assistant that helps users manage their emotions and mental well-being through natural conversations.

## Features

- User authentication (registration and login)
- Real-time chat with AI assistant
- Chat history management
- Emotion tracking and analysis
- Secure data storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/emopod.git
cd emopod
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/emopod
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

4. Start MongoDB:
```bash
mongod
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
emopod/
├── client/              # Frontend code
│   ├── public/         # Static files
│   └── css/           # Stylesheets
├── server/             # Backend code
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── server.js      # Main server file
├── .env               # Environment variables
├── .gitignore         # Git ignore file
└── package.json       # Project dependencies
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Chat
- POST /api/chat/create - Create a new chat
- GET /api/chat/history - Get chat history
- POST /api/chat/message - Send a message

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 