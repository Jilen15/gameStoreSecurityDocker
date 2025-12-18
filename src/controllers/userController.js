import User from "../models/User.model.js";

const userSchema = Joi.object({
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

class UserController{

    static async listUsers(req, res, next){
        try {
            const data = await User.findAll();
            return res.status(200).json(User.displayManyWithoutCrypto(data));
        } catch (err) {
            next(err);
        }
    };

    static async getUser(req, res, next){
        try {
            const { id } = req.params;

            const user = await User.findById(Number(id));
            if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

            return res.status(200).json({ user: User.displayWithoutCrypto(user) });
        } catch (err) { 
            next(err);
        }
    }

    static async updateUser(req, res, next){
        try {
            const { error } = userSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { id } = req.params;
            const { username, email, password } = req.body;

            const updatedUser = await User.update(id, { username, email, password });
            if(!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

            res.status(200).json({ message: "Utilisateur modifié", user: User.displayWithoutCrypto(updatedUser) });
        } catch (err) {
            next(err);
        }
    }

    static async deleteUser(req, res, next){
        try {
            const { id } = req.params;

            const deletedUser = await User.delete(id);
            if(!deletedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });

            return res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

}

export default UserController;