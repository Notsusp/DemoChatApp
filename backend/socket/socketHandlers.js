const MemoryStorage = require('../models/MemoryStorage');

// Store connected users
const connectedUsers = new Map();

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join', async (token) => {
      try {
        // For demo purposes, we'll use a simple token format
        // In production, this would verify JWT
        const userInfo = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const user = await MemoryStorage.findUserById(userInfo.userId);

        if (user) {
          // Update user online status
          await MemoryStorage.updateUserOnlineStatus(user._id, true);

          // Store user info in connected users map
          connectedUsers.set(socket.id, {
            userId: user._id,
            username: user.username
          });

          // Join user to their personal room
          socket.join(user._id.toString());

          // Send current user info back
          socket.emit('currentUser', user.username);

          // Send updated users list to all clients
          const allUsers = await MemoryStorage.getAllUsers();
          io.emit('users', allUsers);

          // Send recent messages (last 50)
          const recentMessages = await MemoryStorage.getRecentMessages(50);
          socket.emit('messageHistory', recentMessages);

          console.log(`User ${user.username} joined`);
        }
      } catch (error) {
        console.error('Error in join:', error);
        socket.emit('error', 'Authentication failed');
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageText) => {
      try {
        const userInfo = connectedUsers.get(socket.id);
        if (!userInfo) {
          socket.emit('error', 'User not authenticated');
          return;
        }

        // Create and save message
        const message = await MemoryStorage.saveMessage({
          user: userInfo.username,
          text: messageText
        });

        // Broadcast message to all connected clients
        io.emit('message', {
          id: message._id,
          user: userInfo.username,
          text: messageText,
          timestamp: message.timestamp
        });

        console.log(`Message from ${userInfo.username}: ${messageText}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle typing indicators (optional feature)
    socket.on('typing', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        socket.broadcast.emit('userTyping', userInfo.username);
      }
    });

    socket.on('stopTyping', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        socket.broadcast.emit('userStoppedTyping', userInfo.username);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);

      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        // Update user offline status
        await MemoryStorage.updateUserOnlineStatus(userInfo.userId, false);

        // Remove from connected users
        connectedUsers.delete(socket.id);

        // Send updated users list to all clients
        const allUsers = await MemoryStorage.getAllUsers();
        io.emit('users', allUsers);

        console.log(`User ${userInfo.username} disconnected`);
      }
    });

    // Get current user (for initial load)
    socket.on('getCurrentUser', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        socket.emit('currentUser', userInfo.username);
      }
    });
  });
};

module.exports = { setupSocketHandlers };
