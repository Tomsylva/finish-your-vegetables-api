const router = require("express").Router();
const Meal = require("../models/Meal.model");
const Restaurant = require("../models/Restaurant.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const { response } = require("express");

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
  const {
    mealName,
    description,
    otherInfo,
    mealType,
    price,
    restaurant,
    userId,
  } = req.body;

  // console.log("userId", userId);
  // console.log("restaurant:", restaurant);

  // Meal.create({
  //   mealName,
  //   description,
  //   otherInfo,
  //   mealType,
  //   price,
  // })
  //   .then((response) => {
  //     console.log("response from restaurant.js: ", response);
  //     Restaurant.findByIdAndUpdate(restaurant, {
  //       $push: { meals: response._id },
  //     }).catch((err) => {
  //       console.error(err);
  //     });
  //     res.json(response);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  Restaurant.findById(restaurant)
    .then((foundRestaurant) => {
      if (foundRestaurant.owner == userId) {
        Meal.create({
          mealName,
          description,
          otherInfo,
          mealType,
          price,
        })
          .then((response) => {
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
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
