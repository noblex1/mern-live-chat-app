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
        "https://mern-chat-758s.onrender.com"
      ],
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  console.log('✅ Socket.IO server initialized with CORS configuration');

  const onlineUsers = new Set();

  io.use(async (socket, next) => {
    try {
      console.log('🔐 Socket authentication attempt...');
      const token = socket.handshake.auth.token;

      if (!token) {
        console.log('Socket authentication failed: No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId).select('username avatar');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = decoded.userId;
      socket.user = user;
      console.log(`✅ Authenticated: ${user.username}`);
      next();
    } catch (error) {
      console.log('❌ Socket authentication failed:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`🔗 Connected: ${socket.user.username} (${socket.userId})`);
    onlineUsers.add(socket.userId);

    try {
      await userModel.findByIdAndUpdate(socket.userId, { isOnline: true });
    } catch (error) {
      console.error('❌ Error setting user online:', error);
    }

    socket.join(socket.userId);
    socket.emit('users:online', Array.from(onlineUsers));

    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      username: socket.user.username,
      avatar: socket.user.avatar
    });

    socket.on('message:send', async (data) => {
      try {
        const { receiverId, text, imageUrl, messageId } = data;

        if (!receiverId) return;

        const messagePayload = {
          _id: messageId,
          senderId: socket.user,
          receiverId,
          text,
          imageUrl,
          createdAt: new Date()
        };

        socket.emit('message:sent', messagePayload);
        socket.to(receiverId).emit('message:received', messagePayload);
      } catch (error) {
        console.error('❌ message:send error:', error);
        socket.emit('message:error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing:start', (data) => {
      if (!data?.receiverId) return;
      socket.to(data.receiverId).emit('typing:start', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    socket.on('typing:stop', (data) => {
      if (!data?.receiverId) return;
      socket.to(data.receiverId).emit('typing:stop', {
        userId: socket.userId
      });
    });

    socket.on('message:read', (data) => {
      if (!data?.senderId || !data?.messageId) return;
      socket.to(data.senderId).emit('message:read', {
        messageId: data.messageId,
        readBy: socket.userId
      });
    });

    socket.on('message:pin', (data) => {
      const { messageId, isPinned } = data || {};
      if (!messageId) return;

      socket.broadcast.emit('message:pinned', {
        messageId,
        isPinned,
        pinnedBy: socket.userId
      });
    });

    socket.on('disconnect', async () => {
      console.log(`🔌 Disconnected: ${socket.user.username} (${socket.userId})`);
      onlineUsers.delete(socket.userId);

      try {
        await userModel.findByIdAndUpdate(socket.userId, { isOnline: false });
      } catch (error) {
        console.error('❌ Error setting user offline:', error);
      }

      socket.broadcast.emit('user:offline', {
        userId: socket.userId
      });
    });
  });

  return io;
};
