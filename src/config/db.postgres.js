import pg from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
    console.log("Chargement des variables depuis .env.test");
} else {
    dotenv.config();
    console.log("Chargement des variables depuis .env");
}

const { Pool } = pg;

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

export default pool;