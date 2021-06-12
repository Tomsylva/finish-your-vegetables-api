const router = require("express").Router();
const Meal = require("../models/Meal.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const Session = require("../models/Session.model");

router.get("/:mealId", (req, res) => {
  Meal.findById(req.params.mealId)
    .then((foundMeal) => {
      res.json(foundMeal);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.put("/:mealId", (req, res) => {
  const accessToken = req.body.token;
  const mealId = req.params.mealId;
  Session.findById(accessToken)
    .then((data) => {
      const currentUser = data.user;

      Meal.findByIdAndUpdate(mealId, {
        reserved: true,
        reservedBy: currentUser,
      })
        .then((reservedMeal) => {
          res.json({ reservedMeal, success: true });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
