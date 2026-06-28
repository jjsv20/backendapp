const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "No autorizado",
        });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "No tienes permiso para acceder a este recurso",
        });
    }

    next();
};

module.exports = { requireRole };