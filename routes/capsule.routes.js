const router = require("express").Router();

const TimeCapsule = require("../models/TimeCapsule.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Post/api/capsules/ - create a new capsule

router.post("/capsules", isAuthenticated, (req, res) => {
  const {
    title,
    description,
    unlockedDate,
    isPublic,
    isLocked,
    participants,
    items,
  } = req.body;

  TimeCapsule.create({
    title,
    description,
    unlockedDate,
    isPublic,
    isLocked,
    participants,
    items,
    createdBy: req.payload._id,
  })
    .then((newCapsule) => res.status(201).json(newCapsule))
    .catch((error) => {
      console.error("Error creating capsule:", error);
      res.status(400).json({ error: error.message });
    });
});

// GET /api/capsules
router.get("/capsules", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  TimeCapsule.find({
    $or: [{ createdBy: userId }, { participants: userId }],
  })
    .populate("createdBy", "username")
    .populate("participants", "username")
    .populate("items")
    .then((capsules) => res.json(capsules))
    .catch((error) => {
      console.error("Error fetching capsules:", error);
      res.status(500).json({ error: "Failed to fetch capsules" });
    });
});

// GET /api/capsules/:id
router.get("/capsules/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;

  TimeCapsule.findById(id)
    .populate("createdBy", "name")
    .populate("participants", "name")
    .then((capsule) => {
      if (
        !capsule ||
        (capsule.createdBy._id.toString() !== userId &&
          !capsule.participants.includes(userId))
      ) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      res.json(capsule);
    })
    .catch((error) => {
      console.error("Error getting capsule:", error);
      res.status(500).json({ error: "Failed to get capsule" });
    });
});

// GET all public unlocked capsules
router.get("/public", (req, res) => {
  const now = new Date();

  TimeCapsule.find({
    isPublic: true,
    isLocked: true,
    unlockedDate: { $lte: now },
  })
    .sort({ unlockedDate: -1 })
    .then((capsules) => res.json(capsules))
    .catch((error) => {
      console.error("Error fetching public capsules:", error);
      res.status(500).json({ message: "Server error" });
    });
});

// GET /public/:id
router.get("/public/:id", (req, res) => {
  const now = new Date();

  TimeCapsule.findOne({
    _id: req.params.id,
    isPublic: true,
    isLocked: true,
    unlockedDate: { $lte: now },
  })
    .populate("createdBy", "username")
    .populate("participants", "username")
    .then((capsule) => {
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      res.json(capsule);
    })
    .catch((error) => {
      console.error("Error fetching public capsule:", error);
      res.status(500).json({ message: "Server error" });
    });
});

// PUT /api/capsules/:id
router.put("/capsules/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;
  const {
    title,
    description,
    unlockedDate,
    isPublic,
    isLocked,
    participants,
    items,
  } = req.body;

  TimeCapsule.findById(id)
    .then((capsule) => {
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }

      if (capsule.createdBy.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this capsule" });
      }

      return TimeCapsule.findByIdAndUpdate(
        id,
        {
          title,
          description,
          unlockedDate,
          isPublic,
          isLocked,
          participants,
          items,
        },
        { new: true }
      );
    })
    .then((updatedCapsule) => {
      if (updatedCapsule) {
        res.json(updatedCapsule);
      }
    })
    .catch((error) => {
      console.error("Error updating capsule:", error);
      res.status(400).json({ error: "Failed to update capsule" });
    });
});

//DELETE Capsule - DELETE /api/capsules/:id
router.delete("/capsules/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;

  TimeCapsule.findById(id)
    .then((capsule) => {
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }

      if (capsule.createdBy.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this capsule" });
      }

      return TimeCapsule.findByIdAndDelete(id);
    })
    .then((deletedCapsule) => {
      if (deletedCapsule) {
        res.json({ message: "Capsule deleted successfully" });
      }
    })
    .catch((error) => {
      console.error("Error deleting capsule:", error);
      res.status(500).json({ error: "Failed to delete capsule" });
    });
});

module.exports = router;
