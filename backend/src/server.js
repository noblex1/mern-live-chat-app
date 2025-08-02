// Import required packages
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './socket/socket.js';
import messageRouter from './routes/message.route.js';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.route.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Updated CORS configuration to allow deployed frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://meebachat.onrender.com',
    'https://mern-chat-758s.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Get port from environment or use 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB database');
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error);
  });

// Routes
app.use('/api/messages', messageRouter);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Chat Server is Running and Connected to Database!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Safe catch-all for any unmatched API routes
app.use('/api/:notFoundRoute', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.originalUrl
  });
});

// Serve frontend for all non-API routes (SPA routing)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../chat-frontend/build')));

app.get('*', (req, res) => {
  // If the request does not start with /api, serve index.html
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../chat-frontend/build/index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl
    });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server initialized`);
});
