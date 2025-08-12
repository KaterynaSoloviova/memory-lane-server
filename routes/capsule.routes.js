const router = require("express").Router();
const TimeCapsule = require("../models/TimeCapsule.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const {isLocked, isUnlocked, isOwner, isDraft, canSeeCapsule} = require("../utils/validators")

// POST /api/capsules - create a new capsule
router.post("/capsules", isAuthenticated, (req, res) => {
  const {
    title,
    image,
    description,
    unlockedDate,
    isPublic,
    isLocked,
    emails,
    items,
    backgroundMusic,
  } = req.body;

  TimeCapsule.create({
    title,
    image,
    description,
    unlockedDate,
    isPublic,
    isLocked,
    participants: [],
    emails,
    items,
    backgroundMusic,
    createdBy: req.payload._id,
  })
    .then((newCapsule) => res.status(201).json(newCapsule))
    .catch((error) => {
      console.error("Error creating capsule:", error);
      res.status(400).json({ error: error.message });
    });
});

// GET /api/capsules - get all capsules user can see
router.get("/capsules", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  TimeCapsule.find({
    $or: [
      { createdBy: userId },
      { participants: userId },
      { $and: [{ isPublic: true }, { isLocked: true }] },
    ],
  })
    .populate("createdBy", "username")
    .populate("participants", "username")
    .then((capsules) => res.json(capsules))
    .catch((error) => {
      console.error("Error fetching capsules:", error);
      res.status(500).json({ error: "Failed to fetch capsules" });
    });
});

// GET /api/capsules/:id - get one capsule
router.get("/capsules/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;

  TimeCapsule.findById(id)
    .populate("createdBy", "name")
    .populate("participants", "name")
    .then((capsule) => {
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      if (!canSeeCapsule(capsule, userId)) {
        const { unlockedDate, isLocked } = capsule;
        return res.status(200).json({ _id: id, isLocked, unlockedDate });
      }

      res.json(capsule);
    })
    .catch((error) => {
      console.error("Error getting capsule:", error);
      res.status(500).json({ error: "Failed to get capsule" });
    });
});

// GET /api/public - all public unlocked capsules
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

// PUT /api/capsules/:id - update a capsule
router.put("/capsules/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const userId = req.payload._id;
  const {
    title,
    image,
    description,
    unlockedDate,
    isPublic,
    isLocked,
    emails,
    items,
    backgroundMusic,
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
          image,
          description,
          unlockedDate,
          isPublic,
          isLocked,
          emails,
          items,
          backgroundMusic,
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

// POST /api/capsules/:id/lock - lock a capsule
router.post("/capsules/:id/lock", isAuthenticated, (req, res) => {
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
          .json({ message: "You are not authorized to update this capsule" });
      }

      if (capsule.isLocked) {
        return res.status(409).json({ message: "Capsule is locked" });
      }

      return TimeCapsule.findByIdAndUpdate(
        id,
        {
          isLocked: true,
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

// DELETE /api/capsules/:id - delete a capsule
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
        return;
      }
    })
    .catch((error) => {
      console.error("Error deleting capsule:", error);
      res.status(500).json({ error: "Failed to delete capsule" });
    });
});

module.exports = router;
