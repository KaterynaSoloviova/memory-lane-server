const router = require("express").Router();
const MemoryItem = require("../models/MemoryItem.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /memory-items - Create a memory item
router.post("/memory-items", isAuthenticated, (req, res) => {
  const { index, content, description, type, capsuleId } = req.body;

  MemoryItem.create({
    index,
    content,
    description,
    type,
    capsuleId,
    author: req.payload._id, // user from JWT
  })
    .then((newItem) => res.status(201).json(newItem))
    .catch((err) => {
      console.error("Error creating memory item:", err);
      res.status(500).json({ error: "Failed to create memory item" });
    });
});

// GET /memory-items/:capsuleId - Get all memory items for a capsule
router.get("/memory-items/:capsuleId", isAuthenticated, (req, res) => {
  const { capsuleId } = req.params;

  MemoryItem.find({ capsuleId })
    .populate("author", "-password") // Optional: populate author info (omit password)
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      console.error("Error getting memory items:", err);
      res.status(500).json({ error: "Failed to get memory items" });
    });
});

// PUT /memory-items/:id - Edit a memory item
router.put("/memory-items/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { content, description, type, index } = req.body;

  MemoryItem.findByIdAndUpdate(
    id,
    { content, description, type, index },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(404).json({ message: "Memory item not found" });
      }
      res.status(200).json(updatedItem);
    })
    .catch((err) => {
      console.error("Error updating memory item:", err);
      res.status(500).json({ error: "Failed to update memory item" });
    });
});

// DELETE /memory-items/:id - Delete a memory item
router.delete("/memory-items/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  MemoryItem.findByIdAndDelete(id)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res.status(404).json({ message: "Memory item not found" });
      }
      res.status(200).json({ message: "Memory item deleted" });
    })
    .catch((err) => {
      console.error("Error deleting memory item:", err);
      res.status(500).json({ error: "Failed to delete memory item" });
    });
});

module.exports = router;
