const service = require("./address.service");
const { success } = require("../../utils/response");

const getAddresses = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await service.getAddresses(
                req.user.id
            );

        return success(res, result);

    } catch (error) {
        next(error);
    }
};

const addAddress = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await service.addAddress(
                req.user.id,
                req.body
            );

        return success(
            res,
            result,
            201
        );

    } catch (error) {
        next(error);
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const result = await service.updateAddress(
            req.user.id,
            req.params.id,
            req.body
        );

        return success(
            res, result
        )
    } catch (error) {
        next(error);
    }
};

const removeAddress = async (req, res, next) => {
    try {
        const result = await service.removeAddress(
            req.user.id,
            req.params.id
        );

        return success(
            res,
            result
        );

    } catch (error) {
        next(error);
    }
};

module.exports = { getAddresses, addAddress, updateAddress, removeAddress};