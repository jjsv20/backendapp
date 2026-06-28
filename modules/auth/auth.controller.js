const authService = require("./auth.service");
const { success } = require("../../utils/response");

const registerCustomer = async (req, res, next) => {
  try {
    const result = await authService.registerCustomer(req.body);
    return success(res, result, 201);
  } catch (error) {
    next(error);
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const result = await authService.loginCustomer(req.body);
    return success(res, result);
  } catch (error) {
    next(error);
  }
};

const refreshTokens = async (req, res, next) => {
  try {
    const result = await authService.refreshTokens(req.body.refreshToken);
    return success(res, result);
  } catch (error) {
    next(error);
  }
};

const verifyPhone = async (req, res, next) => {

  try {

    const result =
      await authService.verifyPhone(req.body);


    return success(res, result);


  } catch (e) {

    next(e);

  }

}

const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.body.token);
    return success(res, result);
  } catch (error) {
    next(error);
  }
};

const resendVerificationCode = async (req, res, next) => {
  try {
    const result = await authService.resendVerificationCode(req.body.email);
    return success(res, result);
  } catch (error) {
    next(error);
  }
};

const startVerification = async (req, res, next) => {
    try {
        const result = await authService.startVerification(req.body);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const verifyCode = async (req, res, next) => {
    try {
        const result = await authService.verifyCode(req.body);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const completeRegistration = async (req, res, next) => {
    try {
        const result = await authService.completeRegistration(req.body);
        return success(res, result, 201);
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const result = await authService.getProfile(req.user.id);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const result = await authService.updateProfile(req.user.id, req.body);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  refreshTokens,
  verifyPhone,
  verifyEmail,
  resendVerificationCode,
  startVerification,
  verifyCode,
  completeRegistration,
  getProfile,
  updateProfile
};