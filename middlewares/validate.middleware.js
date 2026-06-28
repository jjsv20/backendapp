const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {

        const formatted = result.error.issues.reduce((acc, issue) => {
            const key = issue.path?.[0] || "root";

            if (!acc[key]) acc[key] = [];
            acc[key].push(issue.message);

            return acc;
        }, {});

        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: formatted,
        });
    }

    req.body = result.data;
    next();
};

module.exports = validate;