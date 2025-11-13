import express from "express";
import ProfileController from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

router.get("/", authenticateToken, ProfileController.listProfiles);
router.get("/:id", authenticateToken, ProfileController.getProfile);
router.post("/", authenticateToken, ProfileController.createProfile);
router.put("/:id", authenticateToken, ProfileController.updateProfile);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), ProfileController.deleteProfile);

export default router;