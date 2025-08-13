const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// GET /api/health
router.get("/health", (req, res, next) => {
  // send ping to prevent inactivity on mongodb atlas
  mongoose.connection.db
    .admin()
    .ping()
    .then(() => {
      res
        .status(200)
        .json({ status: "ok", timestamp: new Date().toISOString() });
    })
    .catch((err) => {
      console.error("MongoDB ping failed:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to connect to MongoDB",
      });
    });
});

const userRoutes = require("./user.routes");
router.use("/", userRoutes);

const capsuleRoutes = require("./capsule.routes");
router.use("/", capsuleRoutes);

const invitationRoutes = require("./invitation.routes");
router.use("/", invitationRoutes);

const commentRoutes = require("./comment.routes.js");
router.use("/", commentRoutes);

module.exports = router;
