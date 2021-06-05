const router = require("express").Router();
const Meal = require("../models/Meal.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/:mealId", (req, res) => {
  Meal.findById(req.params.mealId)
    .then((foundMeal) => {
      res.json(foundMeal);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
