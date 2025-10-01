// Hybrid storage - uses MongoDB when available, falls back to in-memory storage
// This provides persistence when MongoDB is running, graceful degradation when not

const User = require('./User');
const Message = require('./Message');

class MemoryStorage {
  constructor() {
    this.users = new Map(); // Fallback in-memory storage
    this.messages = []; // Fallback in-memory storage
    this.useMongoDB = false;
    this.MongoMemoryServer = null;
    this.initialized = false;

    // Initialize synchronously first
    this.initializeSync();
  }

  initializeSync() {
    // Set a flag to indicate we're initializing
    this.initializing = true;

    // Try to initialize storage (but don't wait for it)
    this.initializeStorage().then(() => {
      this.initialized = true;
      this.initializing = false;
      console.log('✅ Storage initialization completed');
    }).catch((error) => {
      console.error('❌ Storage initialization failed:', error);
      this.initialized = true;
      this.initializing = false;
      this.useMongoDB = false;
    });
  }

  async initializeStorage() {
    try {
      // First try to connect to existing MongoDB
      console.log('🔍 Checking for existing MongoDB connection...');
      await User.findOne({});
      this.useMongoDB = true;
      console.log('✅ MongoDB connected - using persistent storage');
    } catch (error) {
      console.log('📝 MongoDB not available, trying memory server...');
      try {
        console.log('🚀 Starting in-memory MongoDB server...');
        // Try to start in-memory MongoDB server for testing
        const { MongoMemoryServer } = require('mongodb-memory-server');
        this.MongoMemoryServer = await MongoMemoryServer.create({
          instance: {
            port: 0, // Use random available port
            dbName: 'chatapp_test'
          }
        });
        const mongoUri = this.MongoMemoryServer.getUri();

        console.log('🔗 Connecting to in-memory MongoDB...');
        // Update mongoose connection to use memory server
        const mongoose = require('mongoose');
        await mongoose.connect(mongoUri);
        await mongoose.connection.db.admin().command({ ping: 1 });

        this.useMongoDB = true;
        console.log('✅ In-memory MongoDB server started - using persistent storage');
      } catch (memError) {
        console.log('❌ Failed to start MongoDB memory server:', memError.message);
        console.log('💾 MongoDB not available - using in-memory storage only');
        console.log('💡 To enable persistence: 1) Install MongoDB locally, or 2) Use MongoDB Atlas');
        this.useMongoDB = false;
      }
    }
  }

  // Helper method to ensure initialization is complete
  async ensureInitialized() {
    if (!this.initialized) {
      console.log('⏳ Waiting for storage initialization...');
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // User operations
  async createUser(userData) {
    await this.ensureInitialized();

    if (this.useMongoDB) {
      try {
        // Check if user already exists by email
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
          return existingUser;
        }

        const user = new User({
          username: userData.username,
          email: userData.email,
          password: userData.password || 'demo-password',
          isOnline: false,
          lastSeen: new Date()
        });

        const savedUser = await user.save();
        return savedUser;
      } catch (error) {
        console.error('Error creating user in MongoDB:', error);
        throw error;
      }
    } else {
      // Fallback to in-memory storage
      return this.createUserInMemory(userData);
    }
  }

  async createUserInMemory(userData) {
    // Check if user already exists by email
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      return existingUser;
    }

    const user = {
      _id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password || 'demo-password',
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date()
    };

    this.users.set(user._id, user);
    return user;
  }

