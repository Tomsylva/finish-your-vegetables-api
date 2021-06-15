const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Restaurant = require("../models/Restaurant.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const upload = require("../middleware/cloudinary");
const Meal = require("../models/Meal.model");

router.put("/update", isLoggedIn, upload.single("userImage"), (req, res) => {
  const { username, userId } = req.body;
  const userImage = req.file.path;

  User.findByIdAndUpdate(userId, { username, userImage }, { new: true })
    .then((newUser) => {
      res.json({ user: newUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/add-restaurant", isLoggedIn, (req, res) => {
  const { userId, restaurantName, description, location, otherInfo, contact } =
    req.body;
  Restaurant.create({
    restaurantName,
    description,
    location,
    otherInfo,
    contact,
    owner: userId,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.delete("/delete", isLoggedIn, (req, res) => {
  Session.findByIdAndDelete(req.headers.authorization)
    .then((data) => {
      Restaurant.remove({ owner: data.user }).then(() => {
        Meal.remove({ reservedBy: data.user }).then(() => {
          User.findByIdAndDelete(data.user).then(() => {
            res.json({ success: true });
          });
        });
      });
      /*res.status(200).json({ message: "User was logged out" });*/
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
