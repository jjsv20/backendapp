require("dotenv").config();
const app = require("./index");

const port = process.env.PORT || 4000;

app.use((err, req, res, next) => {
    console.error("🔥 ERROR:", err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
        error: err.details || null,
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});