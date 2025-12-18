import pool from '../config/db.postgres.js';

class Category{

    static async findAll(){
        const result = await pool.query("SELECT * FROM categories");
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query("SELECT * FROM categories WHERE id_category = $1", [id]);
        return result.rows[0];
    }

    static async create( name ){
        const result = await pool.query("INSERT INTO categories(name) VALUES ($1) RETURNING *",
            [name]
        );
        return result.rows[0];
    }

    static async update(id, { name }) {
        const result = await pool.query("UPDATE categories SET name = $1 WHERE id_category = $2 RETURNING *",
            [name, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM categories WHERE id_category = $1", [id]);
        return result.rowCount;
    }
}

export default Category;