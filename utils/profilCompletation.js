export const getProfileCompletion = (user) => {
    const fields = [
        { key: "email", label: "Correo electrónico" },
        { key: "birthdate", label: "Fecha de nacimiento" },
        { key: "gender", label: "Género" },
        { key: "avatar_url", label: "Foto de perfil" }
    ];

    const completed = fields.filter(f => ! !user?.[f.key]);
    const missing = fields.filter(f => ! user?.[f.key]);
    const percentage = Math.round((completed.length / fields.length) * 100);

    return { percentage, missing: missing.length === 0 };
};