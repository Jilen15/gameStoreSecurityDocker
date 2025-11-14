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
 *    summary: Connecte un utilisateur existant et renvoie un token JWT
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

export default router;
