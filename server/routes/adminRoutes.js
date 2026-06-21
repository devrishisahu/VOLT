import express from "express"
import adminController from "../controllers/adminController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get ("/users",protect.forAdmin , adminController.getAllUsers)
router.put ("/users/:uid",protect.forAdmin , adminController.updateUser)
router.get ("/events",protect.forAdmin , adminController.getAllEvents)
router.put ("/events/:eid",protect.forAdmin , adminController.updateEvent)
router.delete("/events/:eid" ,  protect.forAdmin , adminController.deleteEvent)
router.get ("/orders",protect.forAdmin , adminController.getAllOrders)
router.delete("/orders/:oid", protect.forAdmin, adminController.deleteOrder)
router.get ("/ratings",protect.forAdmin , adminController.getAllRatings)
router.get ("/coupons",protect.forAdmin , adminController.getAllCoupons)
router.post("/coupon" ,  protect.forAdmin , adminController.createCoupon)
router.put("/coupon/:cid" ,  protect.forAdmin , adminController.updateCoupon)
router.delete("/coupon/:cid" ,  protect.forAdmin , adminController.deleteCoupon)

export default router;
