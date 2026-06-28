const supabase = require("../../config/db");

const FIELDS = `
    id,
    user_id,
    label,
    address,
    address_details,
    city,
    state,
    country,
    latitude,
    longitude,
    is_default,
    delivery_instructions,
    created_at,
    updated_at
`;

const getAddressesByUser = async (userId) => {

    const { data, error } = await supabase
        .from("user_addresses")
        .select(FIELDS)
        .eq("user_id", userId)
        .order("is_default", {
            ascending: false,
        });

    if (error) throw error;

    return data;
};

const createAddress = async (payload) => {

    const { data, error } = await supabase
        .from("user_addresses")
        .insert(payload)
        .select(FIELDS)
        .single();

    if (error) throw error;

    return data;
};

const resetDefaultAddresses = async (userId) => {

    const { error } = await supabase
        .from("user_addresses")
        .update({
            is_default: false,
        })
        .eq("user_id", userId);

    if (error) throw error;
};

const getAddressById = async (id, userId) => {
    const { data, error } = await supabase
        .from("user_addresses")
        .select(FIELDS)
        .eq("id", id)
        .eq("user_id", userId)
        .single();

    if (error) throw error;

    return data;
};

const updateAddress = async (id, userId, payload) => {
    const { data, error } = await supabase
        .from("user_addresses")
        .update(payload)
        .eq("id", id)
        .eq("user_id", userId)
        .select(FIELDS)
        .single();

    if (error) throw error;

    return data;
};

const deleteAddress = async (id, userId) => {
    const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) throw error;
};

module.exports = {
    getAddressesByUser,
    createAddress,
    resetDefaultAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
};