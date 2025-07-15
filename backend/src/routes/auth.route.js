import express from 'express';
import { signIn, signUp } from '../controllers/auth.controllers.js';

// Import the user controller
const authRouter = express.Router();

authRouter.post('/sign-up', signUp)
authRouter.post('/signIn', signIn)

export default authRouter;