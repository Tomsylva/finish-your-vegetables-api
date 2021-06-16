const router = require("express").Router();
const Meal = require("../models/Meal.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const Session = require("../models/Session.model");
const User = require("../models/User.model");

//DISPLAYS ALL MEALS
router.get("/showAll", (req, res) => {
  Meal.find({})
    .then((allMeals) => {
      res.json(allMeals);
    })
    .catch((err) => {
      console.error(err);
    });
});

//DISPLAYS SINGLE MEAL PAGE
router.get("/:mealId", (req, res) => {
  Meal.findById(req.params.mealId)
    .populate("reservedBy")
    .then((foundMeal) => {
      res.json(foundMeal);
    })
    .catch((err) => {
      console.error(err);
    });
});

//COLLECT MEAL
router.get("/:userId/collect", (req, res) => {
  User.findById(req.params.userId)
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch((err) => {
      console.error(err);
    });
});

//RESERVES A MEAL
router.put("/:mealId", isLoggedIn, (req, res) => {
  const accessToken = req.body.token;
  const mealId = req.params.mealId;
  Session.findById(accessToken)
    .then((data) => {
      const currentUser = data.user;
      Meal.findByIdAndUpdate(
        mealId,
        {
          reserved: true,
          reservedBy: currentUser,
        },
        { new: true }
      )
        .populate("reservedBy")
        .then((reservedMeal) => {
          User.findByIdAndUpdate(currentUser, {
            $addToSet: { history: reservedMeal._id },
          })
            .then(() => {
              res.json({
                reservedMeal,
                success: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });
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

//UNRESERVES A MEAL
router.put("/:mealId/unreserve", isLoggedIn, (req, res) => {
  const accessToken = req.body.token;
  const mealId = req.params.mealId;
  console.log("1*******");
  Session.findById(accessToken)
    .then((data) => {
      console.log("2*******");
      const currentUser = data.user;
      Meal.findById(mealId).then((foundMeal) => {
        console.log("3*******");
        console.log(
          "CURRENT USER: ",
          currentUser,
          "FOUND MEAL RESERVED: ",
          foundMeal.reservedBy
        );
        if (currentUser.toString() !== foundMeal.reservedBy.toString()) {
          console.log("4*******");
          return res
            .status(500)
            .json({ errorMessage: "You do not own this meal" });
        }
        Meal.findByIdAndUpdate(
          mealId,
          {
            reserved: false,
            reservedBy: null,
          },
          { new: true }
        ).then((newMeal) => {
          console.log("5*******");
          res.json({
            newMeal,
            success: true,
          });
        });
      });
    })
    .catch((err) => {
      console.log("6******");
      console.error(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
