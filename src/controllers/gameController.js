import Game from "../models/game.model.js";

class GameController {
    static async listGames(req, res, next) {
        try {
            const games = await Game.findAll();
            res.json(games);
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
            return res.statut(200).json(game);
        } catch (err) {
            next(err);
        }
    }

    static async createGame(req, res, next) {
        try {
            const { name, price, description } = req.body;
            const newGame = await Game.create(name, price, description);
            return res.status(201).json(newGame);
        } catch (err) {
            next(err);
        }
    }

    static async updateGame(req, res, next) {
        try {
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
            await Game.delete(Number(id));
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}
export default GameController;

