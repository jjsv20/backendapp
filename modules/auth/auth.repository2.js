const supabase = require("../../config/db");

// =====================================
// FIND CUSTOMER BY EMAIL
// =====================================
const findCustomerByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, password_hash, is_verified, is_active, is_banned, role, full_name, first_name, last_name, last_login_at, failed_login_attempts")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// =====================================
// FIND CUSTOMER BY IDENTIFIER
// =====================================
const findCustomerByIdentifier = async (identifier) => {

  const sanitized = identifier
    .replace(/[^a-zA-Z0-9]/g, "");

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      username,
      phone,
      password_hash,
      is_verified,
      is_active,
      is_banned,
      role,
      full_name,
      first_name,
      last_name,
      last_login_at,
      failed_login_attempts
    `)
    .or(`username.eq.${sanitized},phone.eq.${sanitized}`)
    .maybeSingle();

  if (error) throw error;

  return data;
};

// =====================================
// FIND USER BY USERNAME
// =====================================
const findUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// =====================================
// FIND USER BY ID
// =====================================
const findUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, full_name, username, email, phone, birth_date, gender, role, is_verified, is_active, is_banned, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// =====================================
// REGISTER CUSTOMER TRANSACTION
// =====================================
const registerCustomerTransaction = async (payload) => {
  const { data, error } = await supabase.rpc("register_customer", {
    p_first_name: payload.first_name,
    p_last_name: payload.last_name,
    p_full_name: payload.full_name,
    p_username: payload.username || null,
    p_email: payload.email || null,
    p_phone: payload.phone,
    p_password_hash: payload.password_hash,
    p_role: payload.role,
  });

  if (error) throw error;
  return data;
};

const createPhoneVerification = async (payload) => {


  const { data, error } = await supabase
    .from("phone_verifications")
    .insert(payload)
    .select()
    .single();


  if (error) throw error;

  return data;

};

const findPhoneVerification = async (phone) => {


  const { data, error } = await supabase
    .from("phone_verifications")
    .select("*")
    .eq("phone", phone)
    .eq("verified", false)
    .eq("is_used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();


  if (error) return null;


  return data;

};

// =====================================
// CREATE EMAIL VERIFICATION
// =====================================
const createEmailVerification = async (payload) => {
  const { data, error } = await supabase
    .from("email_verifications")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================
// FIND VERIFICATION TOKEN
// =====================================
const findVerificationToken = async (token) => {
  const { data, error } = await supabase
    .from("email_verifications")
    .select("*")
    .eq("token_hash", token)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// =====================================
// VERIFY USER
// =====================================
const verifyUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .update({ is_verified: true, email_verified_at: new Date() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================
// MARK TOKEN USED
// =====================================
const markVerificationAsUsed = async (verificationId) => {
  const { data, error } = await supabase
    .from("email_verifications")
    .update({ is_used: true, verified_at: new Date() })
    .eq("id", verificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================
// CREATE REFRESH TOKEN
// =====================================
const createRefreshToken = async (payload) => {
  const { data, error } = await supabase
    .from("refresh_tokens")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================
// FIND REFRESH TOKEN
// =====================================
const findRefreshToken = async (tokenHash) => {

  const { data, error } =
    await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .eq("is_revoked", false)
      .maybeSingle();

  if (error) throw error;

  return data;
};

// =====================================
// REVOKE REFRESH TOKEN
// =====================================
const revokeRefreshToken = async (id) => {
  const { error } = await supabase
    .from("refresh_tokens")
    .update({ is_revoked: true })
    .eq("id", id);

  if (error) throw error;
};

// =====================================
// REVOKE ALL USER REFRESH TOKENS
// =====================================
const revokeAllUserRefreshTokens = async (userId) => {
  const { error } = await supabase
    .from("refresh_tokens")
    .update({ is_revoked: true })
    .eq("user_id", userId);

  if (error) throw error;
};

// =====================================
// UPDATE LAST LOGIN
// =====================================
const updateLastLogin = async (userId) => {
  const { error } = await supabase
    .from("users")
    .update({ last_login_at: new Date(), failed_login_attempts: 0 })
    .eq("id", userId);

  if (error) throw error;
};

// =====================================
// INCREMENT FAILED ATTEMPTS
// =====================================
const incrementFailedAttempts = async (userId) => {
  const { error } = await supabase.rpc("increment_failed_attempts", {
    p_user_id: userId,
  });
  if (error) throw error;
};

// =====================================
// UPDATE USER
// =====================================
const updateUser = async (id, payload) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: payload.first_name,
      last_name: payload.last_name,
      full_name: payload.full_name,
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      birth_date: payload.birth_date,
      gender: payload.gender,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select("id, first_name, last_name, full_name, username, email, phone, birth_date, gender, role, is_verified")
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  findCustomerByEmail,
  findCustomerByIdentifier,
  findUserById,
  findUserByUsername,
  registerCustomerTransaction,
  createPhoneVerification,
  findPhoneVerification,
  createEmailVerification,
  findVerificationToken,
  verifyUser,
  markVerificationAsUsed,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  updateLastLogin,
  incrementFailedAttempts,
  updateUser,
};