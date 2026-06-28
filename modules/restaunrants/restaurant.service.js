const repository = require("./restaurant.repository");
const AppError   = require("../../utils/AppError");

const listRestaurants = async (filters) => {
    const limit = Math.min(Number(filters.limit) || 20, 50); // tope para no romper paginación
    const offset = Number(filters.offset) || 0;

    const { restaurants, total } = await repository.listRestaurants({
        ...filters,
        limit,
        offset,
    });

    return { restaurants, total, limit, offset };
};

const getRestaurantById = async (id) => {
    const restaurant = await repository.findRestaurantById(id);
    if (!restaurant) throw new AppError("Restaurante no encontrado", 404);
    return restaurant;
};

const createRestaurant = async ({ownerId, name, phone}) => {
    const restaurant = await repository.createRestaurant({
        owner_id: ownerId,
        name,
        phone,
        address: "Pendiente",
        is_open: false,
        is_active: true
    });

    return restaurant;
}

module.exports = { listRestaurants, getRestaurantById, createRestaurant };