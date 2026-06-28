const supabase = require("../../config/db");

// =====================
// GET USER BY ID
// =====================
const findUserById = async (id) => {
    const { data, error } = await supabase
        .from("users")
        .select(`
            id, first_name, last_name, full_name,
            username, email, phone, avatar_url,
            birth_date, gender, role,
            is_verified, is_active,
            created_at, updated_at
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data;
};

// =====================
// CHECK EMAIL
// =====================
const isEmailTaken = async (email, excludeUserId) => {
    const { data } = await supabase
        .from("users")
        .select("id")
        .ilike("email", email)
        .neq("id", excludeUserId)
        .maybeSingle();

    return !!data;
};

// =====================
// CHECK USERNAME
// =====================
const isUsernameTaken = async (username, excludeUserId) => {
    const { data } = await supabase
        .from("users")
        .select("id")
        .ilike("username", username)
        .neq("id", excludeUserId)
        .maybeSingle();

    return !!data;
};

// =====================
// UPDATE USER
// =====================
const updateUser = async (id, payload) => {
    const { data, error } = await supabase
        .from("users")
        .update({
            ...payload,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};

module.exports = {
    findUserById,
    isEmailTaken,
    isUsernameTaken,
    updateUser,
};