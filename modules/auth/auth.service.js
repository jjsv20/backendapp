const repository = require("./auth.repository");
const supabase = require("../../config/db");
const bcrypt = require("../../utils/bcrypt");
const jwt = require("../../utils/jwt");
const mailer = require("../../config/mailer");
const { emailVerificationTemplate, emailWelcomeTemplate } = require("./auth.templates");
const { generateSixDigitCode, hashToken } = require("../../utils/crypto");
const AppError = require("../../utils/AppError");
const sendSMS = require("../../utils/sms");

const MAX_FAILED_ATTEMPTS = 5;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_PENDING_ATTEMPTS = 5;

// ─── HELPERS PRIVADOS ─────────────────────────────────────────────────────────

const buildTokens = async (user) => {
    const accessToken = jwt.generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = jwt.generateRefreshToken({ id: user.id });

    await repository.createRefreshToken({
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return { accessToken, refreshToken };
};

const userPublicFields = (user) => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    username: user.username ?? null,
    phone: user.phone ?? null,
    email: user.email ?? null,
    role: user.role,
    avatar_url: user.avatar_url ?? null,
});

/*─── REGISTER CUSTOMER ────────────────────────────────────────────────────────

const registerCustomer = async (payload) => {
    const { first_name, last_name, username, phone, pin } = payload;

    // Verificar duplicados antes de hashear — ahorra CPU si ya existe
    const phoneExists = await repository.findUserByPhone(phone);
    if (phoneExists) throw new AppError("El teléfono ya está registrado", 409);

    if (username) {
        const usernameExists = await repository.findUserByUsername(username);
        if (usernameExists) throw new AppError("El username ya está en uso", 409);
    }

    const password_hash = await bcrypt.hashPassword(pin);
    const full_name = `${first_name.trim()} ${last_name.trim()}`;

    const newUser = await repository.registerCustomerTransaction({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        full_name,
        username: username?.trim() ?? null,
        email: null,
        phone,
        password_hash,
        role: "customer",
    });

    //await repository.updateLastLogin(newUser.id);

    const code =
        generateSixDigitCode();


    const codeHash =
        await bcrypt.hashPassword(code);



    await repository.createPhoneVerification({

        user_id: newUser.id,

        phone: newUser.phone,

        code_hash: codeHash,

        expires_at:
            new Date(Date.now() + 15 * 60 * 1000)

    });


    await sendSMS(newUser.phone, code);

    return {
        message: "Código enviado al teléfono",
        user_id: newUser.id,
        phone: newUser.phone
    };
};*/

// ─── LOGIN CUSTOMER ───────────────────────────────────────────────────────────

const loginCustomer = async ({ identifier, pin }) => {
    const user = await repository.findUserByIdentifier(identifier);

    // Mensaje genérico siempre — no revelar si el usuario existe
    const invalidError = new AppError("Credenciales inválidas", 401);

    if (!user) throw invalidError;

    if (user.is_banned) throw new AppError("Tu cuenta ha sido suspendida. Contacta soporte.", 403);
    if (!user.is_active) throw new AppError("Tu cuenta está desactivada.", 403);

    if (user.failed_login_attempts >= MAX_FAILED_ATTEMPTS) {
        throw new AppError("Cuenta bloqueada. Demasiados intentos fallidos.", 423);
    }

    const isValid = await bcrypt.comparePassword(pin, user.password_hash);

    if (!isValid) {
        await repository.incrementFailedAttempts(user.id);
        throw invalidError;
    }

    await repository.updateLastLogin(user.id);

    // Solo genera tokens nuevos — no revoca los de otros dispositivos
    const { accessToken, refreshToken } = await buildTokens(user);

    return {
        accessToken,
        refreshToken,
        user: userPublicFields(user),
    };
};

// ─── REFRESH TOKENS ───────────────────────────────────────────────────────────

const refreshTokens = async (token) => {
    if (!token) throw new AppError("Refresh token requerido", 400);

    const decoded = jwt.verifyRefreshToken(token);
    if (!decoded) throw new AppError("Sesión expirada. Inicia sesión nuevamente.", 401);

    const tokenHash = hashToken(token);
    const storedToken = await repository.findRefreshToken(tokenHash);

    if (!storedToken) throw new AppError("Sesión inválida", 401);

    const user = await repository.findUserById(decoded.id);

    if (!user || !user.is_active || user.is_banned) {
        throw new AppError("Usuario no disponible", 401);
    }

    // Rotación: revocar el usado, emitir uno nuevo
    await repository.revokeRefreshToken(storedToken.id);

    const { accessToken, refreshToken: newRefreshToken } = await buildTokens(user);

    return {
        accessToken,
        refreshToken: newRefreshToken,
        user: userPublicFields(user),
    };
};

const verifyPhone = async ({
    phone,
    code
}) => {


    const verification =
        await repository.findPhoneVerification(phone);


    if (!verification)
        throw new AppError(
            "Código inválido",
            400
        );



    if (
        new Date() >
        new Date(verification.expires_at)
    ) {

        throw new AppError(
            "Código expirado",
            400
        );

    }



    const valid =
        await bcrypt.comparePassword(
            code,
            verification.code_hash
        );


    if (!valid)
        throw new AppError(
            "Código incorrecto",
            400
        );



    await supabase
        .from("users")
        .update({
            is_verified: true
        })
        .eq(
            "id",
            verification.user_id
        );



    await repository.verifyPhoneCode(
        verification.id
    );



    const user =
        await repository.findUserById(
            verification.user_id
        );



    const tokens =
        await buildTokens(user);



    return {

        message: "Teléfono verificado",

        ...tokens,

        user: userPublicFields(user)

    };


};

// ─── PASO 1: ENVIAR CÓDIGO (teléfono o correo) ────────────────────────────────

