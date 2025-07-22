import express from "express";
import { sendMessage, getMessages, getConversations, deleteMessage, getMessage } from "../controllers/message.controllers.js";
import auth from "../middleware/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.post("/send", auth, sendMessage);                    // Send a message

messageRouter.get("/conversations", auth, getConversations); // Get all conversations

messageRouter.get("/:userId", auth, getMessages);   // Get messages for a user

messageRouter.delete("/:messageId", auth, deleteMessage); // Delete a message

messageRouter.get("/message/:messageId", auth, getMessage); // Get a single message

export default messageRouter;
