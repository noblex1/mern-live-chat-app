import express from "express";
import { sendMessage, getMessages, getConversations, deleteMessage, getMessage, editMessage, togglePinMessage, getPinnedMessages } from "../controllers/message.controllers.js";
import auth from "../middleware/auth.middleware.js";
import { uploadImage, handleUploadError } from "../middleware/upload.middleware.js";

const messageRouter = express.Router();

messageRouter.post("/send", auth, uploadImage, handleUploadError, sendMessage);                    // Send a message

messageRouter.get("/conversations", auth, getConversations); // Get all conversations

messageRouter.get("/:userId", auth, getMessages);   // Get messages for a user

messageRouter.delete("/:messageId", auth, deleteMessage); // Delete a message

messageRouter.get("/message/:messageId", auth, getMessage); // Get a single message

// New routes for advanced features
messageRouter.put("/:messageId/edit", auth, editMessage); // Edit a message

messageRouter.patch("/:messageId/pin", auth, togglePinMessage); // Pin/Unpin a message

messageRouter.get("/:userId/pinned", auth, getPinnedMessages); // Get pinned messages for a conversation

export default messageRouter;
