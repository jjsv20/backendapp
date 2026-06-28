// middlewares/auth.middleware.js
const jwt = require("../utils/jwt");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "No autorizado — token requerido",
        });
    }

    const parts =
        authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {
        return res.status(401).json({
            success: false,
            message: "No autorizado"
        });
    }

    const token = parts[1];
    const decoded = jwt.verifyAccessToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            code: "TOKEN_INVALID",
            message: "Token inválido o expirado",
        });
    }

    req.user = decoded; // ← { id, role }
    next();
};

module.exports = { authenticate }; // ← exporta como objeto