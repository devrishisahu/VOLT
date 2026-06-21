import express from "express";
import chatController from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect.forUser, chatController.askVoltBot);

export default router;
