import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé : aucun token fourni" });
    }

    jwt.verify(token, JWT_SECRET, (e, user) => {
        if (e) {
            return res.status(403).json({ message: "Token invalide ou expiré" });
        }

        req.user = user;
        next();
    });
}
