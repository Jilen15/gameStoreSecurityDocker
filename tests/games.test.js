import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.postgres.js";

let userToken;
let adminToken;
let existingGameId;

beforeAll(async () => {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE games RESTART IDENTITY CASCADE');

    await pool.query("INSERT INTO roles (name) VALUES ('admin'), ('user')");

    await request(app).post("/api/auth/register").send({
      username: "UserTest",
      email: "user@test.com",
      password: "password123",
      id_role: 2
    });

    await request(app).post("/api/auth/register").send({
      username: "AdminTest",
      email: "admin@test.com",
      password: "admin123",
      id_role: 1
    });

    const userLogin = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "password123"
    });
    userToken = userLogin.body.token;

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "admin123"
    });
    adminToken = adminLogin.body.token;

    console.log("ADMIN LOGIN:", adminLogin.body);
    console.log("USER LOGIN:", userLogin.body);

    await pool.query("INSERT INTO categories(name) VALUES ('Action')");

    const zelda = await request(app)
      .post("/api/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Zelda", price: 12.0, description: "Adventure" });
    console.log("Zelda POST:", zelda.status, zelda.body);

    await pool.query(
        "INSERT INTO game_Categories(id_game, id_category) VALUES ($1, $2)",
        [zelda.body.id_game, 1]
    );

    const mario = await request(app)
      .post("/api/games")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Mario", price: 13.0, description: "Platform" });
    console.log("Mario POST:", mario.status, mario.body);

    const res = await request(app)
      .get("/api/games")
      .set("Authorization", `Bearer ${adminToken}`);
    console.log("GET /api/games:", res.status, res.body);

    if (res.body.length > 0) {
      existingGameId = res.body[0].id_game;
      console.log("Existing game ID:", existingGameId);
    } else {
      throw new Error("Aucun jeu trouvé après insertion");
    }
});


afterAll(async () => {
    await pool.end();
});

describe("Tests sécurisés /api/games", () => {

    test("GET /api/games sans token => 401", async () => {
        const res = await request(app).get("/api/games");
        expect(res.status).toBe(401);
    });

    test("GET /api/games avec token user => 200", async () => {
        const res = await request(app)
          .get("/api/games")
          .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("GET /api/games/:id sans token => 401", async () => {
        const res = await request(app).get(`/api/games/${existingGameId}`);
        expect(res.status).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });

    test("GET /api/games/:id avec token user => 200", async () => {
        const res = await request(app)
          .get(`/api/games/${existingGameId}`)
          .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
    });

    test("POST /api/games avec token user (non admin) => 403", async () => {
        const res = await request(app)
          .post("/api/games")
          .set("Authorization", `Bearer ${userToken}`)
          .send({ name: "Sonic", price: 10, description: "Fast" });
        expect(res.status).toBe(403);
    });

    test("POST /api/games avec token admin => 201", async () => {
        const res = await request(app)
          .post("/api/games")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ name: "Metroid", price: 15, description: "Space" });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("name", "Metroid");
    });

    test("PUT /api/games/:id avec token user (non admin) => 403", async () => {
        const res = await request(app)
          .put(`/api/games/${existingGameId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ name: "Zelda Updated", price: 18.0 });
        expect(res.status).toBe(403);
        expect(res.body.message).toMatch(/non autorisé/i);
    });

    test("PUT /api/games/:id avec token admin => 200", async () => {
        const res = await request(app)
          .put(`/api/games/${existingGameId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ name: "Zelda Updated", price: 18.0, description: "Adventure" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Zelda Updated");
    });

    test("DELETE /api/games/:id sans token admin => 403", async () => {
        const res = await request(app)
          .delete(`/api/games/${existingGameId}`)
          .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(403);
        expect(res.body.message).toMatch(/non autorisé/i);
    });

    test("DELETE /api/games/:id avec token admin => 204", async () => {
        const res = await request(app)
          .delete(`/api/games/${existingGameId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(204);
    });
});
