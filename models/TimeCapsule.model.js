const { Schema, model } = require("mongoose");

const timeCapsuleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unlockedDate: {
      type: Date,
      required: [true, "Unlock date is required."],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "MemoryItem",
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const TimeCapsule = model("TimeCapsule", timeCapsuleSchema);

module.exports = TimeCapsule;
