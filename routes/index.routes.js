const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});
const userRoutes = require("./user.routes");
router.use("/", userRoutes);

const capsuleRoutes = require("./capsule.routes");
router.use("/", capsuleRoutes);

const memoryItemRoutes = require("./memoryItem.routes");
router.use("/", memoryItemRoutes);



module.exports = router;
