import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/Errors.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
    rateLimit({
        windowMs: 60*1000,
        max: 10,
        message: {
            status: 429,
            message: "Trop de requêtes. Réessayez dans une minute."
        },
        standardHeaders: true,
        legacyHeaders: false
    })
);

const userRoutes = require("./routes/userRoutes.js");
app.use("/api/users", userRoutes);

const gameRoutes = require("./routes/gameRoutes.js");
app.use("/api/games", gameRoutes);

const commentRoutes = require("./routes/commentRoutes.js");
app.use("/api/comments", commentRoutes);

const categoryRoutes = require("./routes/categoryRoutes.js");
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => res.json({ message: "API OK" }));

app.use(errorHandler);

export default app;
