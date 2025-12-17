import express from "express";
import CategoryController from "../controllers/categoryController.js";
import { authenticateSession } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

/**
 * @openapi
 * /api/categories/:
 *   get:
 *     summary: Récupère toutes les catégories
 *     responses:
 *       200:
 *         description: La liste des catégories
 *       404:
 *         description: Catégories non trouvées
 */
router.get("/", authenticateSession, CategoryController.listCategories);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Récupère une catégorie par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id de la catégorie
 *     responses:
 *       200:
 *         description: Une catégorie
 *       404:
 *         description: Catégorie non trouvée
 */
router.get("/:id", authenticateSession, CategoryController.getCategory);

/**
 * @openapi
 * /api/categories/:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 description: Le nom de la catégorie
 *     responses:
 *       201:
 *         description: Catégorie créée
 *       500:
 *         description: Erreur serveur interne
 */
router.post("/", authenticateSession, authorizeRoles("admin"), CategoryController.createCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id de la catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 description: Le nom de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *       404:
 *         description: Catégorie non trouvée
 */
router.put("/:id", authenticateSession, authorizeRoles("admin"), CategoryController.updateCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'id de la catégorie
 *     responses:
 *       204:
 *         description: Catégorie supprimée
 *       500:
 *         description: Erreur serveur interne
 */
router.delete("/:id", authenticateSession, authorizeRoles("admin"), CategoryController.deleteCategory);

export default router;
