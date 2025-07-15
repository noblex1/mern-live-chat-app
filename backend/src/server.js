import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './lib/db.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

const app = express();

// Middleware - code that runs before our routes
app.use(express.json()); // Allows server to understand JSON data
app.use(cors("*")); // Allows frontend to communicate with backend

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})