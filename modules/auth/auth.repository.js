const supabase = require("../../config/db");

const findUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from("users")
        .select(`
            id, email, username, phone,
            password_hash, is_verified, is_active,
            is_banned, role, first_name, last_name,
            full_name, avatar_url, last_login_at,
            failed_login_attempts
        `)
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

    if (error) throw error;
    return data;
};

// ─── FIND BY IDENTIFIER (username o teléfono) ─────────────────────────────────
// Detecta el tipo fuera de la query para evitar interpolación directa en .or()
const findUserByIdentifier = async (identifier) => {
    const isPhone = /^[0-9]{10}$/.test(identifier);
    const isUsername = /^[a-zA-Z0-9_]{3,50}$/.test(identifier);

    if (!isPhone && !isUsername) return null;

    const field = isPhone ? "phone" : "username";

    const { data, error } = await supabase
        .from("users")
        .select(`
            id, email, username, phone,
            password_hash, is_verified, is_active,
            is_banned, role, first_name, last_name,
            full_name, avatar_url, last_login_at,
            failed_login_attempts
        `)
        .eq(field, identifier)
        .maybeSingle();

    if (error) throw error;
    return data;
};

// ─── FIND BY USERNAME (solo para verificar duplicado) ─────────────────────────
const findUserByUsername = async (username) => {
    const { data, error } = await supabase
        .from("users")
        .select("id, username")
        .eq("username", username)
        .maybeSingle();

    if (error) throw error;
    return data;
};

// ─── FIND BY PHONE ────────────────────────────────────────────────────────────
const findUserByPhone = async (phone) => {
    const { data, error } = await supabase
        .from("users")
        .select("id, phone")
        .eq("phone", phone)
        .maybeSingle();

    if (error) throw error;
    return data;
};

