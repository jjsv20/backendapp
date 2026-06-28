const router     = require("express").Router();
const controller = require("./restaurant.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireRole }  = require("../../middlewares/role.middleware");

// públicas — cualquiera puede ver restaurantes sin login
router.get("/", controller.listRestaurants);
router.get("/:id", controller.getRestaurantById);

module.exports = router;