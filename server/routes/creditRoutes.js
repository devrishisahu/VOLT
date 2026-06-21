import express from "express";
import creditController from "../controllers/creditController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/request", protect.forUser, creditController.createCreditRequest);
router.get("/myrequests", protect.forUser, creditController.getUserCreditRequests);

// Admin routes
router.get("/admin/requests", protect.forAdmin, creditController.getAllCreditRequests);
router.put("/admin/request/:id", protect.forAdmin, creditController.updateCreditRequestStatus);

export default router;
