const router = require("express").Router();
const TimeCapsule = require("../models/TimeCapsule.model");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  isAuthenticated,
  getTokenFromHeaders,
} = require("../middleware/jwt.middleware");
const { canSeeCapsule } = require("../utils/validators");
const { sendUnlockCapsuleEmail } = require("../utils/email");

// Helper function to decode JWT token and get user info
function decodeToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    console.error("Decode token: Invalid token provided:", err.message);
    return null;
  }
}

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
    slideshowTimeout,
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
    slideshowTimeout,
    createdBy: req.payload._id,
  })
    .then((newCapsule) => res.status(201).json(newCapsule))
    .catch((err) => {
      console.error("Create capsule: Error creating capsule:", err);
      res.status(400).json({ error: err.message });
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
    .catch((err) => {
      console.error("Fetch capsules: Error fetching capsules:", err);
      res.status(500).json({ error: err.message });
    });
});

// GET /api/capsules/:id - get one capsule (authentication optional)
router.get("/capsules/:id", (req, res) => {
  const { id: capsuleId } = req.params;
  const token = getTokenFromHeaders(req);

  if (!capsuleId || !mongoose.Types.ObjectId.isValid(capsuleId)) {
    return res.status(400).json({ error: "Capsule id is invalid" });
  }

  // If token is provided, try to decode it to get user info
  let userId = null;
  if (token) {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      userId = decodedToken._id;
    }
  }

  TimeCapsule.findById(capsuleId)
    .populate("createdBy")
    .populate("participants")
    .then((capsule) => {
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }

      // If user is authenticated, use their ID for access control
      if (userId) {
        if (!canSeeCapsule(capsule, userId)) {
          const { unlockedDate, isLocked } = capsule;
          return res.status(200).json({ _id: capsuleId, isLocked, unlockedDate });
        }
      } else {
        // For unlocked capsules, check if they're public
        if (!capsule.isPublic || !capsule.isLocked) {
          return res.status(404).json({ message: "Capsule not found" });
        }
      }

      res.json(capsule);
    })
    .catch((err) => {
      console.error("Get capsule: Error getting capsule:", err);
      res.status(500).json({ error: err.message });
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
    .catch((err) => {
      console.error("Fetch public capsules: Error fetching public capsules:", err);
      res.status(500).json({ message: err.message });
    });
});

// PUT /api/capsules/:id - update a capsule
router.put("/capsules/:id", isAuthenticated, (req, res) => {
  const { id: capsuleId } = req.params;
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
    slideshowTimeout,
  } = req.body;
  const userId = req.payload._id;
  
  if (!capsuleId || !mongoose.Types.ObjectId.isValid(capsuleId)) {
      return res.status(400).json({ error: "Capsule id is invalid" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  if (!unlockedDate) {
    return res.status(400).json({ message: "Unlocked date is required" });
  }

  TimeCapsule.findById(capsuleId)
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
        capsuleId,
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
          slideshowTimeout,
        },
        { new: true }
      );
    })
    .then((updatedCapsule) => {
      if (updatedCapsule) {
        res.json(updatedCapsule);
      }
    })
    .catch((err) => {
      console.error("Update capsule: Error updating capsule:", err);
      res.status(400).json({ error: err.message });
    });
});

// POST /api/capsules/:id/lock - lock a capsule
router.post("/capsules/:id/lock", isAuthenticated, (req, res) => {
  const { id: capsuleId } = req.params;
  const userId = req.payload._id;

  if (!capsuleId || !mongoose.Types.ObjectId.isValid(capsuleId)) {
    return res.status(400).json({ error: "Capsule id is invalid" });
  }

  TimeCapsule.findById(capsuleId)
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
        capsuleId,
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
    .catch((err) => {
      console.error("Update capsule: Error updating capsule:", err);
      res.status(400).json({ error: "Failed to update capsule" });
    });
});

// DELETE /api/capsules/:id - delete a capsule
router.delete("/capsules/:id", isAuthenticated, (req, res) => {
  const { id: capsuleId } = req.params;
  const userId = req.payload._id;

  if (!capsuleId || !mongoose.Types.ObjectId.isValid(capsuleId)) {
    return res.status(400).json({ error: "Capsule id is invalid" });
  }

  TimeCapsule.findById(capsuleId)
    .then((capsule) => {
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }

      if (capsule.createdBy.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this capsule" });
      }

      return TimeCapsule.findByIdAndDelete(capsuleId);
    })
    .then((deletedCapsule) => {
      if (deletedCapsule) {
        res.json({ message: "Capsule deleted successfully" });
        return;
      }
    })
    .catch((err) => {
      console.error("Delete capsule: Error deleting capsule:", err);
      res.status(500).json({ error: err.message });
    });
});

router.post("/trigger-unlocks", async (req, res) => {
  try {
    // Find capsules that are locked, not sent, and unlocked date is in the past
    const capsules = await TimeCapsule.find({
      isLocked: true,
      isSent: false,
      unlockedDate: { $lte: new Date(new Date().setHours(23, 59, 59, 999)) },
    });

    console.log(`Trigger unlocks: Found ${capsules.map((capsule) => capsule.title).join(",")} capsules`);
    for (const capsule of capsules) {
      const { emails, title } = capsule;
      const participants = capsule.participants;
      const registeredUsers = await User.find({ _id: { $in: participants } });
      const registeredUserEmails = registeredUsers.map((user) => user.email);
      const notRegisteredUserEmails = emails.filter(
        (email) => !registeredUserEmails.includes(email)
      );

      const allEmails = [...registeredUserEmails, ...notRegisteredUserEmails];
      console.log(`Trigger unlocks: Sending email to ${allEmails.join(",")}`);
      for (let i = 0; i < allEmails.length; i++) {
        const email = allEmails[i];
        console.log(`Trigger unlocks: Sending email to ${email}`);
        const capsuleLink = `${process.env.ORIGIN}/capsule/${capsule._id}`;
        await sendUnlockCapsuleEmail(email, title, capsuleLink);
      }
      await TimeCapsule.findByIdAndUpdate(capsule._id.toString(), { isSent: true });
    }

    res.json(capsules);
  } catch (err) {
    console.error("Trigger unlocks: Error triggering unlocks:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
