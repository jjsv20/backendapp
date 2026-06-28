const express = require("express");
const router = express.Router();
const RestaurantsController = require("../controllers/RestaurantsController");
const auth = require("../middlewares/AuthMiddleware");

router.put("/complete/:id", auth, RestaurantsController.completeRestaurantInfo); 

module.exports = router;