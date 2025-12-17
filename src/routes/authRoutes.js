import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

/**
 * @openapi
 * /api/users/register:
 *  post:
 *    summary: Enregistre un nouvel utilisateur
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      201:
 *        description: Utilisateur créé avec succès
 *      400:
 *        description: Email déjà utilisé
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /api/users/login:
 *  post:
 *    summary: Connecte un utilisateur existant et renvoie une session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Connexion réussie
 *      401:
 *        description: Identifiants invalides
 */
router.post("/login", AuthController.login);

/**
 * @openapi
 * /api/users/logout:
 *  post:
 *    summary: Déconnecte un utilisateur existant et supprime sa session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Déconnexion réussie
 *      500:
 *        description: Erreur lors de la déconnexion
 */
router.post("/logout", AuthController.logout);

export default router;
