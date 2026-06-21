import express, { Router } from "express"
import protect from "../middleware/authMiddleware.js"
import orderController from "../controllers/orderController.js"

const router = express.Router()

router.get("/" , protect.forUser ,orderController.getTickets)
router.get("/:tid" , protect.forUser ,orderController.getTicket)
router.put("/:tid" , protect.forUser ,orderController.cancelTicket)
router.post("/check/coupon" , protect.forUser ,orderController.checkCoupon)
router.post("/:eid" , protect.forUser ,orderController.bookTicket)

export default router;