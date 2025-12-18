import Game from "../models/game.model.js";

const gameSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(1).required(),
  description: Joi.string().min(1).max(500).required(),
});


class GameController {
    static async listGames(req, res, next) {
        try {
            const games = await Game.findAll();
            res.status(200).json(games);
        } catch (err) {
            next(err);
        }
    }
    
    static async getGame(req, res, next) {
        try {
            const {id} = req.params;
            const game =  await Game.findById(Number(id));
            if (!game) {
                return res.status(404).json({ error: "Jeu non trouvé" });
            }
            return res.status(200).json(game);
        } catch (err) {
            next(err);
        }
    }

    static async createGame(req, res, next) {
        try {
            const { error } = gameSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const { name, price, description } = req.body;
            const newGame = await Game.create(name, price, description);
            return res.status(201).json(newGame);
        } catch (err) {
            next(err);
        }
    }

    static async updateGame(req, res, next) {
        try {
            const { error } = gameSchema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });
            
            const { id } = req.params;
            const { name, price, description } = req.body;
            const updatedGame = await Game.update(Number(id), { name, price, description });
            if (!updatedGame) {
                return res.status(404).json({ error: "Jeu non trouvé" });
            }
            return res.status(200).json(updatedGame);
        } catch (err) {
            next(err);
        }
    }

    static async deleteGame(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Game.delete(Number(id));

            if (!deleted) return res.status(404).json({ message: "Jeu non trouvé" });
            
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}
export default GameController;

