const router = require("express").Router();
const Meal = require("../models/Meal.model");
const Restaurant = require("../models/Restaurant.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const Session = require("../models/Session.model");
const upload = require("../middleware/cloudinary");

//SHOWS ALL RESTAURANTS
router.get("/", (req, res) => {
  Restaurant.find({})
    .populate("meals")
    .then((allRestaurants) => {
      res.json(allRestaurants);
    });
});

//SHOWS THE SINGLE RESTAURANT SELECTED
router.get("/:id", (req, res) => {
  Restaurant.findOne({ restaurantName: req.params.id })
    .populate("meals")
    .populate("completedOrders")
    .then((restaurant) => {
      res.json(restaurant);
    });
});

//POSTS A MEAL ON THE RESTAURANT PAGE
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
              res.status(400).json({ err });
            });
            res.json(response);
          })
          .catch((err) => {
            res.status(400).json({ err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

//UPDATES CURRENT RESTAURANT
router.put("/:restaurantId", isLoggedIn, (req, res) => {
  const { restaurantName, description, otherInfo, location } = req.body;
  const accessToken = req.headers.authorization;
  Session.findById(accessToken)
    .then((data) => {
      const currentUser = data.user;

      Restaurant.findById(req.params.restaurantId).then((foundRestaurant) => {
        if (foundRestaurant.owner.toString() == currentUser.toString()) {
          Restaurant.findByIdAndUpdate(req.params.restaurantId, {
            restaurantName,
            description,
            otherInfo,
            location,
          })
            .then((updatedRestaurant) => {
              res.json({ updatedRestaurant, success: true });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ errorMessage: err.message });
            });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err.message });
    });
});

//UPDATES RESTAURANT IMAGE
router.put(
  "/:restaurantId/image",
  isLoggedIn,
  upload.single("image"),
  (req, res) => {
    const image = req.file.path;
    const restaurantId = req.params.restaurantId;
    const accessToken = req.headers.authorization;
    Session.findById(accessToken)
      .then((data) => {
        const currentUser = data.user;
        Restaurant.findById(restaurantId).then((foundRestaurant) => {
          if (foundRestaurant.owner.toString() === currentUser.toString()) {
            Restaurant.findByIdAndUpdate(
              restaurantId,
              { image: image },
              { new: true }
            )
              .then((updatedRestaurant) => {
                res.json({ updatedRestaurant, success: true });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
      })
      .catch((err) => {
        res.status(500).json({ errorMessage: err.message });
      });
  }
);

//DELETE A MEAL FROM THE RESTAURANT PAGE
router.delete("/:restaurantId/meal/:mealId", isLoggedIn, (req, res) => {
  const accessToken = req.headers.authorization;
  Session.findById(accessToken).then((data) => {
    const currentUser = data.user;

    Restaurant.findById(req.params.restaurantId).then((foundRestaurant) => {
      if (foundRestaurant.owner.toString() == currentUser.toString()) {
        Meal.findByIdAndDelete(req.params.mealId)
          .then(() => {
            Restaurant.findByIdAndUpdate(req.params.restaurantId, {
              $pull: {
                meals: { $in: [req.params.mealId] },
              },
            });
            res.json({ success: true });
          })
          .catch((err) => {
            res.status(500).json({ errorMessage: err.message });
          });
      }
    });
  });
});

//DELETE A RESTAURANT FROM THE DATABSE
router.delete("/:restaurantId/delete", isLoggedIn, (req, res) => {
  const accessToken = req.headers.authorization;
  Session.findById(accessToken)
    .then((data) => {
      const currentUser = data.user;

      Restaurant.findById(req.params.restaurantId).then((foundRestaurant) => {
        if (foundRestaurant.owner.toString() == currentUser.toString()) {
          Restaurant.findByIdAndDelete(req.params.restaurantId)
            .then(() => {
              res.json({ success: true });
            })
            .catch((err) => {
              // MAYBE send an error message to the frontend to display????
              console.error(err);
            });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
