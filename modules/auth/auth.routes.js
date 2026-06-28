const router = require("express").Router();
const controller = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const { loginRateLimiter, authRateLimiter } = require("../../middlewares/rateLimit.middleware");
const { authenticate } = require("../../middlewares/auth.middleware");
const {
    registerCustomerSchema,
    loginCustomerSchema,
    verifyEmailSchema,
    //resendCodeSchema,
    verifyPhoneSchema,
    startVerificationSchema,
    verifyCodeSchema,
    completeRegistrationSchema,
    getProfileSchema,
    updateProfileSchema,
} = require("./auth.validations");

router.post("/register/customer", authRateLimiter, validate(registerCustomerSchema), controller.registerCustomer);
router.post("/login/customer", loginRateLimiter, validate(loginCustomerSchema), controller.loginCustomer);
router.post("/refresh", authRateLimiter, controller.refreshTokens);
router.post("/verify-email", authRateLimiter, validate(verifyEmailSchema), controller.verifyEmail);
router.post("/verify-phone", authRateLimiter, validate(verifyPhoneSchema), controller.verifyPhone);
router.post("/start-verification", authRateLimiter, validate(startVerificationSchema), controller.startVerification);
router.post("/verify-code", authRateLimiter, validate(verifyCodeSchema), controller.verifyCode);
router.post("/complete-registration", authRateLimiter, validate(completeRegistrationSchema), controller.completeRegistration);
router.get("/me", authenticate, controller.getProfile);
router.put("/me", authenticate, validate(updateProfileSchema), controller.updateProfile);
//router.post("/resend-code", authRateLimiter, validate(resendCodeSchema), controller.resendVerificationCode);
//outer.post("/resend-phone-code", authRateLimiter, validate(resendPhoneCodeSchema), controller.resendPhoneCode);

module.exports = router;
