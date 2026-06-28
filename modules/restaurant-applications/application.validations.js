const { z } = require("zod");

const applicationSchema = z.object({

    owner_name: z.string()
        .trim()
        .min(3)
        .max(100),

    restaurant_name: z.string()
        .trim()
        .min(3)
        .max(150),

    business_email: z.string()
        .email(),

    restaurant_phone: z.string()
        .trim()
        .min(10)
        .max(10),

    city: z.string()
        .trim()
        .min(2)
        .max(100),

    notes: z.string()
        .trim()
        .max(500)
        .optional()
        .nullable(),

}).strict();

module.exports = {
    applicationSchema,
};