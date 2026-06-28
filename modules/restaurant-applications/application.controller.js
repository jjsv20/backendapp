const service = require("./application.service");
const { success } = require("../../utils/response");

const createApplication = async (req, res, next) => {
    try {
        const result =
            await service.createApplication(
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

const getPendingApplications = async (req, res, next) => { 
    try {
        const result = await service.getPendingApplications();
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const approveApplication = async (req, res, next) => {
    try {
        const result = await service.approveAplication(req.params.id);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const rejectApplication = async (req, res, next) => {
    try {
        const result = await service.rejectApplication(req.params.id);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const getMyApplication = async (req, res, next) => {
    try {
        const result = await service.getMyApplication(req.user.id);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApplication,
    getPendingApplications,
    getMyApplication,
    approveApplication,
    rejectApplication
};