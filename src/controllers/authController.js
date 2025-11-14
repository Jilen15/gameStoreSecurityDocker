import User from "../models/User.model.js";
import AuthModel from "../models/Auth.model.js";

class AuthController {

    static async register(req, res, next) {
        try {
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
            const { email, password } = req.body;

            const user = await User.findByEmail(email);
            console.log("User depuis findByEmail:", user);
            if (!user) return res.status(401).json({ message: "Identifiants invalides" });

            const match = await AuthModel.comparePassword(password, user.password);
            if (!match) return res.status(401).json({ message: "Identifiants invalides" });

            const token = AuthModel.generateToken(user);

            return res.status(200).json({
                message: "Connexion réussie",
                token,
                role: user.rolename
            });

        } catch (err) {
            next(err);
        }
    }
}

export default AuthController;
