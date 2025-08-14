const router = require("express").Router();
const Comment = require("../models/Comment.model.js");
const TimeCapsule = require("../models/TimeCapsule.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const {
  isLocked,
  isUnlocked,
  isOwner,
  isDraft,
  canSeeCapsule,
} = require("../utils/validators");

// GET /comments/:capsuleId - Get all comments for a capsule
router.get("/comments/:capsuleId", isAuthenticated, async (req, res) => {
  const { capsuleId } = req.params;
  const userId = req.payload._id;

  try {
    const capsule = await TimeCapsule.findById(capsuleId)
      .populate("createdBy")
      .populate("participants");

    if (!capsule) return res.status(404).json({ message: "Capsule not found" });

    // Check access rules
    const isAllowed =
      isUnlocked(capsule) &&
      (capsule.isPublic ||
        isOwner(capsule, userId) ||
        capsule.participants.some((p) => p.equals(userId)));

    if (!isAllowed) {
      return res
        .status(403)
        .json({ message: "Not authorized to view comments" });
    }

    const comments = await Comment.find({ capsule: capsule._id }).populate(
      "author"
    );

    res.json(comments);
  } catch (err) {
    console.error("Get comments: Error getting comments:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /comments/:capsuleId - Create a comment
router.post("/comments/:capsuleId", isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.payload._id;
    const { capsuleId } = req.params;

    const capsule = await TimeCapsule.findById(capsuleId)
      .populate("createdBy")
      .populate("participants");

    if (!capsule) return res.status(404).json({ message: "Capsule not found" });

    // Private capsule check
    if (capsule.isPrivate) {
      const isAllowed =
        capsule.createdBy.equals(userId) ||
        capsule.participants.some((p) => p.equals(userId));

      if (!isAllowed) {
        return res.status(403).json({ message: "Not authorized to comment" });
      }
    }

    // Public capsules: any logged-in user can comment
    const createdComment = await Comment.create({
      capsule: capsule._id,
      author: userId,
      content,
    })
    const comment = await Comment.findById(createdComment._id).populate(
      "author"
    );
    res.status(201).json(comment);
  } catch (err) {
    console.error("Create comment: Error creating comment:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
