const router = require("express").Router();
const controller = require("./application.controller");
const validate = require("../../middlewares/validate.middleware");
const {authenticate,} = require("../../middlewares/auth.middleware");
const {applicationSchema,} = require("./application.validations");

router.post("/", authenticate, validate(applicationSchema), controller.createApplication);
router.get("/", authenticate, controller.getPendingApplications);
router.patch("/:id/approved", authenticate, controller.approveApplication);
router.patch("/:id/reject", authenticate, controller.rejectApplication);
router.get("/me", authenticate, controller.getMyApplication);

module.exports = router;