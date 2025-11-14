import express from "express";
import UserController from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

/**
 * @openapi
 * /api/users/:
 *  get:
 *    summary: Récupère la liste de tous les utilisateurs (réservé aux admins)
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Liste des utilisateurs récupérée avec succès
 *      404:
 *        description: Aucun utilisateur trouvé
 */
router.get("/", authenticateToken, authorizeRoles("admin"), UserController.listUsers);

/**
 * @openapi
 * /api/users/{id}:
 *  get:
 *    summary: Récupère un utilisateur par son ID (authentification requise)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Identifiant unique de l'utilisateur
 *    responses:
 *      200:
 *        description: Utilisateur trouvé
 *      404:
 *        description: Utilisateur non trouvé
 */
router.get("/:id", authenticateToken, UserController.getUser);

/**
 * @openapi
 * /api/users/{id}:
 *  put:
 *    summary: Met à jour un utilisateur (réservé aux admins)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Identifiant de l'utilisateur à modifier
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *    responses:
 *      200:
 *        description: Utilisateur mis à jour avec succès
 *      404:
 *        description: Utilisateur non trouvé
 */
router.put("/:id", authenticateToken, authorizeRoles("admin"), UserController.updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *  delete:
 *    summary: Supprime un utilisateur (réservé aux admins)
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Identifiant de l'utilisateur à supprimer
 *    responses:
 *      200:
 *        description: Utilisateur supprimé avec succès
 *      404:
 *        description: Utilisateur non trouvé
 */
router.delete("/:id", authenticateToken, authorizeRoles("admin"), UserController.deleteUser);

export default router;
