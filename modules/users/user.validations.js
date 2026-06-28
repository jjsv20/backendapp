const { z } = require("zod");

const updateProfileSchema = z.object({
    first_name: z.string().min(2).max(100).optional(),
    last_name: z.string().min(2).max(100).optional(),

    username: z.string().min(3).max(50).optional().nullable(),

    email: z.string().email().optional().nullable(),

    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),

    gender: z.enum(["male", "female", "other"]).optional().nullable(),

    avatar_url: z.string().url().optional().nullable(),
}).strict();

module.exports = { updateProfileSchema };