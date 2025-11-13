import express from "express";
import CategoryController from "../controllers/categoryController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

router.get("/", authenticateToken, CategoryController.listCategories);
router.get("/:id", authenticateToken, CategoryController.getCategory);
router.post("/", authenticateToken, authorizeRoles("admin"), CategoryController.createCategory);
router.put("/:id", authenticateToken, authorizeRoles("admin"), CategoryController.updateCategory);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), CategoryController.deleteCategory);

export default router;
