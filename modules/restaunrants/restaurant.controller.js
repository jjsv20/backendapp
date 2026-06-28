const service = require("./restaurant.service");
const { success } = require("../../utils/response");

const listRestaurants = async (req, res, next) => {
    try {
        const result = await service.listRestaurants(req.query);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const getRestaurantById = async (req, res, next) => {
    try {
        const result = await service.getRestaurantById(req.params.id);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = { listRestaurants, getRestaurantById };