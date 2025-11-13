import express from "express";
import ProfileController from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/Auth.js";
import { authorizeRoles } from "../middlewares/Roles.js";

const router = express.Router();

/**
 * @openapi
 * /api/profiles/:
 *  get:
 *    summary: Récupère la liste de tous les profils
 *    responses:
 *      200:
 *        description: Liste des profils récupérée avec succès
 *      404:
 *        description: Aucun profil trouvé
 */
router.get("/", authenticateToken, ProfileController.listProfiles);

/**
 * @openapi
 * /api/profiles/{id}:
 *  get:
 *    summary: Récupère un profil par son userId
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Identifiant de l'utilisateur
 *    responses:
 *      200:
 *        description: Profil trouvé
 *      404:
 *        description: Profil non trouvé
 */
router.get("/:id", authenticateToken, ProfileController.getProfile);

/**
 * @openapi
 * /api/profiles/:
 *  post:
 *    summary: Crée un nouveau profil utilisateur
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: integer
 *              gamesList:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *              commentHistory:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    gameId:
 *                      type: string
 *                    note:
 *                      type: integer
 *                    content:
 *                      type: string
 *                    type:
 *                      type: string
 *    responses:
 *      201:
 *        description: Profil créé avec succès
 *      400:
 *        description: Données invalides ou userId manquant
 */
router.post("/", authenticateToken, ProfileController.createProfile);

/**
 * @openapi
 * /api/profiles/{id}:
 *  put:
 *    summary: Met à jour un profil existant par son userId
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Identifiant de l'utilisateur
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              gamesList:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *              commentHistory:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    gameId:
 *                      type: string
 *                    note:
 *                      type: integer
 *                    content:
 *                      type: string
 *                    type:
 *                      type: string
 *    responses:
 *      200:
 *        description: Profil mis à jour avec succès
 *      404:
 *        description: Profil non trouvé
 */
router.put("/:id", authenticateToken, ProfileController.updateProfile);

/**
 * @openapi
 * /api/profiles/{id}:
 *  delete:
 *    summary: Supprime un profil utilisateur
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Identifiant de l'utilisateur
 *    responses:
 *      200:
 *        description: Profil supprimé avec succès
 *      404:
 *        description: Profil non trouvé
 */
router.delete("/:id", authenticateToken, authorizeRoles("admin"), ProfileController.deleteProfile);

export default router;