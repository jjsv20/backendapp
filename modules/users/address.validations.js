const { z } = require("zod");

const addressSchema = z.object({

    label: z.string()
        .trim()
        .min(2)
        .max(50),

    address: z.string()
        .trim()
        .min(5)
        .max(300),

    address_details: z.string()
        .trim()
        .max(300)
        .optional()
        .nullable(),

    city: z.string()
        .trim()
        .min(2)
        .max(100),

    state: z.string()
        .trim()
        .max(100)
        .optional()
        .nullable(),

    country: z.string()
        .trim()
        .max(100)
        .default("Colombia"),

    latitude: z.number()
        .optional()
        .nullable(),

    longitude: z.number()
        .optional()
        .nullable(),

    is_default: z.boolean()
        .optional(),

    delivery_instructions: z.string()
        .trim()
        .max(500)
        .optional()
        .nullable(),

}).strict();

module.exports = {
    addressSchema,
};