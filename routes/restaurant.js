const router = require("express").Router();
const Meal = require("../models/Meal.model");
const Restaurant = require("../models/Restaurant.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", (req, res) => {
  Restaurant.find({}).then((allRestaurants) => {
    res.json(allRestaurants);
  });
});

router.get("/:id", (req, res) => {
  Restaurant.findOne({ restaurantName: req.params.id })
    .populate("meals")
    .then((restaurant) => {
      res.json(restaurant);
    });
});

router.post("/meal", isLoggedIn, (req, res) => {
  const { mealName, description, otherInfo, mealType, price, restaurant } =
    req.body;
  Meal.create({
    mealName,
    description,
    otherInfo,
    mealType,
    price,
  })
    .then((response) => {
      console.log("response from restaurant.js: ", response);
      Restaurant.findByIdAndUpdate(restaurant, {
        $push: { meals: response._id },
      }).catch((err) => {
        console.error(err);
      });
      res.json(response);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
