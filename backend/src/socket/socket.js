import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });

  // Track online users
  const onlineUsers = new Set();

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId).select('username avatar');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = decoded.userId;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Handle socket connections
  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.userId})`);

    // Add user to online users
    onlineUsers.add(socket.userId);

    // Update user's online status in database
    try {
      await userModel.findByIdAndUpdate(socket.userId, { isOnline: true });
      console.log(`✅ Updated ${socket.user.username} to online in database`);
    } catch (error) {
      console.error('❌ Error updating user online status:', error);
    }

    // Join user to their personal room
    socket.join(socket.userId);

    // Emit current online users to the new user
    socket.emit('users:online', Array.from(onlineUsers));

    // Update user's online status to all other users
    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      username: socket.user.username,
      avatar: socket.user.avatar
    });

    // Handle private messages
    socket.on('message:send', async (data) => {
      try {
        const { receiverId, text, imageUrl } = data;
        
        // Emit to sender (for immediate feedback)
        socket.emit('message:sent', {
          _id: Date.now().toString(), // Temporary ID
          senderId: socket.user,
          receiverId,
          text,
          imageUrl,
          createdAt: new Date()
        });

        // Emit to receiver
        socket.to(receiverId).emit('message:received', {
          _id: Date.now().toString(), // Temporary ID
          senderId: socket.user,
          receiverId,
          text,
          imageUrl,
          createdAt: new Date()
        });
      } catch (error) {
        socket.emit('message:error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data) => {
      socket.to(data.receiverId).emit('typing:start', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(data.receiverId).emit('typing:stop', {
        userId: socket.userId
      });
    });

    // Handle read receipts
    socket.on('message:read', (data) => {
      socket.to(data.senderId).emit('message:read', {
        messageId: data.messageId,
        readBy: socket.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.userId})`);
      
      // Remove user from online users
      onlineUsers.delete(socket.userId);
      
      // Update user's offline status in database
      try {
        await userModel.findByIdAndUpdate(socket.userId, { isOnline: false });
        console.log(`✅ Updated ${socket.user.username} to offline in database`);
      } catch (error) {
        console.error('❌ Error updating user offline status:', error);
      }
      
      // Emit user offline status
      socket.broadcast.emit('user:offline', {
        userId: socket.userId
      });
    });
  });

  return io;
}; 