// ─── FIND BY ID ───────────────────────────────────────────────────────────────
const findUserById = async (id) => {
    const { data, error } = await supabase
        .from("users")
        .select(`
            id, first_name, last_name, full_name,
            username, email, phone, avatar_url,
            birth_date, gender, role,
            is_verified, is_active, is_banned, created_at
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data;
};

// ─── REGISTER CUSTOMER (RPC) ──────────────────────────────────────────────────
const registerCustomerTransaction = async (payload) => {
    const { data, error } = await supabase.rpc("register_customer", {
        p_first_name: payload.first_name,
        p_last_name: payload.last_name,
        p_full_name: payload.full_name,
        p_username: payload.username ?? null,
        p_email: payload.email ?? null,
        p_phone: payload.phone ?? null,
        p_password_hash: payload.password_hash,
        p_role: payload.role,
        p_is_verified: payload.is_verified ?? false,
    });

    if (error) throw error;
    return data;
};

// ─── EMAIL VERIFICATIONS ──────────────────────────────────────────────────────

// Upsert: reemplaza el código anterior del mismo usuario automáticamente
const upsertEmailVerification = async ({ user_id, code_hash, expires_at }) => {
    const { data, error } = await supabase
        .from("email_verifications")
        .upsert(
            { user_id, code_hash, expires_at, attempts: 0, is_used: false },
            { onConflict: "user_id" }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
};

const findVerificationByUserId = async (userId) => {
    const { data, error } = await supabase
        .from("email_verifications")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
};

const incrementVerificationAttempts = async (id) => {
    const { error } = await supabase.rpc("increment_verification_attempts", {
        p_id: id,
    });
    if (error) throw error;
};

const markVerificationAsUsed = async (id) => {
    const { error } = await supabase
        .from("email_verifications")
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq("id", id);

    if (error) throw error;
};

// ─── USERS — actualizaciones ──────────────────────────────────────────────────

const verifyUser = async (userId) => {
    const { error } = await supabase
        .from("users")
        .update({
            is_verified: true,
            email_verified_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) throw error;
};

const updateLastLogin = async (userId) => {
    const { error } = await supabase
        .from("users")
        .update({
            last_login_at: new Date().toISOString(),
            failed_login_attempts: 0,
        })
        .eq("id", userId);

    if (error) throw error;
};

const incrementFailedAttempts = async (userId) => {
    const { error } = await supabase.rpc("increment_failed_attempts", {
        p_user_id: userId,
    });
    if (error) throw error;
};

const updateUser = async (id, payload) => {
    const allowed = {};
    const fields = ["first_name", "last_name", "full_name", "username",
        "email", "phone", "birth_date", "gender", "avatar_url"];

    fields.forEach((f) => {
        if (payload[f] !== undefined) allowed[f] = payload[f];
    });

    const { data, error } = await supabase
        .from("users")
        .update(allowed)                  // updated_at lo maneja el trigger
        .eq("id", id)
        .select(`
            id, first_name, last_name, full_name,
            username, email, phone, avatar_url,
            birth_date, gender, role, is_verified
        `)
        .single();

    if (error) throw error;
    return data;
};

// ─── REFRESH TOKENS ───────────────────────────────────────────────────────────

const createRefreshToken = async ({ user_id, token_hash, expires_at }) => {
    const { data, error } = await supabase
        .from("refresh_tokens")
        .insert({ user_id, token_hash, expires_at })
        .select()
        .single();

    if (error) throw error;
    return data;
};

const findRefreshToken = async (tokenHash) => {
    const { data, error } = await supabase
        .from("refresh_tokens")
        .select("*")
        .eq("token_hash", tokenHash)
        .eq("is_revoked", false)
        .gt("expires_at", new Date().toISOString())  // ← descarta expirados en la query
        .maybeSingle();

    if (error) throw error;
    return data;
};

const revokeRefreshToken = async (id) => {
    const { error } = await supabase
        .from("refresh_tokens")
        .update({ is_revoked: true })
        .eq("id", id);

    if (error) throw error;
};

// Solo revoca en el dispositivo actual, no en todos
// Pasa el token_hash específico para revocar uno solo
const revokeRefreshTokenByHash = async (tokenHash) => {
    const { error } = await supabase
        .from("refresh_tokens")
        .update({ is_revoked: true })
        .eq("token_hash", tokenHash);

    if (error) throw error;
};

// ─── PHONE VERIFICATIONS ─────────────────────────────

const createPhoneVerification = async ({
    user_id,
    phone,
    code_hash,
    expires_at
}) => {

    const { data, error } =
        await supabase
            .from("phone_verifications")
            .insert({
                user_id,
                phone,
                code_hash,
                expires_at
            })
            .select()
            .single();


    if (error)
        throw error;


    return data;

};



const findPhoneVerification = async (phone) => {


    const { data, error } =
        await supabase
            .from("phone_verifications")
            .select("*")
            .eq("phone", phone)
            .eq("verified", false)
            .maybeSingle();



    if (error)
        throw error;


    return data;

};



const verifyPhoneCode = async (id) => {


    const { error } = await supabase
        .from("phone_verifications")
        .update({
            verified: true
        })
        .eq("id", id);


    if (error)
        throw error;

};

// ─── DUPLICADOS (teléfono o correo) ───────────────────────────────────────────

const findUserByContact = async (contact, type) => {
    const field = type === "phone" ? "phone" : "email";

    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq(field, contact)
        .maybeSingle();

    if (error) throw error;
    return data;
};

// ─── PENDING VERIFICATIONS (pre-registro) ─────────────────────────────────────

const createPendingVerification = async ({ contact, type, code_hash, expires_at }) => {
    // invalida cualquier código anterior activo del mismo contacto
    await supabase
        .from("pending_verifications")
        .update({ is_used: true })
        .eq("contact", contact)
        .eq("type", type)
        .eq("is_used", false);

    const { data, error } = await supabase
        .from("pending_verifications")
        .insert({ contact, type, code_hash, expires_at })
        .select()
        .single();

    if (error) throw error;
    return data;
};

const findActivePendingVerification = async (contact, type) => {
    const { data, error } = await supabase
        .from("pending_verifications")
        .select("*")
        .eq("contact", contact)
        .eq("type", type)
        .eq("is_used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
};

const incrementPendingAttempts = async (id) => {
    const { error } = await supabase.rpc("increment_pending_attempts", {
        p_id: id,
    });
    if (error) throw error;
};

const markPendingAsUsed = async (id) => {
    const { error } = await supabase
        .from("pending_verifications")
        .update({ is_used: true })
        .eq("id", id);

    if (error) throw error;
};



module.exports = {
    findUserByEmail,
    findUserByIdentifier,
    findUserByUsername,
    findUserByPhone,
    findUserById,
    registerCustomerTransaction,
    upsertEmailVerification,
    findVerificationByUserId,
    incrementVerificationAttempts,
    markVerificationAsUsed,
    verifyUser,
    updateLastLogin,
    incrementFailedAttempts,
    updateUser,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
    revokeRefreshTokenByHash,
    createPhoneVerification,
    findPhoneVerification,
    verifyPhoneCode,
    findUserByContact,
    createPendingVerification,
    findActivePendingVerification,
    incrementPendingAttempts,
    markPendingAsUsed
};

