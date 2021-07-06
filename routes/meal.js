const router = require("express").Router();
const Meal = require("../models/Meal.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const Session = require("../models/Session.model");
const User = require("../models/User.model");
const Restaurant = require("../models/Restaurant.model");

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

//SHOWS ORDER DATA
router.get("/:userId/completed", (req, res) => {
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
  Session.findById(accessToken)
    .then((data) => {
      const currentUser = data.user;
      Meal.findById(mealId).then((foundMeal) => {
        if (currentUser.toString() !== foundMeal.reservedBy.toString()) {
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
          res.json({
            newMeal,
            success: true,
          });
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

//UNRESERVES A MEAL FROM THE RESTAURANT SIDE
router.put("/:mealId/unreserve/restaurant", isLoggedIn, (req, res) => {
  const accessToken = req.body.token;
  const currentOwner = req.body.currentOwner;
  const mealId = req.params.mealId;
  Session.findById(accessToken)
    .then((data) => {
      const currentUser = data.user;
      if (currentOwner.toString() !== currentUser._id.toString()) {
        return res
          .status(500)
          .json({ errorMessage: "You do not own this restaurant" });
      }
      Meal.findByIdAndUpdate(
        mealId,
        {
          reserved: false,
          reservedBy: null,
        },
        { new: true }
      ).then((newMeal) => {
        res.json({ newMeal, success: true });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

//COMPLETES THE ORDER
router.put("/:mealId/complete", isLoggedIn, (req, res) => {
  const accessToken = req.body.token;
  const currentOwner = req.body.currentOwner;
  const mealId = req.params.mealId;
  const customerId = req.body.customerId;
  const currentRestaurant = req.body.currentRestaurant;
  Session.findById(accessToken).then((data) => {
    const currentUser = data.user;
    if (currentOwner.toString() !== currentUser._id.toString()) {
      return res
        .status(500)
        .json({ errorMessage: "You do not own this restaurant" });
    }
    Meal.findByIdAndUpdate(
      mealId,
      {
        orderCompleted: true,
      },
      { new: true }
    )
      .then((newMeal) => {
        Restaurant.findByIdAndUpdate(
          currentRestaurant,
          {
            $addToSet: { completedOrders: mealId },
            $pull: {
              meals: { $in: [mealId] },
            },
          },
          { new: true }
        )
          .populate("completedOrders")
          .then((newRestaurant) => {
            User.findByIdAndUpdate(
              customerId,
              {
                $addToSet: { completedHistory: mealId },
                $pull: {
                  history: { $in: [mealId] },
                },
              },
              { new: true }
            ).then((newUser) => {
              res.json({ newMeal, newRestaurant, newUser, success: true });
            });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ errorMessage: err.message });
      });
  });
});

module.exports = router;
