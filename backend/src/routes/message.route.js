import express from "express";
import {
  sendMessage,
  getMessages,
  getConversations,
  deleteMessage,
  getMessage,
  editMessage,
  togglePinMessage,
  getPinnedMessages
} from "../controllers/message.controllers.js";

import auth from "../middleware/auth.middleware.js";
import {
  uploadImage,
  uploadToCloudinary,
  handleUploadError
} from "../middleware/upload.middleware.js";

const messageRouter = express.Router();

// Most specific routes first
messageRouter.post("/send", auth, uploadImage, uploadToCloudinary, handleUploadError, sendMessage);
messageRouter.get("/conversations", auth, getConversations);
messageRouter.get("/message/:messageId", auth, getMessage);
messageRouter.put("/:messageId/edit", auth, editMessage);
messageRouter.patch("/:messageId/pin", auth, togglePinMessage);
messageRouter.get("/:userId/pinned", auth, getPinnedMessages);
messageRouter.delete("/:messageId", auth, deleteMessage);

// Most generic route last
messageRouter.get("/:userId", auth, getMessages);

export default messageRouter;
