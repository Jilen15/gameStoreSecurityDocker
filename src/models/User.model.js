import pool from "../config/db.postgres.js";

class User{

    static async findAll(){
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query(`SELECT u.*, r.name AS roleName
                                         FROM users AS u 
                                         INNER JOIN roles AS r 
                                         ON u.id_role = r.id_role 
                                         WHERE id_user = $1`, 
                                         [id]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    }

    static async create( username, email, password, id_role ){
        const result = await pool.query("INSERT INTO users(username, email, password, id_role) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, email, password, id_role]
        );
        return result.rows[0];
    }

    static async update(id, { username, email, password }) {
        const result = await pool.query("UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [username, email, password, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query("DELETE users WHERE id = $1", [id]);
    }
}

export default User;