const MemoryStorage = require('../models/MemoryStorage');

// Store connected users
const connectedUsers = new Map();

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join', async (token) => {
      try {
        let userInfo;
        
        // Check if it's a demo token (base64 encoded JSON)
        try {
          userInfo = JSON.parse(atob(token));
        } catch (e) {
          // If not base64, try parsing as regular JWT
          try {
            const payload = token.split('.')[1];
            userInfo = JSON.parse(atob(payload));
          } catch (jwtError) {
            console.error('Invalid token format:', jwtError);
            socket.emit('error', 'Invalid authentication token');
            return;
          }
        }
        
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

          // Send recent messages (last 50) - filtered for current user
          const recentMessages = await MemoryStorage.getRecentMessages(50, user.username);
          console.log(`📨 User ${user.username} joined - sending ${recentMessages.length} messages`);
          recentMessages.forEach(msg => {
            console.log(`   Message: ${msg.user} -> ${msg.recipient || 'all'}: "${msg.text}"`);
          });
          socket.emit('messageHistory', recentMessages);

          console.log(`User ${user.username} joined`);
        } else {
          // Create user if doesn't exist (for demo)
          const newUser = await MemoryStorage.createUser({
            username: userInfo.username,
            email: userInfo.email
          });

          console.log(`👤 New demo user created: ${newUser.username} (${newUser.email})`);
          
          connectedUsers.set(socket.id, {
            userId: newUser._id,
            username: newUser.username
          });
          
          socket.emit('currentUser', newUser.username);
          const allUsers = await MemoryStorage.getAllUsers();
          io.emit('users', allUsers);

          console.log(`New demo user ${newUser.username} created and joined`);
        }
      } catch (error) {
        console.error('Error in join:', error);
        socket.emit('error', 'Authentication failed');
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
      try {
        const userInfo = connectedUsers.get(socket.id);
        if (!userInfo) {
          socket.emit('error', 'User not authenticated');
          return;
        }

        const { text, recipient } = messageData;

        // Create and save message
        const message = await MemoryStorage.saveMessage({
          user: userInfo.username,
          recipient: recipient || null,
          text: text
        });

        console.log(`💾 Message saved: ${message.user} -> ${message.recipient || 'all'}: "${message.text}" (ID: ${message._id})`);

        // Send to recipient if it's a private message
        if (recipient) {
          // Find recipient's socket
          let recipientSocket = null;
          for (const [socketId, user] of connectedUsers.entries()) {
            if (user.username === recipient) {
              recipientSocket = socketId;
              break;
            }
          }

          // Send to recipient and sender
          if (recipientSocket) {
            io.to(recipientSocket).emit('message', {
              id: message._id,
              user: userInfo.username,
              recipient: recipient,
              text: text,
              timestamp: message.timestamp,
              isPrivate: true
            });
          }

          // Send back to sender
          socket.emit('message', {
            id: message._id,
            user: userInfo.username,
            recipient: recipient,
            text: text,
            timestamp: message.timestamp,
            isPrivate: true
          });
        } else {
          // Broadcast public message to all connected clients
          io.emit('message', {
            id: message._id,
            user: userInfo.username,
            text: text,
            timestamp: message.timestamp,
            isPrivate: false
          });
        }

        console.log(`Message from ${userInfo.username} to ${recipient || 'all'}: ${text}`);
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
