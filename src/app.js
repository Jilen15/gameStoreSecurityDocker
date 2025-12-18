import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/Errors.js";
import connectMongo from "./config/db.mongo.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();
const app = express();
connectMongo();

app.use(express.json());

//Configuration de CORS
const allowedOrigins = [
  "https://localhost:3000",
  "https://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],
    credentials: true,
  })
);

//Configuration du rate limiter pour l'authentification (plus strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: "Trop de tentatives de connexion. Réessayez plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/login", authLimiter);

//Configuration du rate limiter global
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

//Redirection HTTP => HTTPS côté serveur
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

//Redirection HTTP => HTTPS côté navigateur et empêche toute utilisation de HTTP
app.use(
  helmet.hsts({
    maxAge: 86400,
    includeSubDomains: false,
  })
);

//Empêche les injections XSS déguisées
helmet.noSniff();
//Empêche les attaques de clickjacking
helmet.frameguard({ action: "deny" });
//Limiter les informations de l'url en dehors du domaine
helmet.referrerPolicy({policy: "strict-origin-when-cross-origin"});
//Limiter les interactions avec d'autres sites
helmet.crossOriginOpenerPolicy({policy: "same-origin"});
//Restreint le chargement de ressources par un autre domaine
helmet.crossOriginResourcePolicy({policy: "same-origin"});
//Isole les données du site dans le navigateur
helmet.originAgentCluster();
//Empêche les injections XSS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "defaultSrc": ["'self'"],
        "scriptSrc": ["'self'"],
        "connectSrc": ["'self'"],
        "styleSrc": ["'self'"]
      },
    },
  })
);

//Configuration de la session
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 30 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    },
  })
);

import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);

import gameRoutes from "./routes/gameRoutes.js";
app.use("/api/games", gameRoutes);

import commentRoutes from "./routes/commentRoutes.js";
app.use("/api/comments", commentRoutes);

import categoryRoutes from "./routes/categoryRoutes.js";
app.use("/api/categories", categoryRoutes);

import profileRoutes from "./routes/profileRoutes.js";
app.use("/api/profiles", profileRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.json({ message: "API OK" }));

app.use(errorHandler);

export default app;
