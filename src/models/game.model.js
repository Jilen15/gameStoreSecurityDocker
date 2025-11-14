import pool from '../config/db.postgres.js';

class Game{

    static async findAll(){
        const result = await pool.query("SELECT g.*, c.name as category_name FROM games as g LEFT JOIN game_Categories ON g.id_game = game_Categories.id_game LEFT JOIN categories as c ON game_Categories.id_category = c.id_category");
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query("SELECT g.*, c.name as category_name FROM games as g INNER JOIN game_Categories ON g.id_game = game_Categories.id_game INNER JOIN categories as c ON game_Categories.id_category = c.id_category WHERE g.id_game = $1", [id]);
        return result.rows[0];
    }

    static async create( name, price, description ){
        const result = await pool.query("INSERT INTO games(name, price, description) VALUES ($1, $2, $3) RETURNING *",
            [name, price, description]
        );
        return result.rows[0];
    }

    static async update(id, { name, price, description }) {
        const result = await pool.query("UPDATE games SET name = $1, price = $2, description = $3 WHERE id_game = $4 RETURNING *",
            [name, price, description, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query("DELETE FROM game_categories WHERE id_game = $1", [id]);
        const result = await pool.query("DELETE FROM games WHERE id_game = $1", [id]);
        return result.rowCount;
    }
}

export default Game;