import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.postgres.js";
import 'dotenv/config';


beforeAll(async () => {
  await pool.query('DELETE FROM games');
  await pool.query("INSERT INTO games (name, price, description) VALUES ('Zelda', 12.0, salut), ('Mario', 13, 'Platform')");
});

afterAll(async () => {
  await pool.end();
});

test('GET /api/games', async () => {
  const games = await request(app).get('/api/games').then(res => res.body);
  expect(games.length).toBe(2);
  expect(games[0]).toHaveProperty('name');
});