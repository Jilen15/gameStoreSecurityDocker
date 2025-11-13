import express from "express";
import GameController from "../controllers/gameController.js";

const router = express.Router();

router.get("/", GameController.listGames);
router.get("/:id", GameController.getGame);
router.post("/", GameController.createGame);
router.put("/:id", GameController.updateGame);
router.delete("/:id", GameController.deleteGame);

export default router;
