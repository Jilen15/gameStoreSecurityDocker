import Profile from "../models/Profiles.model.js";

const profileSchema = Joi.object({
  userId: Joi.number().integer().required(),

  gamesList: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().min(1).required(),
    })
  ),

  commentHistory: Joi.array().items(
    Joi.object({
      gameId: Joi.number().integer().required(),

      note: Joi.number()
        .min(0)
        .max(10)
        .required(),

      content: Joi.string().trim().min(1).required(),

      type: Joi.string().valid("review").default("review"),
    })
  ),
});

class ProfileController{

    static async listProfiles(req, res, next){
        try {
            const data = await Profile.find();
            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    static async getProfile(req, res, next){
        try {
          const { id } = req.params;
          const data = await Profile.find({ userId: Number(id) });
          if (!data) return res.status(404).json({ error: "Profil non trouvé" });
          return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    static async createProfile(req, res, next){
        try {
            const { error } = profileSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { userId, gamesList = [] , commentHistory = [] } = req.body;

            if (!userId) return res.status(400).json({ error: "userId requis" });

            const data = await Profile.create(req.body);
            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    static async updateProfile(req, res, next){
        try {
            const { error } = profileSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });
            
            const { id } = req.params;
            const { gamesList, commentHistory } = req.body;

            const data = await Profile.find({ userId: Number(id) });
            const data2 = await Profile.findOne(data._id);

            if (!data) return res.status(404).json({ error: "Profil non trouvé" });

            const result = await Profile.replaceOne({ _id:data2._id }, req.body);

            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async deleteProfile(req, res, next){
        try {
            const { id } = req.params;
            const data = await Profile.find({ userId: Number(id) });

            if (!data) return res.status(404).json({ error: "Profil non trouvé" });
            await Profile.deleteOne({ _id: data._id });
            return res.status(204).end();
        } catch (e) {
            next(e);
        }
    }
}

export default ProfileController;