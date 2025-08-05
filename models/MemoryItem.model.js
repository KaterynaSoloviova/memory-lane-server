const { Schema, model } = require("mongoose");

const memoryItemSchema = new Schema(
  {
    index: {
      type: Number,
      required: [true, "Index is required."],
    },
    content: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio"], 
      default: "text",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    capsuleId: {
      type: Schema.Types.ObjectId,
      ref: "TimeCapsule",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const MemoryItem = model("MemoryItem", memoryItemSchema);

module.exports = MemoryItem;
