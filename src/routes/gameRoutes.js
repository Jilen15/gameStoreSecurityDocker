import express from "express";
import GameController from "../controllers/gameController.js";
import { authenticateSession } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

/**
 * @openapi
 * /api/games/:
 *   get:
 *     summary: Récupère tous les jeux
 *     responses:
 *       200:
 *         description: La liste des jeux
 *       404:
 *         description: Jeu non trouvé
 */
router.get("/", authenticateSession, GameController.listGames);

/**
 * @openapi
 * /api/games/{id}:
 *   get:
 *     summary: Récupère un jeu par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id du jeu
 *     responses:
 *       200:
 *         description: Un jeu
 *       404:
 *         description: Jeu non trouvé
 */
router.get("/:id", authenticateSession, GameController.getGame);

/**
 * @openapi
 * /api/games/:
 *   post:
 *     summary: Crée un nouveau jeu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *             description: Le nom et le prix du jeu
 *     responses:
 *       201:
 *         description: Jeu créé
 *       400:
 *         description: Requête invalide
 */
router.post("/", authenticateSession, authorizeRoles("admin"), GameController.createGame);

/**
 * @openapi
 * /api/games/{id}:
 *   put:
 *     summary: Met à jour un jeu par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id du jeu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *             description: Le nom et le prix du jeu
 *     responses:
 *       200:
 *         description: Jeu mis à jour
 *       404:
 *         description: Jeu non trouvé
 */
router.put("/:id", authenticateSession, authorizeRoles("admin"), GameController.updateGame);

/**
 * @openapi
 * /api/games/{id}:
 *   delete:
 *     summary: Supprime un jeu par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id du jeu
 *     responses:
 *       204:
 *         description: Jeu supprimé
 *       404:
 *         description: Jeu non trouvé
 */
router.delete("/:id", authenticateSession, authorizeRoles("admin"), GameController.deleteGame);

export default router;
