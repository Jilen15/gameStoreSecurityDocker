import express from "express";
import GameController from "../controllers/gameController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

router.get("/", authenticateToken, GameController.listGames);
router.get("/:id", authenticateToken, GameController.getGame);
router.post("/", authenticateToken, authorizeRoles("admin"), GameController.createGame);
router.put("/:id", authenticateToken, authorizeRoles("admin"), GameController.updateGame);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), GameController.deleteGame);

export default router;
