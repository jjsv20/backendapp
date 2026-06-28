const router = require("express").Router();
const controller = require("./user.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { updateProfileSchema } = require("./user.validations");

router.use(authenticate);

router.get("/me", controller.getProfile);
router.put("/me", validate(updateProfileSchema), controller.updateCustomerProfile);

module.exports = router;