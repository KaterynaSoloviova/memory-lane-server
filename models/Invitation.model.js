const { Schema, model } = require("mongoose");

const invitationSchema = new Schema(
  {
    capsule: {
      type: Schema.Types.ObjectId,
      ref: "TimeCapsule",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Invitation = model("Invitation", invitationSchema);
module.exports = Invitation;
