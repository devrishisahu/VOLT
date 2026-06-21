import express, { Router } from "express"
import commentController from "../controllers/commentController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get ("/:eid" , commentController.getComments)
router.post ("/:eid" ,protect.forUser, commentController.addComment)
router.delete("/:cid" , protect.forUser, commentController.deleteComment)





export default router

