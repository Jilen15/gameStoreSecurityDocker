export function authenticateSession(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    req.user = req.session.user;
    next();
}
