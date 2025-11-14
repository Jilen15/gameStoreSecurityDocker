import User from "../models/User.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

class UserController{

    static async listUsers(req, res, next){
        try {
            const data = await User.findAll();
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static async getUser(req, res, next){
        try {
            const { id } = req.params;

            const user = await User.findById(Number(id));
            if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

            return res.status(200).json({user});
        } catch (err) { 
            next(err);
        }
    }

    static async updateUser(req, res, next){
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;

            const updatedUser = await User.update(id, { username, email, password });
            if(!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

            res.status(200).json({ message: "Utilisateur modifié", updatedUser });
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next){
        try {
            const { id } = req.params;

            const deletedUser = await User.delete(id);
            if(!deletedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

            res.status(204).json({ message: "Utilisateur supprimé", deletedUser });
        } catch (err) {
            next(err);
        }
    }

}

export default UserController;