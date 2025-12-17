import User from "../models/User.model.js";
import AuthModel from "../models/Auth.model.js";
import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .min(12)
    .max(128)
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp("(?=.*[!@#$%^&*])"))
    .required(),
  email: Joi.string().email().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(12)
    .max(128)
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp("(?=.*[!@#$%^&*])"))
    .required()
});


class AuthController {

    static async register(req, res, next) {
        try {
            const { error } = registerSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { username, email, password, id_role = 1 } = req.body;

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé." });
            }

            const hashedPassword = await AuthModel.hashPassword(password);

            const newUser = await User.create(username, email, hashedPassword, id_role);

            return res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: newUser
            });

        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { error } = loginSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { email, password } = req.body;

            const user = await User.findByEmail(email);
            if (!user) return res.status(401).json({ message: "Identifiants invalides" });

            const match = await AuthModel.comparePassword(password, user.password);
            if (!match) return res.status(401).json({ message: "Identifiants invalides" });

            req.session.user = {
                id: user.id_user,
                email: user.email,
                role: user.rolename,
            };

            return res.status(200).json({ message: "Connexion réussie", role: user.rolename });

        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res, next){
        try {
            req.session.destroy((err) => {
                if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });

              res.clearCookie("sessionId");
              res.status(200).json({ message: "Déconnecté" });
            });
        } catch (err) {
            next(err);
        }
    }
}

export default AuthController;
