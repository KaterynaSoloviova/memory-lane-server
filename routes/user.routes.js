const router = require("express").Router();

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /users/ - Get all users

router.get("/users", isAuthenticated, (req, res) => {
    User.find()
        .then(usersFromDB => res.status(200).json(usersFromDB))
        .catch((error) => {
            console.log(" Error getting users from the DB...", error);
            res.status(500).json({ error: 'Failed to get users' });
        });
});

// GET /users/:id - Get profile Info
router.get("/users/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((userFromDB) => {
      if (!userFromDB) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = userFromDB.toObject();
      res.status(200).json(userWithoutPassword);
    })
    .catch((error) => {
      console.log("Error getting user from DB...", error);
      res.status(500).json({ error: "Failed to get user" });
    });
});

// PUT /users/:id - Edit profile
router.put("/users/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { username, email, profileImage} = req.body;

  User.findByIdAndUpdate(
    id,
    { username, email, profileImage},
    { new: true}
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser.toObject();
      res.status(200).json(userWithoutPassword);
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    });
});


// DELETE /api/users/:id - Delete account
router.delete("/users/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User account deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    });
});


module.exports = router; 