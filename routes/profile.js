const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Restaurant = require("../models/Restaurant.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.put("/update", isLoggedIn, (req, res) => {
  const { username, userId } = req.body;
  User.findByIdAndUpdate(userId, { username }, { new: true })
    .then((newUser) => {
      res.json({ user: newUser });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/add-restaurant", isLoggedIn, (req, res) => {
  const {
    // username,
    userId,
    restaurantName,
    description,
    location,
    otherInfo,
    contact,
  } = req.body;
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
      console.log(data);
      User.findByIdAndDelete(data.user).then(() => {
        res.json({ success: true });
      });
      /*res.status(200).json({ message: "User was logged out" });*/
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err.message });
    });
});

module.exports = router;
