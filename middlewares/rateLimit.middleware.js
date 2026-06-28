const rateLimit = require("express-rate-limit");

// Para login: más estricto (fuerza bruta)
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    success: false,
    message: "Demasiados intentos de inicio de sesión. Intenta en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Para register y verify-email: más permisivo
const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20,
  message: {
    success: false,
    message: "Demasiadas solicitudes. Intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginRateLimiter, authRateLimiter };