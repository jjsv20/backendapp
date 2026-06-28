const service = require("./user.service");
const { success } = require("../../utils/response");

// GET /me
const getProfile = async (req, res, next) => {
    try {
        const result = await service.getProfile(req.user.id);
        return success(res, result);
    } catch (err) {
        next(err);
    }
};

// PUT /me
const updateCustomerProfile = async (req, res, next) => {
    try {
        const result = await service.updateProfile(req.user.id, req.body);

        return res.json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateCustomerProfile,
};