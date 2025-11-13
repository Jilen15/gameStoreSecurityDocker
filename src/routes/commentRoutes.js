import express from "express";
import CommentController from "../controllers/commentController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

router.get("/", authenticateToken, CommentController.listComments);
router.get("/:id", authenticateToken, CommentController.getComment);
router.post("/", authenticateToken, CommentController.createComment);
router.put("/:id", authenticateToken, authorizeRoles("admin"), CommentController.updateComment);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), CommentController.deleteComment);

export default router;
