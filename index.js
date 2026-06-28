const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const restaurantRoutes = require("./modules/restaunrants/restaurant.routes");
const addressRoutes = require("./modules/users/address.routes");
const applicationRoutes = require("./modules/restaurant-applications/application.routes")

const app = express();

// =====================================
// SEGURIDAD EXPRESS
// =====================================

// Oculta tecnología backend
app.disable("x-powered-by");

// Trust proxy
app.set("trust proxy", 1);

// =====================================
// HELMET
// =====================================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// =====================================
// CORS
// =====================================

const allowedOrigins = [
  "http://localhost:8081",
  "exp://192.168.18.34:8081",
];

app.use(
  cors({
    origin: (origin, callback) => {

      // React Native normalmente no envía origin
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS bloqueado")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],

    credentials: true,
  })
);

// =====================================
// BODY LIMIT
// =====================================

app.use(
  express.json({
    limit: "10kb",
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Demasiados intentos. Intenta más tarde."
  }
});

app.use("/api/auth", authLimiter);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// =====================================
// PROTECCIONES EXTRA
// =====================================

app.use(hpp());

app.use(compression());

// =====================================
// RUTAS
// =====================================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurantes", restaurantRoutes);
app.use("/api/direcciones", addressRoutes);
app.use("/api/restaurant-applications", applicationRoutes);
// =====================================
// 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use(errorHandler);

module.exports = app;