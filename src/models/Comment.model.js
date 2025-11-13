import pool from '../config/db.postgres.js';

class Comment{

    static async findAll(){
        const result = await pool.query("SELECT c.*, g.name, u.username FROM comments as c  INNER JOIN games as g ON c.id_game = g.id_game INNER JOIN users as u ON c.id_user = u.id_user");
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query("SELECT c.*, g.name, u.username FROM comments as c INNER JOIN games as g ON c.id_game = g.id_game INNER JOIN users as u ON c.id_user = u.id_user WHERE g.id_game = $1", [id]);
        return result.rows[0];
    }

    static async create( content, note, type ){
        const result = await pool.query("INSERT INTO comments(content, note, type) VALUES ($1, $2, $3) RETURNING ",
            [content, note, type]
        );
        return result.rows[0];
    }

    static async update(id, { content, note, type }) {
        const result = await pool.query("UPDATE comments SET content = $1, note = $2, type = $3 WHERE id = $4 RETURNING",
            [content, note, type, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query("DELETE comments WHERE id = $1", [id]);
    }
}

export default Comment;