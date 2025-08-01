import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const initializeSocket = (server) => {
  console.log('🔌 Initializing Socket.IO server...');
  
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:5173",
        "https://meebachat.onrender.com",
        "https://mern-chat-758s.onrender.com",
        "https://hackchat-frontend.vercel.app"
      ],
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  console.log('✅ Socket.IO server initialized with CORS configuration');

  // Track online users
  const onlineUsers = new Set();

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      console.log('🔐 Socket authentication attempt...');
      console.log('🔐 Auth data:', socket.handshake.auth);
      
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log('Socket authentication failed: No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      console.log('🔐 Token received, verifying...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔐 Token verified, finding user...');
      
      const user = await userModel.findById(decoded.userId).select('username avatar');
      
      if (!user) {
        console.log('Socket authentication failed: User not found');
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = decoded.userId;
      socket.user = user;
      console.log(`✅ Socket authentication successful for user: ${user.username}`);
      next();
    } catch (error) {
      console.log('❌ Socket authentication failed:', error.message);
      next(new Error('Authentication error: Invalid token'));
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
        const { receiverId, text, imageUrl, messageId } = data;
        
        // Emit to sender (for immediate feedback)
        socket.emit('message:sent', {
          _id: messageId,
          senderId: socket.user,
          receiverId,
          text,
          imageUrl,
          createdAt: new Date()
        });

        // Emit to receiver with the same message structure
        socket.to(receiverId).emit('message:received', {
          _id: messageId,
          senderId: socket.user,
          receiverId,
          text,
          imageUrl,
          createdAt: new Date()
        });
      } catch (error) {
        console.error('Socket message error:', error);
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

    // Handle message pinning
    socket.on('message:pin', (data) => {
      const { messageId, isPinned } = data;
      // Emit to both sender and receiver for real-time pin updates
      socket.broadcast.emit('message:pinned', {
        messageId,
        isPinned,
        pinnedBy: socket.userId
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