import express from "express";
import ProfileController from "../controllers/profileController.js";

const router = express.Router();

router.get("/", ProfileController.listProfiles);
router.get("/:id", ProfileController.getProfile);
router.post("/", ProfileController.createProfile);
router.put("/:id", ProfileController.updateProfile);
router.delete("/:id", ProfileController.deleteProfile);

export default router;