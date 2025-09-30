# 💬 Real-Time Chat Application

A full-stack real-time chat application built with **React**, **TypeScript**, **Node.js**, **Express**, and **Socket.io**. Features user authentication, real-time messaging, and online user presence.

## ✨ Features

- 🔐 **User Authentication** - JWT-based login and registration
- 💬 **Real-time Messaging** - Instant message delivery with Socket.io
- 👥 **Online Users** - See who's currently online
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean, modern interface with Tailwind CSS
- 💾 **Message History** - View recent messages on connection
- 🚀 **Demo Mode** - Quick testing with demo accounts

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Socket.io-client** for real-time communication
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Socket.io** for real-time features
- **JWT** for authentication
- **In-memory storage** (demo-ready)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <this-repo-url>
cd Proiect - Online Chat App
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend will run on `http://localhost:3000`

### 4. Test the Application
- Click "Login as User 1" or "Login as User 2" for demo
- Or register a new account
- Open multiple tabs to test real-time messaging!

## 📁 Project Structure

```
Proiect - Online Chat App/
├── backend/                 # Node.js/Express server
│   ├── models/             # Data models
│   │   ├── MemoryStorage.js # In-memory storage (demo)
│   │   ├── User.js        # User model (MongoDB ready)
│   │   └── Message.js     # Message model (MongoDB ready)
│   ├── routes/             # API routes
│   │   ├── auth.js        # Authentication endpoints
│   │   └── users.js       # User management
│   ├── socket/             # Real-time handlers
│   │   └── socketHandlers.js
│   ├── middleware/         # JWT middleware
│   │   └── auth.js
│   ├── .env               # Environment variables
│   └── index.js           # Main server file
└── frontend/               # React application
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Login.tsx  # Login form
    │   │   ├── Register.tsx # Registration form
    │   │   └── Chat.tsx   # Main chat interface
    │   ├── App.tsx        # Main React app
    │   └── index.tsx      # React entry point
    └── package.json
```

## 🔧 Configuration

### Environment Variables (Backend)
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

For demo purposes, MongoDB is optional - the app uses in-memory storage by default.

## 🚀 Deployment

### Option 1: MongoDB (Production)
1. Install and setup MongoDB
2. Update `.env` with your MongoDB connection string
3. Uncomment MongoDB models in the code
4. Deploy backend to services like Heroku, Railway, or DigitalOcean

### Option 2: In-Memory (Demo/Development)
- No database required
- Data persists only while server is running
- Perfect for testing and demos

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID

## 🔌 Socket Events

### Client → Server
- `join` - Join chat with authentication token
- `sendMessage` - Send a message
- `typing` - User is typing (optional)
- `stopTyping` - User stopped typing (optional)

### Server → Client
- `currentUser` - Current user info
- `users` - List of all users
- `message` - New message received
- `messageHistory` - Recent messages on join

## 🎯 Demo Accounts

For quick testing, use these demo login buttons:
- **User 1**: `user1@example.com`
- **User 2**: `user2@example.com`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web technologies
- Socket.io for real-time communication
- React for the user interface
- Express for the backend API

---

**Made with ❤️ for real-time communication**
