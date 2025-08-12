const { Schema, model } = require("mongoose");

const timeCapsuleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    image: {
      type: String,
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
    emails: [
      {
        type: String,
      },
    ],
    items: [
      {
        type: {
          type: String,
          required: true,
          enum: ["text", "image", "video", "audio", "document"],
        },
        content: {
          type: String,
          required: true,
        },
        style: {
          type: String,
          default: "default",
        },
        fontSize: {
          type: String,
        },
        fontFamily: {
          type: String,
        },
        fontColor: {
          type: String,
        },
        metadata: {
          type: Object,
          default: {},
        },
      },
    ],
    backgroundMusic: {
      type: String,
    },
    slideshowTimeout: {
      type: Number,
      default: 5000
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const TimeCapsule = model("TimeCapsule", timeCapsuleSchema);

module.exports = TimeCapsule;
