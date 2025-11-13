import express from "express";
import UserController from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin"), UserController.listUsers);
router.get("/:id", authenticateToken, UserController.getUser);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/:id", authenticateToken, authorizeRoles("admin"), UserController.updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), UserController.deleteUser);

export default router;
