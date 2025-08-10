const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});
const userRoutes = require("./user.routes");
router.use("/", userRoutes);

const capsuleRoutes = require("./capsule.routes");
router.use("/", capsuleRoutes);

const invitationRoutes = require("./invitation.routes");
router.use("/", invitationRoutes);



module.exports = router;
