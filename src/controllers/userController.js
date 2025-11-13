import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

class UserController{

    static async listUsers(req, res){
        try {
            const data = await User.findAll();
            return res.status(200).json(data);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    };

    static async getUser(req, res){
        try {
            const { id } = req.params;

            const user = await User.findById(Number(id));
            if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

            return res.status(200).json({user});
        } catch (e) { 
            console.error(e);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    }

    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create(username, email, hashedPassword, 2);

            res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Identifiants invalides" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Identifiants invalides" });
            }

            const token = jwt.sign(
                { id: user.id_user, email: user.email, role: user.roleName },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({ message: "Connexion réussie", token });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    }

    static async updateUser(req, res){
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;

            const updatedUser = await User.update(id, { username, email, password });
            if(!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

            res.status(200).json({ message: "Utilisateur modifié", updatedUser });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    }

    static async deleteUser(req, res){
        try {
            const { id } = req.params;

            const deletedUser = await User.delete(id);
            if(!deletedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

            res.status(204).json({ message: "Utilisateur supprimé", deletedUser });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Erreur serveur interne" });
        }
    }

}

export default UserController;