const errorHandler = (err, req, res, next) => {

    console.error("🔥 GLOBAL ERROR:", {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    const status = err.statusCode || 500;

    return res.status(status).json({
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || null
    });
};

module.exports = errorHandler;