# 💬 Real-Time Chat Application

A modern, full-stack real-time chat application built with cutting-edge web technologies. Connect instantly with friends, colleagues, or team members through our intuitive chat interface featuring private messaging, real-time updates, and seamless user experience.

## 🌟 Introduction

This chat application provides a complete communication platform with user authentication, real-time messaging, and online presence indicators. Whether you're building a team collaboration tool, a social platform, or just want to learn real-time web development, this project serves as an excellent foundation.

**✨ Key Highlights:**
- ⚡ **Instant Communication** - Real-time messaging with Socket.io
- 🔒 **Secure Authentication** - JWT-based user management with bcrypt password hashing
- 👥 **Smart User Management** - Online status tracking and user presence
- 💬 **Private & Public Chat** - Support for both private conversations and group chat
- 📱 **Responsive Design** - Beautiful interface that works on all devices
- 🚀 **Production Ready** - Choose between MongoDB or in-memory storage

## 🎯 Possible Uses

### 🏢 **Team Collaboration**
- Internal company communication platform
- Project team coordination
- Remote team chat rooms

### 👥 **Social Platform**
- Community chat rooms
- Interest-based group conversations
- Social networking features

### 🎓 **Learning & Development**
- Real-time web development example
- Full-stack JavaScript/TypeScript project
- Socket.io implementation reference

### 🛠️ **Custom Solutions**
- Customer support chat widget
- Event-based communication (conferences, webinars)
- Gaming clan/team communication

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login with bcrypt password hashing
- 💬 **Real-time Messaging** - Instant message delivery with Socket.io
- 👥 **Online Users** - Live user presence and status indicators
- 🔒 **Private Messaging** - One-on-one conversations with visual indicators
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 💾 **Flexible Storage** - MongoDB for production, in-memory for development
- 📚 **Message History** - View recent conversations on connection
- 🚀 **Demo Mode** - Instant testing with pre-configured demo accounts

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript for type safety
- **Tailwind CSS** for responsive, utility-first styling
- **Socket.io-client** for real-time communication
- **React Router** for seamless navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express for robust server-side logic
- **Socket.io** for bidirectional real-time communication
- **JWT** for secure authentication
- **bcrypt** for password security
- **Hybrid Storage** - MongoDB or in-memory options

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### 1. Get the Code
```bash
# Clone the repository
git clone https://github.com/Notsusp/DemoChatApp.git
cd "Proiect - Online Chat App"
```

### 2. Start the Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
```

### 3. Start the Frontend
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm start
```

### 4. Test the Application
🎉 **You're all set!** Open http://localhost:3000 in your browser and:

- Click **"Login as User 1"** or **"Login as User 2"** for instant demo
- Register a new account for full access
- Open multiple browser tabs to test real-time messaging
- Try private messaging by clicking on other users

## 🎭 Demo Accounts

For instant testing, use these demo login buttons on the frontend:

| Account | Email | Password | Purpose |
|---------|-------|----------|---------|
| **User 1** | `user1@example.com` | `demo-password` | Primary demo account |
| **User 2** | `user2@example.com` | `demo-password` | Secondary demo account |

## 📁 Project Structure

```
Proiect - Online Chat App/
├── 📂 backend/                 # Node.js/Express server
│   ├── 📂 models/             # Data models & storage logic
│   │   ├── MemoryStorage.js   # Hybrid storage (MongoDB + in-memory)
│   │   ├── User.js           # User schema (MongoDB)
│   │   └── Message.js        # Message schema (MongoDB)
│   ├── 📂 routes/            # API route handlers
│   │   ├── auth.js           # Authentication endpoints
│   │   └── users.js          # User management endpoints
│   ├── 📂 socket/            # Real-time communication
│   │   └── socketHandlers.js # Socket.io event handlers
│   ├── 📂 middleware/        # Custom middleware
│   │   └── auth.js           # JWT authentication middleware
│   ├── .env                  # Environment configuration
│   └── index.js              # Main server entry point
└── 📂 frontend/              # React TypeScript application
    ├── 📂 src/
    │   ├── 📂 components/    # React components
    │   │   ├── Login.tsx     # Authentication forms
    │   │   ├── Register.tsx  # User registration
    │   │   └── Chat.tsx      # Main chat interface
    │   ├── App.tsx           # Application router
    │   └── index.tsx         # React application entry
    └── package.json
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp  # Optional for demo
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

> **💡 Note:** MongoDB is optional for demo/development. The application uses intelligent hybrid storage that automatically falls back to in-memory storage when MongoDB is unavailable.

## 🚀 Deployment Options

### Option 1: Production (MongoDB)
1. Set up MongoDB (local or cloud service like MongoDB Atlas)
2. Update `.env` with your MongoDB connection string
3. Deploy backend to cloud platforms (Heroku, Railway, DigitalOcean)
4. Deploy frontend to static hosting (Netlify, Vercel)

### Option 2: Development/Demo (In-Memory)
- No database setup required
- Perfect for testing and demonstrations
- Data persists only while server is running
- Zero configuration needed

## 📖 API Reference

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - End user session

### User Management
- `GET /api/users` - Retrieve all users (authenticated)
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get specific user details

### Real-time Events (Socket.io)

**Client → Server:**
- `join` - Authenticate and join chat
- `sendMessage` - Send chat message
- `typing` - Indicate typing status

**Server → Client:**
- `currentUser` - Current user information
- `users` - Updated user list
- `message` - New message received
- `messageHistory` - Recent messages on connection

## 🔒 Private Messaging

The application supports both public and private messaging:

- **Public Messages**: Sent to all connected users
- **Private Messages**: One-on-one conversations with specific users
- **Visual Indicators**: Private messages display "(private to username)" in the interface
- **Message History**: Private conversations are preserved in message history

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-enhancement`
3. **Make** your changes with clear commit messages
4. **Test** thoroughly across different scenarios
5. **Submit** a pull request with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Add tests for new features
- Update documentation for API changes

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with ❤️ using:
- **Socket.io** for real-time communication
- **React & TypeScript** for the user interface
- **Express.js** for the backend API
- **Tailwind CSS** for styling
- **JWT** for authentication

---
