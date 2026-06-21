import express from "express"
import eventController from "../controllers/eventController.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/imageUploadMiddleware.js"

const router = express.Router()

router.post("/", protect.forUser , upload.single('eventImage') , eventController.createEvent )
router.get("/", eventController.getEvents )
router.get("/mine", protect.forUser, eventController.getMyEvents )
router.get("/:eid", protect.forUser , eventController.getEvent )





export default router