const startVerification = async ({ contact, type }) => {
    const exists = await repository.findUserByContact(contact, type);
    if (exists) {
        throw new AppError(
            type === "phone" ? "El teléfono ya está registrado" : "El correo ya está registrado",
            409
        );
    }

    const code = generateSixDigitCode();
    const codeHash = await bcrypt.hashPassword(code);

    await repository.createPendingVerification({
        contact,
        type,
        code_hash: codeHash,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    if (type === "phone") {
        await sendSMS(contact, code);
    } else {
        await mailer.sendEmail({
            to: contact,
            subject: "Tu código de verificación",
            html: emailVerificationTemplate(code),
        });
    }

    return { message: "Código enviado", contact, type };
};

// ─── PASO 2: VERIFICAR CÓDIGO → devuelve verification_token ──────────────────

const verifyCode = async ({ contact, type, code }) => {
    const verification = await repository.findActivePendingVerification(contact, type);
    if (!verification) throw new AppError("Código inválido", 400);

    if (new Date() > new Date(verification.expires_at)) {
        throw new AppError("Código expirado", 410);
    }

    if (verification.attempts >= MAX_PENDING_ATTEMPTS) {
        throw new AppError("Demasiados intentos. Solicita un nuevo código.", 429);
    }

    const isValid = await bcrypt.comparePassword(code, verification.code_hash);

    if (!isValid) {
        await repository.incrementPendingAttempts(verification.id);
        throw new AppError("Código incorrecto", 400);
    }

    await repository.markPendingAsUsed(verification.id);

    const verification_token = jwt.generateVerificationToken({ contact, contactType: type });

    return { message: "Verificado", verification_token };
};

// ─── PASO 3: COMPLETAR REGISTRO (ya verificado) ───────────────────────────────

const completeRegistration = async (payload) => {
    const { verification_token, first_name, last_name, username, pin } = payload;

    const decoded = jwt.verifyVerificationToken(verification_token);
    if (!decoded) throw new AppError("Verificación expirada o inválida. Empieza de nuevo.", 401);

    const { contact, contactType } = decoded;

    // re-chequeo por si alguien más se registró mientras tanto
    const exists = await repository.findUserByContact(contact, contactType);
    if (exists) throw new AppError("Ese contacto ya fue registrado", 409);

    if (username) {
        const usernameExists = await repository.findUserByUsername(username);
        if (usernameExists) throw new AppError("El username ya está en uso", 409);
    }

    const password_hash = await bcrypt.hashPassword(pin);
    const full_name = `${first_name.trim()} ${last_name.trim()}`;

    const newUser = await repository.registerCustomerTransaction({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        full_name,
        username: username?.trim() ?? null,
        email: contactType === "email" ? contact : null,
        phone: contactType === "phone" ? contact : null,
        password_hash,
        role: "customer",
        is_verified: true,
    });

    try {
        mailer.nuevoUsuarioRegistrado({
            name: newUser.full_name,
            role: newUser.role,
            phone: newUser.phone,
            email: newUser.email
        });
    } catch (err) {
        console.error("Error notificando administrador:", err);
    };

    const tokens = await buildTokens(newUser);

    return {
        message: "Registro completado",
        ...tokens,
        user: userPublicFields(newUser),
    };
}

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────

const verifyEmail = async ({ email, code }) => {
    const user = await repository.findUserByEmail(email);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    if (user.is_verified) throw new AppError("El correo ya fue verificado", 400);

    const verification = await repository.findVerificationByUserId(user.id);
    if (!verification || verification.is_used) {
        throw new AppError("Código inválido o ya utilizado", 400);
    }

    if (new Date() > new Date(verification.expires_at)) {
        throw new AppError("El código ha expirado. Solicita uno nuevo.", 410);
    }

    if (verification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
        throw new AppError("Demasiados intentos. Solicita un nuevo código.", 429);
    }

    const isValid = await bcrypt.comparePassword(code, verification.code_hash);

    if (!isValid) {
        await repository.incrementVerificationAttempts(verification.id);
        throw new AppError("Código incorrecto", 400);
    }

    await repository.verifyUser(user.id);
    await repository.markVerificationAsUsed(verification.id);

    return { message: "Correo verificado exitosamente" };
};

// ─── RESEND CODE ──────────────────────────────────────────────────────────────

const resendVerificationCode = async (email) => {
    const user = await repository.findUserByEmail(email);

    if (!user) throw new AppError("Correo no registrado", 404);
    if (user.is_verified) throw new AppError("El correo ya está verificado", 400);

    const code = generateSixDigitCode();
    const codeHash = await bcrypt.hashPassword(code);   // bcrypt para poder comparar con compare()

    await repository.upsertEmailVerification({
        user_id: user.id,
        code_hash: codeHash,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    await mailer.sendEmail({
        to: user.email,
        subject: "Tu código de verificación",
        html: emailVerificationTemplate(code),
    });

    return { message: "Código enviado a tu correo" };
};

// ─── GET PROFILE ───────────────────────────────────────────────────────────────

const getProfile = async (userId) => {
    const user = await repository.findUserById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    return user;
};

// ─── UPDATE PROFILE ─────────────────────────────────────────────────────────────

const updateProfile = async (userId, payload) => {
    if (payload.username) {
        const exists = await repository.findUserByUsername(payload.username);
        if (exists && exists.id !== userId) {
            throw new AppError("El username ya está en uso", 409);
        }
    }

    const updated = await repository.updateUser(userId, payload);
    return updated;
};

module.exports = {
    //registerCustomer,
    loginCustomer,
    refreshTokens,
    verifyEmail,
    verifyPhone,
    startVerification,
    verifyCode,
    completeRegistration,
    resendVerificationCode,
    getProfile,
    updateProfile
};