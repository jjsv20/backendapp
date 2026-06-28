const supabase = require("../../config/db");

// ─── LISTAR RESTAURANTES ──────────────────────────────────────────────────────
const listRestaurants = async ({ search, category, isOpen, limit = 20, offset = 0 }) => {
    let query = supabase
        .from("restaurants")
        .select(`
            id, name, description, phone, address,
            latitude, longitude, image_url, is_open, is_active,
            preparation_time, rating, total_reviews,
            delivery_fee, minimum_order,
            restaurant_categories(category)
        `, { count: "exact" })
        .eq("is_active", true)
        .range(offset, offset + limit - 1)
        .order("rating", { ascending: false });

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    if (isOpen !== undefined) {
        query = query.eq("is_open", isOpen);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // filtro por categoría se hace post-query porque es relación 1-a-muchos
    const filtered = category
        ? data.filter((r) => r.restaurant_categories.some((c) => c.category === category))
        : data;

    return { restaurants: filtered, total: count };
};

const findRestaurantById = async (id) => {
    const { data, error } = await supabase
        .from("restaurants")
        .select(`
            id, owner_id, name, description, phone, address,
            latitude, longitude, image_url, is_open, is_active,
            preparation_time, max_orders, current_orders,
            rating, total_reviews, delivery_fee, minimum_order,
            max_orders, current_orders,
            restaurant_categories(category),
            restaurant_hours(day, open_time, close_time, is_closed)
        `)
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

    if (error) throw error;
    return data;
};

const createRestaurant = async (payload) => {
    const {data, error} = await supabase
        .from("restaurants")
        .insert(payload)
        .select()
        .single();
    if (error) throw error;
    return data;
}

//const updateRestaurant = async ()

module.exports = { listRestaurants, findRestaurantById, createRestaurant };