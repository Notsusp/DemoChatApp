// Simple in-memory storage for demo purposes
// In production, this would be replaced with MongoDB

class MemoryStorage {
  constructor() {
    this.users = new Map();
    this.messages = [];
    this.connectedUsers = new Map();
  }

  // User operations
  async createUser(userData) {
    const user = {
      _id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date()
    };

    this.users.set(user._id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async updateUserOnlineStatus(userId, isOnline) {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.users.set(userId, user);
    }
  }

  async getAllUsers() {
    return Array.from(this.users.values()).map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen
    }));
  }

  // Message operations
  async saveMessage(messageData) {
    const message = {
      _id: Date.now().toString(),
      user: messageData.user,
      text: messageData.text,
      timestamp: new Date()
    };

    this.messages.push(message);
    // Keep only last 100 messages for demo
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }

    return message;
  }

  async getRecentMessages(limit = 50) {
    return this.messages.slice(-limit);
  }
}

module.exports = new MemoryStorage();
