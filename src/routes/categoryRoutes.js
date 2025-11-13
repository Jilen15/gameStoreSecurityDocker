import express from "express";
import CategoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", CategoryController.listCategories);
router.get("/:id", CategoryController.getCategory);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;
