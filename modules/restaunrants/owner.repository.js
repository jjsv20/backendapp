const supabase = require("../../config/db");

const createOwner = async (payload) => {
    const { data, error } = await supabase
        .from("restaurant_owners")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return data;
};

const findOwnerByEmail = async (email) => {
    const { data, error } = await supabase
        .from("restaurant_owners")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) throw error;

    return data;
};

const updateActivationToken = async (ownerId, activationToken) => {
    const { data, error } = await supabase
        .from("restaurant_owners")
        .update({
            activation_token: activationToken,
        })
        .eq("id", ownerId)
        .select()
        .single();

    if (error) throw error;

    return data;
};

module.exports = {
    createOwner,
    findOwnerByEmail,
    updateActivationToken
};