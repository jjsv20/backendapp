const repository = require("./user.repository");
const AppError = require("../../utils/AppError");

const ALLOWED_FIELDS = [
    "first_name",
    "last_name",
    "username",
    "phone",
    "email",
    "birth_date",
    "gender",
    "avatar_url",
];

const GENDER_MAP = {
    male: "MASCULINO",
    female: "FEMENINO",
    other: "OTRO",
};

// =====================
// GET PROFILE
// =====================
const getProfile = async (userId) => {
    const user = await repository.findUserById(userId);

    if (!user) {
        throw new AppError("Usuario no encontrado", 404);
    }

    return user;
};

// =====================
// UPDATE PROFILE
// =====================
const updateProfile = async (userId, payload) => {
    const user = await repository.findUserById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    const allowed = [
        "first_name",
        "last_name",
        "username",
        "phone",
        "email",
        "birth_date",
        "gender",
        "avatar_url",
    ];

    const cleanPayload = Object.fromEntries(
        Object.entries(payload)
            .filter(([k]) => allowed.includes(k))
            .map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    if (cleanPayload.email) cleanPayload.email = cleanPayload.email.toLowerCase();
    if (cleanPayload.username) cleanPayload.username = cleanPayload.username.toLowerCase();

    if (cleanPayload.first_name || cleanPayload.last_name) {
        cleanPayload.full_name =
            `${cleanPayload.first_name ?? user.first_name} ${cleanPayload.last_name ?? user.last_name}`.trim();
    }

    const updated = await repository.updateUser(userId, cleanPayload);

    return updated;
};

module.exports = {
    getProfile,
    updateProfile,
};