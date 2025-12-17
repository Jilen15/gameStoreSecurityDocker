import express from "express";
import CommentController from "../controllers/commentController.js";
import { authenticateSession } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

/**
 * @openapi
 * /api/comments/:
 *   get:
 *     summary: Récupère tous les commentaires
 *     responses:
 *       200:
 *         description: La liste des commentaires
 *       404:
 *         description: Commentaire non trouvé
 */
router.get("/", authenticateSession, CommentController.listComments);

/**
 * @openapi
 * /api/comments/{id}:
 *   get:
 *     summary: Récupère un commentaire par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id du commentaire
 *     responses:
 *       200:
 *         description: Un commentaire
 *       404:
 *         description: Commentaire non trouvé
 */
router.get("/:id", authenticateSession, CommentController.getComment);

/**
 * @openapi
 * /api/comments/:
 *   post:
 *     summary: Crée un nouveau commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               note:
 *                 type: integer
 *               type:
 *                 type: string
 *             description: Le contenu, la note et le type du commentaire
 *     responses:
 *       201:
 *         description: Commentaire créé
 *       400:
 *         description: Requête invalide
 */
router.post("/", authenticateSession, CommentController.createComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   put:
 *     summary: Met à jour un commentaire par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id du commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               note:
 *                 type: integer
 *               type:
 *                 type: string
 *             description: Le contenu, la note et le type du commentaire
 *     responses:
 *       200:
 *         description: Commentaire mis à jour
 *       404:
 *         description: Commentaire non trouvé
 */
router.put("/:id", authenticateSession, authorizeRoles("admin"), CommentController.updateComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     summary: Supprime un commentaire par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id du commentaire
 *     responses:
 *       204:
 *         description: Commentaire supprimé
 *       404:
 *         description: Commentaire non trouvé
 */
router.delete("/:id", authenticateSession, authorizeRoles("admin"), CommentController.deleteComment);

export default router;
