const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /users/ - Get all users
router.get("/users", isAuthenticated, (req, res) => {
  User.find()
    .then(usersFromDB => res.status(200).json(usersFromDB))
    .catch((err) => {
      console.error("Get users: Error getting users from the DB...", err);
      res.status(500).json({ error: err.message });
    });
});

// GET /users/:id - Get profile Info
router.get("/users/:id", isAuthenticated, (req, res) => {
  const { id: userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User id is invalid" });
  }

  User.findById(userId)
    .then((userFromDB) => {
      if (!userFromDB) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = userFromDB.toObject();
      res.status(200).json(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Get user: Error getting user from DB...", err);
      res.status(500).json({ error: err.message });
    });
});

// PUT /users/:id - Edit profile
router.put("/users/:id", isAuthenticated, (req, res) => {
  const { id: userId } = req.params;
  const { username, email, profileImage } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User id is invalid" });
  }

  User.findByIdAndUpdate(
    userId,
    { username, email, profileImage },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser.toObject();
      res.status(200).json(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Update user: Error updating user:", err);
      res.status(500).json({ error: err.message });
    });
});


// DELETE /api/users/:id - Delete account
router.delete("/users/:id", isAuthenticated, (req, res) => {
  const { id: userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "User id is invalid" });
  }

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User account deleted successfully" });
    })
    .catch((err) => {
      console.error("Delete user: Error deleting user:", err);
      res.status(500).json({ error: err.message });
    });
});


module.exports = router; 