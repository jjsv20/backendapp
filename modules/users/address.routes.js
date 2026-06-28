const router = require("express").Router();
const controller = require("./address.controller");
const validate = require("../../middlewares/validate.middleware");
const { authenticate } = require("../../middlewares/auth.middleware");
const { addressSchema } = require("./address.validations");

router.get("/", authenticate, controller.getAddresses);
router.post("/", authenticate, validate(addressSchema), controller.addAddress);
router.put("/:id", authenticate, validate(addressSchema), controller.updateAddress)
router.delete("/:id", authenticate, controller.removeAddress)

module.exports = router;