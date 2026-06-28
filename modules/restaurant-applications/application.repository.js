const supabase = require("../../config/db");

const createApplication = async (payload) => {

    const { data, error } = await supabase
        .from("restaurant_applications")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return data;
};

const getPendingApplications = async () => {
    const {data, error} = await supabase
        .from("restaurant_applications")
        .select("*")
        .eq("status", "pending")
        .order("created_at", {
            ascending: false,
        });
    
    if (error) throw error;
    return data;
}

const updateApplications = async (id, status) => {
    const {data, error} = await supabase
        .from("restaurant_applications")
        .update({
            status,
        })
        .eq("id", id)
        .select()
        .single();

    if(error) throw error;

    return data;
}

const rejectApplication = async (id) => {
    return updateApplications(id, "rejected");
}

const getMyApplication = async (userId) => {
    const {data, error} = await supabase
        .from("restaurant_applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
            ascending: false
        })
        .limit(1)
        .maybeSingle();

    if (error) throw error;

    return data;
};

module.exports = {
    createApplication,
    getPendingApplications,
    getMyApplication,
    updateApplications,
    rejectApplication,
};