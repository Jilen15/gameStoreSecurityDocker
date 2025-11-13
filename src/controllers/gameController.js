import Game from "../models/game.model.js";

class GameController {
    static async listGames(req, res) {
        try {
            const games = await Game.findAll();
            res.json(games);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }
    
    static async getGame(req, res) {
        try {
            const {id} = req.params;
            const game =  await Game.findById(Number(id));
            if (!game) {
                return res.status(404).json({ error: "Jeu non trouvé" });
            }
            return res.statut(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }

    static async createGame(req, res) {
        try {
            const { name, price, description } = req.body;
            const newGame = await Game.create(name, price, description);
            return res.status(201).json(newGame);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }

    static async updateGame(req, res) {
        try {
            const { id } = req.params;
            const { name, price, description } = req.body;
            const updatedGame = await Game.update(Number(id), { name, price, description });
            if (!updatedGame) {
                return res.status(404).json({ error: "Jeu non trouvé" });
            }
            return res.status(200).json(updatedGame);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }

    static async deleteGame(req, res) {
        try {
            const { id } = req.params;
            await Game.delete(Number(id));
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }
}
export default GameController;

