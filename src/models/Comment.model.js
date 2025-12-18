import pool from '../config/db.postgres.js';

class Comment{

    static async findAll(){
        const result = await pool.query("SELECT c.*, g.name, u.username FROM comments as c  INNER JOIN games as g ON c.id_game = g.id_game INNER JOIN users as u ON c.id_user = u.id_user");
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query("SELECT c.*, g.name, u.username FROM comments as c INNER JOIN games as g ON c.id_game = g.id_game INNER JOIN users as u ON c.id_user = u.id_user WHERE c.id_comment = $1", [id]);
        return result.rows[0];
    }

    static async create( content, note, type, id_user, id_game ){
        const result = await pool.query("INSERT INTO comments(content, note, type, id_user, id_game) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [content, note, type, id_user, id_game]
        );
        return result.rows[0];
    }

    static async update(id, { content, note, type, id_user, id_game }) {
        const result = await pool.query(
            "UPDATE comments SET content = $1, note = $2, type = $3, id_user = $4, id_game = $5 WHERE id_comment = $6 RETURNING *",
            [content, note, type, id_user, id_game, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM comments WHERE id_comment = $1", [id]);
        return result.rowCount;
    }
}

export default Comment;