  async findUserByEmail(email) {
    await this.ensureInitialized();

    if (this.useMongoDB) {
      try {
        return await User.findOne({ email });
      } catch (error) {
        console.error('Error finding user by email in MongoDB:', error);
        return null;
      }
    } else {
      // Fallback to in-memory storage
      for (const user of this.users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    }
  }

  async findUserByUsername(username) {
    if (this.useMongoDB) {
      try {
        return await User.findOne({ username });
      } catch (error) {
        console.error('Error finding user by username in MongoDB:', error);
        return null;
      }
    } else {
      // Fallback to in-memory storage
      for (const user of this.users.values()) {
        if (user.username === username) {
          return user;
        }
      }
      return null;
    }
  }

  async findUserById(id) {
    if (this.useMongoDB) {
      try {
        return await User.findById(id);
      } catch (error) {
        console.error('Error finding user by ID in MongoDB:', error);
        return null;
      }
    } else {
      // Fallback to in-memory storage
      return this.users.get(id) || null;
    }
  }

  async updateUserOnlineStatus(userId, isOnline) {
    if (this.useMongoDB) {
      try {
        return await User.findByIdAndUpdate(
          userId,
          {
            isOnline,
            lastSeen: new Date()
          },
          { new: true }
        );
      } catch (error) {
        console.error('Error updating user online status in MongoDB:', error);
        return null;
      }
    } else {
      // Fallback to in-memory storage
      const user = this.users.get(userId);
      if (user) {
        user.isOnline = isOnline;
        user.lastSeen = new Date();
        this.users.set(userId, user);
        return user;
      }
      return null;
    }
  }

  async getAllUsers() {
    if (this.useMongoDB) {
      try {
        return await User.find({}, 'username email isOnline lastSeen');
      } catch (error) {
        console.error('Error getting all users from MongoDB:', error);
        return [];
      }
    } else {
      // Fallback to in-memory storage
      return Array.from(this.users.values()).map(user => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen
      }));
    }
  }

  // Message operations
  async saveMessage(messageData) {
    await this.ensureInitialized();

    if (this.useMongoDB) {
      try {
        const message = new Message({
          user: messageData.user,
          recipient: messageData.recipient || null,
          text: messageData.text,
          timestamp: new Date()
        });

        const savedMessage = await message.save();
        return savedMessage;
      } catch (error) {
        console.error('Error saving message to MongoDB:', error);
        throw error;
      }
    } else {
      // Fallback to in-memory storage
      return this.saveMessageInMemory(messageData);
    }
  }

  saveMessageInMemory(messageData) {
    const message = {
      _id: Date.now().toString(),
      user: messageData.user,
      recipient: messageData.recipient || null,
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

  async getRecentMessages(limit = 50, currentUser = null) {
    await this.ensureInitialized();

    if (this.useMongoDB) {
      try {
        let query = {};

        if (currentUser) {
          // Filter messages for current user (messages they sent or received)
          query = {
            $or: [
              { user: currentUser },
              { recipient: currentUser },
              { recipient: null } // Public messages
            ]
          };
        }

        return await Message.find(query)
          .sort({ timestamp: 1 }) // Oldest first for proper chronological order
          .limit(limit)
          .lean()
          .then(messages => messages.map(msg => ({
            ...msg,
            id: msg._id.toString(),
            isPrivate: msg.recipient !== null
          })));
      } catch (error) {
        console.error('Error getting recent messages from MongoDB:', error);
        return [];
      }
    } else {
      // Fallback to in-memory storage
      return this.getRecentMessagesInMemory(limit, currentUser);
    }
  }

  getRecentMessagesInMemory(limit = 50, currentUser = null) {
    if (!currentUser) {
      const recentMessages = this.messages.slice(-limit);
      return recentMessages.map(msg => ({
        ...msg,
        id: msg._id || msg.timestamp.toString(),
        isPrivate: msg.recipient !== null
      }));
    }

    // Filter messages for current user (messages they sent or received)
    const userMessages = this.messages.filter(msg =>
      msg.user === currentUser || msg.recipient === currentUser || msg.recipient === null
    );

    const recentUserMessages = userMessages.slice(-limit);
    return recentUserMessages.map(msg => ({
      ...msg,
      id: msg._id || msg.timestamp.toString(),
      isPrivate: msg.recipient !== null
    }));
  }

  async getConversationMessages(user1, user2, limit = 50) {
    if (this.useMongoDB) {
      try {
        const query = {
          $or: [
            { user: user1, recipient: user2 },
            { user: user2, recipient: user1 },
            { user: user1, recipient: null },
            { user: user2, recipient: null }
          ]
        };

        return await Message.find(query)
          .sort({ timestamp: 1 }) // Oldest first for proper chronological order
          .limit(limit)
          .lean()
          .then(messages => messages.map(msg => ({
            ...msg,
            id: msg._id.toString(),
            isPrivate: msg.recipient !== null
          })));
      } catch (error) {
        console.error('Error getting conversation messages from MongoDB:', error);
        return [];
      }
    } else {
      // Fallback to in-memory storage
      const conversationMessages = this.messages.filter(msg =>
        (msg.user === user1 && msg.recipient === user2) ||
        (msg.user === user2 && msg.recipient === user1) ||
        (msg.user === user1 && msg.recipient === null) ||
        (msg.user === user2 && msg.recipient === null)
      );

      const recentConversationMessages = conversationMessages.slice(-limit);
      return recentConversationMessages.map(msg => ({
        ...msg,
        id: msg._id || msg.timestamp.toString(),
        isPrivate: msg.recipient !== null
      }));
    }
  }
}

module.exports = new MemoryStorage();
