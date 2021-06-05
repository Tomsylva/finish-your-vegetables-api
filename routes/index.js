const router = require("express").Router();
const authRoutes = require("./auth");
const profileRoutes = require("./profile");
const restaurantRoutes = require("./restaurant");
const mealRoutes = require("./meal");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/profile", profileRoutes);

router.use("/auth", authRoutes);

router.use("/restaurant", restaurantRoutes);

router.use("/meal", mealRoutes);

module.exports = router;
