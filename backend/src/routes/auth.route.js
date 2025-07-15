import express from 'express';
import { signUp } from '../controllers/auth.controllers.js';

// Import the user controller
const authRouter = express.Router();

authRouter.post('/sign-up', signUp)

export default authRouter;