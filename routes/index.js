const router = require("express").Router();
const authRoutes = require("./auth");
const profileRoutes = require("./profile");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/profile", profileRoutes);

router.use("/auth", authRoutes);

module.exports = router;
